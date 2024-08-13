import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "./components/menu/Menu";
import Cart from "./components/cart/Cart";
import React, { useEffect } from "react";
import CartContext from "./context/CartContext";
import Orders from "./components/orders/Orders";
import useWakeLock from "react-use-wake-lock";
import Sidebar from "./components/sidebar/Sidebar";
import Riders from "./components/riders/Riders";

function App() {
  const { isSupported, isLocked, request, release } = useWakeLock();

  const { cart, setCart } = React.useContext(CartContext);
  const [activeView, setActiveView] = React.useState("orders");

  useEffect(() => {
    document.title = "Food App";
    setCart({ items: [], total: 0 });
  }, []);

  return (
    <div className="main">
      <div className="d-flex w-100 vh-100 p-3">
        <Sidebar activeView={activeView} setActiveView={setActiveView} className="p-0" style={{ width: "5%" }} />

        <Orders className="p-3" style={{ width: "20%" }} />

        {activeView === "orders" && (
          <>
            <Menu className="p-3 h-100" style={{ width: "45%" }} />
          </>
        )}
        {activeView === "stats" && <div className="p-3" style={{ width: "45%" }}></div>}
        {activeView === "dbs" && (
          <div className="p-3" style={{ width: "45%" }}>
            <Riders />
          </div>
        )}
        {activeView === "user" && <div className="p-3" style={{ width: "45%" }}></div>}

        <Cart className="p-3" style={{ width: "30%" }} />
      </div>
    </div>
  );
}

export default App;

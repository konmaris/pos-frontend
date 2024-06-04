import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "./components/menu/Menu";
import Cart from "./components/cart/Cart";
import React, { useEffect } from "react";
import CartContext from "./context/CartContext";
import Orders from "./components/orders/Orders";

function App() {
  const { cart, setCart } = React.useContext(CartContext);

  useEffect(() => {
    document.title = "Food App";
    setCart({ items: [], total: 0 });
  }, []);

  return (
    <div className="main">
      <div className="d-flex w-100 vh-100 p-3">
        <Orders className="p-3" style={{ flex: "20%" }} />
        <Menu className="p-3" style={{ flex: "55%" }} />
        <Cart className="p-3" style={{ flex: "25%" }} />
      </div>
    </div>
  );
}

export default App;

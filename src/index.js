import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CartProvider from "./context/CartProvider";
import OrdersProvider from "./context/OrdersProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <OrdersProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </OrdersProvider>
);

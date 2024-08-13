import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CartProvider from "./context/CartProvider";
import OrdersProvider from "./context/OrdersProvider";
import "./index.css";
import LoadingProvider from "./context/LoadingProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LoadingProvider>
    <OrdersProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </OrdersProvider>
  </LoadingProvider>
);

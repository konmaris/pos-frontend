import React, { useState } from "react";
import OrdersContext from "./OrdersContext";

const CartProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  React.useEffect(() => {
    console.log(orders);
  }, [orders]);

  return <OrdersContext.Provider value={{ orders, setOrders }}>{children}</OrdersContext.Provider>;
};

export default CartProvider;

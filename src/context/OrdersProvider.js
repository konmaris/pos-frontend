import React, { useEffect, useState } from "react";
import OrdersContext from "./OrdersContext";
import axios from "axios";

const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // fetch orders using axios

  return <OrdersContext.Provider value={{ orders, setOrders }}>{children}</OrdersContext.Provider>;
};

export default OrdersProvider;

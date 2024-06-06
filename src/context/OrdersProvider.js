import React, { useEffect, useState } from "react";
import OrdersContext from "./OrdersContext";
import axios from "axios";

const CartProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // fetch orders using axios
  const fetchOrders = async () => {
    await axios
      .get("https://pos-backend-356y.onrender.com/orders/current")
      .then((res) => {
        setOrders(res?.data?.reverse());
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  useEffect(() => {
    fetchOrders();

    setInterval(() => {
      fetchOrders();
    }, 1000);
    // setOrders([]);
  }, []);

  return <OrdersContext.Provider value={{ orders, setOrders }}>{children}</OrdersContext.Provider>;
};

export default CartProvider;

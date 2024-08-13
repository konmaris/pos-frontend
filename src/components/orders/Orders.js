import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Order from "./Order";
import OrdersContext from "../../context/OrdersContext";
import axios from "axios";

const Orders = (props) => {
  const [currKey, setCurrKey] = React.useState("active_orders");

  const { orders, setOrders } = React.useContext(OrdersContext);

  const [deliveryBoys, setDeliveryBoys] = React.useState([]);

  useEffect(() => {
    fetchOrders();
    fetchRiders();

    const i1 = setInterval(() => {
      fetchOrders();
    }, 1000);

    const i2 = setInterval(() => {
      fetchRiders();
    }, 10000);

    return () => {
      clearInterval(i1);
      clearInterval(i2);
    };
  }, []);

  const fetchRiders = async () => {
    await axios.get("http://192.168.68.101:8000/deliveryBoys").then((res) => {
      setDeliveryBoys(res.data);
    });
  };

  const fetchOrders = async () => {
    await axios
      .get("http://192.168.68.101:8000/orders/current")
      .then((res) => {
        setOrders(res?.data?.reverse());
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  const activeOrders = orders.filter((order) => order.status !== "COMPLETED" && order.status !== "CANCELLED");
  const pastOrders = orders.filter((order) => order.status === "COMPLETED" || order.status === "CANCELLED");

  const activeOrdersMap = activeOrders.map((order, idx) => {
    const deliveryBoy = deliveryBoys.find((db) => db._id === order.deliveryBoy);
    // console.log(deliveryBoy);

    const orderSource = order.source;
    const orderId = order._id;
    const orderStatus = order.status;
    const orderNumber = order.dailyOrderNumber;
    const type = order.type;
    const items = order.order.items;
    const orderTime = order.orderTime;
    const deliveryTime = order.deliveryTime;
    const address = order.customer.street + " " + order.customer.streetNumber;
    const amount = order.order.total;

    return <Order source={orderSource} oid={orderId} type={type} status={orderStatus} deliveryBoys={deliveryBoys} deliveryBoy={deliveryBoy} idx={idx} key={`order-${orderId}`} orderNumber={orderNumber} items={items} orderTime={orderTime} deliveryTime={deliveryTime} address={address} amount={amount} />;
  });

  const pastOrdersMap = pastOrders.map((order, idx) => {
    const deliveryBoy = deliveryBoys.find((db) => db._id === order.deliveryBoy);

    const orderSource = order.source;
    const orderId = order._id;
    const orderStatus = order.status;
    const type = order.type;
    const orderNumber = order.dailyOrderNumber;
    const items = order.order.items;
    const orderTime = order.orderTime;
    const deliveryTime = order.deliveryTime;
    const address = order.customer.street + " " + order.customer.streetNumber;
    const amount = order.order.total;

    return <Order source={orderSource} oid={orderId} type={type} deliveryBoys={deliveryBoys} deliveryBoy={deliveryBoy} status={orderStatus} idx={idx} key={`order-${orderId}`} orderNumber={orderNumber} items={items} orderTime={orderTime} deliveryTime={deliveryTime} address={address} amount={amount} />;
  });

  return (
    <div className={props.className} style={props.style}>
      <div style={{}} className="d-flex flex-column mb-4 w-100 align-content-center ">
        {/* <h2 className="m-0 mb-4 p-0" style={{ flex: "100%" }}>
          Orders
        </h2> */}
        <Nav
          variant="pills"
          activeKey={currKey}
          onSelect={(e) => {
            setCurrKey(e);
          }}
          defaultActiveKey="active_orders"
          className="mb-4"
        >
          <Nav.Item key="active_orders">
            <Nav.Link style={{ fontSize: 14 }} eventKey="active_orders">
              ACTIVE
            </Nav.Link>
          </Nav.Item>
          <Nav.Item key="past_orders">
            <Nav.Link style={{ fontSize: 14 }} eventKey="past_orders">
              PAST
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <div style={{ height: "75vh", maxHeight: "75vh", overflowY: "scroll", background: "" }}>
          {currKey === "active_orders" && activeOrdersMap}
          {currKey === "past_orders" && pastOrdersMap}
          {currKey === "active_orders" && activeOrdersMap.length === 0 && (
            <div style={{ marginTop: "0px", backgroundColor: "", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", width: "100%", height: "100%", fontWeight: 500, fontSize: 24 }}>
              <p style={{ fontSize: 82, padding: 0, margin: 0 }}>🛸</p>
              <p style={{ width: "fit-content", height: "fit-content", padding: 0, margin: 0, textAlign: "center" }}>No active orders for now, sit back!</p>
            </div>
          )}
          {currKey === "past_orders" && pastOrdersMap.length === 0 && (
            <div style={{ marginTop: "0px", backgroundColor: "", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", width: "100%", height: "100%", fontWeight: 500, fontSize: 24 }}>
              <p style={{ fontSize: 82, padding: 0, margin: 0 }}>🧟‍♂️</p>
              <p style={{ width: "fit-content", height: "fit-content", padding: 0, margin: 0, textAlign: "center" }}>No past orders yet, not for long!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;

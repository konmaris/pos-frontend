import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Order from "./Order";
import OrdersContext from "../../context/OrdersContext";
import axios from "axios";

const Orders = (props) => {
  const [currKey, setCurrKey] = React.useState("active_orders");

  const { orders } = React.useContext(OrdersContext);

  const [deliveryBoys, setDeliveryBoys] = React.useState([]);

  useEffect(() => {
    axios.get("https://pos-backend-356y.onrender.com/deliveryBoys").then((res) => {
      setDeliveryBoys(res.data);
    });
  }, []);

  useEffect(() => {
    //console.log(deliveryBoys);
  }, [deliveryBoys]);

  useEffect(() => {
    //console.log(orders);
  }, [orders]);

  const activeOrdersMap = orders.map((order, idx) => {
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

    if (order.status !== "COMPLETED") {
      return <Order source={orderSource} oid={orderId} type={type} status={order.status} deliveryBoy={order.deliveryBoy} idx={idx} key={`order-${orderStatus}-${orderId}`} orderNumber={orderNumber} items={items} orderTime={orderTime} deliveryTime={deliveryTime} address={address} amount={amount} />;
    } else {
      return <></>;
    }
  });

  const pastOrdersMap = orders.map((order, idx) => {
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

    if (order.status === "COMPLETED" || order.status === "CANCELLED") {
      return <Order source={orderSource} oid={orderId} type={type} deliveryBoy={order.deliveryBoy} status={order.status} idx={idx} key={`order-${orderStatus}-${orderId}`} orderNumber={orderNumber} items={items} orderTime={orderTime} deliveryTime={deliveryTime} address={address} amount={amount} />;
    } else {
      return <></>;
    }
  });

  return (
    <div className={props.className} style={props.style}>
      <div style={{}} className="d-flex flex-column mb-4 w-100 align-content-center ">
        <h2 className="m-0 mb-4 p-0" style={{ flex: "100%" }}>
          Orders
        </h2>
        <Nav
          variant="pills"
          activeKey={currKey}
          onSelect={(e) => {
            setCurrKey(e);
          }}
          defaultActiveKey="active_orders"
          style={{ marginBottom: "1rem" }}
          className="mb-4"
        >
          <Nav.Item key="active_orders">
            <Nav.Link style={{ fontSize: 12 }} eventKey="active_orders">
              ACTIVE
            </Nav.Link>
          </Nav.Item>
          <Nav.Item key="past_orders">
            <Nav.Link style={{ fontSize: 12 }} eventKey="past_orders">
              PAST
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <div style={{ maxHeight: "75vh", overflowY: "hidden" }}>{currKey === "active_orders" ? activeOrdersMap : currKey === "past_orders" ? pastOrdersMap : ""}</div>
      </div>
    </div>
  );
};

export default Orders;

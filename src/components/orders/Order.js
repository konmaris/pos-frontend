import React, { useEffect } from "react";
import { Bicycle, Geo, GeoAlt, GeoAltFill, PersonWalking, Receipt } from "react-bootstrap-icons";
import truncateString from "../../functions/truncateString";
import { Badge } from "react-bootstrap";
import OrdersContext from "../../context/OrdersContext";
import AssignModal from "./AssignModal";
import OrderModal from "./OrderModal";

const deliveryBoys = ["Andreas", "Nikos", "Giannis"];

const Order = (props) => {
  const orderStatuses = {
    NEW_ORDER: "NEW ORDER",
    ASSIGNED: "ASSIGNED",
    DELIVERED: "ON THE ROAD",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
  };

  const [orderStatus, setOrderStatus] = React.useState(props.status);
  const [orderStatusColor, setOrderStatusColor] = React.useState("success");

  const [assignShow, setAssignShow] = React.useState(false);
  const [orderShow, setOrderShow] = React.useState(false);

  const [deliveryBoy, setDeliveryBoy] = React.useState(props.deliveryBoy);

  const { orders, setOrders } = React.useContext(OrdersContext);

  useEffect(() => {
    setOrderStatusColor(getStatusColor(orderStatus));

    const orders_ = [...orders];

    orders_[props.idx].status = orderStatus;
    orders_[props.idx].deliveryBoy = deliveryBoy;

    setOrders(orders_);
  }, [orderStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case orderStatuses.NEW_ORDER:
        return "#009a36";
      case orderStatuses.ASSIGNED:
        return "#004a9a";
      case orderStatuses.DELIVERED:
        return "#9a008d";
      case orderStatuses.COMPLETED:
        return "#000000";
      case orderStatuses.CANCELLED:
        return "#9a0000";
      default:
        return "secondary";
    }
  };

  const orderTimeInMillis = parseInt(props.orderTime);
  const orderTime = new Date(orderTimeInMillis).toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit", hour12: false });
  const deliveryTimeInMillis = parseInt(props.deliveryTime);

  const [minutesLeft, setMinutesLeft] = React.useState((deliveryTimeInMillis - Date.now()) / 60000);

  useEffect(() => {
    const interval = setInterval(() => {
      const minutesLeft = (deliveryTimeInMillis - Date.now()) / 60000;
      setMinutesLeft(minutesLeft);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        onClick={() => {
          if (orderStatus !== orderStatuses.COMPLETED && orderStatus !== orderStatuses.CANCELLED) {
            if (orderStatus === orderStatuses.ASSIGNED) {
              setOrderStatus(orderStatuses.DELIVERED);
            } else if (orderStatus === orderStatuses.DELIVERED) {
              setOrderStatus(orderStatuses.COMPLETED);
            } else if (orderStatus === orderStatuses.COMPLETED) {
              setOrderStatus(orderStatuses.CANCELLED);
            }
          }
        }}
        className="d-flex flex-column mb-3 border p-2 rounded"
      >
        <div className="d-flex flex-row w-100">
          <span onClick={() => setOrderShow(true)} className="w-100" style={{ fontSize: 24, fontWeight: 700, margin: 0, height: "fit-content" }}>
            #{String(props.orderNumber).padStart(3, "0")}
          </span>
          {orderStatus !== orderStatuses.CANCELLED && orderStatus !== orderStatuses.COMPLETED && <span style={{ margin: 0, marginRight: "5px", height: "fit-content", fontWeight: 600, fontSize: 22, color: minutesLeft > 0 ? "green" : "red" }}>{minutesLeft.toString().split(".")[0]}'</span>}
        </div>

        <span style={{ width: "100%", textAlign: "left", fontWeight: "300", marginBottom: "4px" }}>{orderTime}</span>

        <Badge pill bg="none" style={{ width: "fit-content", marginBottom: "5px", backgroundColor: orderStatusColor }}>
          {orderStatus}
        </Badge>

        <div className="d-flex flex-row w-100">
          {props.type === "delivery" && (
            <span style={{ flex: "100", alignSelf: "center" }}>
              <GeoAltFill style={{ fontSize: 20, margin: 0, marginRight: "5px", color: "#0082e6" }} />
              {truncateString(props.address, 16).toUpperCase()}
            </span>
          )}
          {orderStatus === orderStatuses.NEW_ORDER && (
            <span
              className="d-flex"
              onClick={() => {
                console.log("assign clicked");
                setAssignShow(true);
              }}
            >
              <Bicycle style={{ fontSize: 36, margin: 0, marginRight: "5px", color: "#0082e6" }} />
            </span>
          )}
        </div>

        {orderStatus === orderStatuses.ASSIGNED && (
          <span className="d-flex">
            <Bicycle style={{ fontSize: 22, margin: 0, marginRight: "5px", color: "#0082e6" }} />
            <span style={{ margin: 0, fontWeight: 500 }}>{deliveryBoy.toUpperCase()}</span>
          </span>
        )}

        {orderStatus === orderStatuses.DELIVERED && (
          <span className="d-flex">
            <Bicycle style={{ fontSize: 22, margin: 0, marginRight: "5px", color: "#0082e6" }} />
            <span style={{ margin: 0, fontWeight: 500 }}>{deliveryBoy.toUpperCase()}</span>
          </span>
        )}

        {props.type === "takeaway" && (
          <span className="d-flex">
            <PersonWalking style={{ fontSize: 22, margin: 0, marginRight: "5px", color: "#0082e6" }} />
            <span style={{ margin: 0, fontWeight: 500 }}>TAKEAWAY</span>
          </span>
        )}

        {props.type === "delivery" && orderStatus === orderStatuses.COMPLETED && (
          <span className="d-flex">
            <Bicycle style={{ fontSize: 22, margin: 0, marginRight: "5px", color: "#0082e6" }} />
            <span style={{ margin: 0, fontWeight: 500 }}>{deliveryBoy.toUpperCase()}</span>
          </span>
        )}

        <AssignModal
          show={assignShow}
          setShow={setAssignShow}
          deliveryBoys={[
            { id: 1, name: "DV1" },
            { id: 2, name: "DV2" },
            { id: 3, name: "DV3" },
          ]}
          setDeliveryBoy={setDeliveryBoy}
          setOrderStatus={setOrderStatus}
        />

        <OrderModal show={orderShow} setShow={setOrderShow} />
      </div>
    </>
  );
};

export default Order;

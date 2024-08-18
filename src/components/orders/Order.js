import React, { useEffect } from "react";
import { Bicycle, Geo, GeoAlt, GeoAltFill, PersonWalking, Receipt } from "react-bootstrap-icons";
import truncateString from "../../functions/truncateString";
import { Badge } from "react-bootstrap";
import OrdersContext from "../../context/OrdersContext";
import AssignModal from "./AssignModal";
import OrderModal from "./OrderModal";
import axios from "axios";

// const deliveryBoys = ["Andreas", "Nikos", "Giannis"];

const Order = (props) => {
  const orderStatuses = {
    NEW_ORDER: "NEW_ORDER",
    ASSIGNED: "ASSIGNED",
    DELIVERED: "DELIVERED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
  };

  const [deliveryBoy, setDeliveryBoy] = React.useState("");

  const getOrderStatusLabel = (status) => {
    switch (status) {
      case orderStatuses.NEW_ORDER:
        return "New Order";
      case orderStatuses.ASSIGNED:
        return "Assigned";
      case orderStatuses.DELIVERED:
        return "Delivered";
      case orderStatuses.COMPLETED:
        return "Completed";
      case orderStatuses.CANCELLED:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const [assignShow, setAssignShow] = React.useState(false);
  const [orderShow, setOrderShow] = React.useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case orderStatuses.NEW_ORDER:
        return "#9a0000";
      case orderStatuses.ASSIGNED:
        return "#004a9a";
      case orderStatuses.DELIVERED:
        return "#9a008d";
      case orderStatuses.COMPLETED:
        return "#009a36";
      case orderStatuses.CANCELLED:
        return "#555555";
      default:
        return "secondary";
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case "telephone":
        return "#121212";
      case "efood":
        return "#e03800";
      case "wolt":
        return "#00579a";
      case "box":
        return "#a06d00";
      case "walkin":
        return "#c123ff";
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
    <div className="d-flex flex-column mb-3 border p-2 rounded">
      <div className="d-flex flex-row w-100">
        <div className="w-100 d-flex">
          <span onClick={() => setOrderShow(true)} className="" style={{ fontSize: 24, fontWeight: 700, margin: 0, height: "fit-content" }}>
            #{String(props.orderNumber).padStart(3, "0")}
          </span>
          <Badge pill bg="none" style={{ width: "fit-content", marginLeft: "5px", marginBottom: "0px", alignSelf: "center", backgroundColor: getSourceColor(props.source), fontSize: "8px" }}>
            {props.source?.toUpperCase()}
          </Badge>
        </div>
        {props.status !== orderStatuses.CANCELLED && props.status !== orderStatuses.COMPLETED && <span style={{ margin: 0, marginRight: "5px", height: "fit-content", fontWeight: 600, fontSize: 22, color: minutesLeft > 0 ? "green" : "red" }}>{minutesLeft.toString().split(".")[0]}'</span>}
      </div>

      <span style={{ width: "100%", textAlign: "left", fontWeight: "300", marginBottom: "4px" }}>{orderTime}</span>

      <div
        onClick={() => {
          if (props.status !== orderStatuses.COMPLETED && props.status !== orderStatuses.CANCELLED) {
            if (props.status === orderStatuses.ASSIGNED) {
              axios.put(`https://esp-pos-backend.onrender.com/orders/status`, {
                orderId: props.oid,
                status: orderStatuses.DELIVERED,
              });
              // setOrderStatus(orderStatuses.DELIVERED);
            } else if (props.status === orderStatuses.DELIVERED) {
              axios.put(`https://esp-pos-backend.onrender.com/orders/status`, {
                orderId: props.oid,
                status: orderStatuses.COMPLETED,
              });
              // setOrderStatus(orderStatuses.COMPLETED);
            }
          }
        }}
      >
        <Badge pill bg="none" style={{ width: "fit-content", marginBottom: "5px", backgroundColor: getStatusColor(props.status) }}>
          {getOrderStatusLabel(props.status).toUpperCase()}
        </Badge>
      </div>
      <div className="d-flex flex-row w-100">
        {props.type === "delivery" && (
          <span style={{ flex: "100", alignSelf: "center" }}>
            <GeoAltFill style={{ fontSize: 20, margin: 0, marginRight: "5px", color: "#0082e6" }} />
            {truncateString(props.address, 16).toUpperCase()}
          </span>
        )}
        {props.status === orderStatuses.NEW_ORDER && (
          <span
            className="d-flex"
            onClick={() => {
              ////console.log("assign clicked");
              setAssignShow(true);
            }}
          >
            <Bicycle style={{ fontSize: 36, margin: 0, marginRight: "5px", color: "#0082e6" }} />
          </span>
        )}
      </div>

      {props.status === orderStatuses.ASSIGNED && (
        <span className="d-flex">
          <Bicycle style={{ fontSize: 22, margin: 0, marginRight: "5px", color: "#0082e6" }} />
          <span style={{ margin: 0, fontWeight: 500 }}>
            {props?.deliveryBoy?.name.split(" ")[0].toUpperCase()} {props?.deliveryBoy?.name.split(" ")[1][0].toUpperCase()}.
          </span>
        </span>
      )}

      {props.status === orderStatuses.DELIVERED && (
        <span className="d-flex">
          <Bicycle style={{ fontSize: 22, margin: 0, marginRight: "5px", color: "#0082e6" }} />
          <span style={{ margin: 0, fontWeight: 500 }}>
            {props?.deliveryBoy?.name.split(" ")[0].toUpperCase()} {props?.deliveryBoy?.name.split(" ")[1][0].toUpperCase()}.
          </span>
        </span>
      )}

      {props.type === "takeaway" && (
        <span className="d-flex">
          <PersonWalking style={{ fontSize: 22, margin: 0, marginRight: "5px", color: "#0082e6" }} />
          <span style={{ margin: 0, fontWeight: 500 }}>TAKEAWAY</span>
        </span>
      )}

      {props.type === "delivery" && props.status === orderStatuses.COMPLETED && (
        <span className="d-flex">
          <Bicycle style={{ fontSize: 22, margin: 0, marginRight: "5px", color: "#0082e6" }} />
          <span style={{ margin: 0, fontWeight: 500 }}>
            {props?.deliveryBoy?.name.split(" ")[0].toUpperCase()} {props?.deliveryBoy?.name.split(" ")[1][0].toUpperCase()}.
          </span>
        </span>
      )}

      <AssignModal orderId={props.oid} show={assignShow} setShow={setAssignShow} deliveryBoys={props.deliveryBoys} setDeliveryBoy={setDeliveryBoy} />

      <OrderModal deliveryBoys={props.deliveryBoys} type={props.type} status={props.status} deliveryBoy={props?.deliveryBoy?.name} order={props.oid} show={orderShow} setShow={setOrderShow} />
    </div>
  );
};

export default Order;

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
  const [deliveryBoys, setDeliveryBoys] = React.useState([]);
  const [deliveryBoy, setDeliveryBoy] = React.useState("");

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = () => {
    //use axios
    axios.get("http://localhost:8000/deliveryBoys").then((res) => {
      setDeliveryBoys(res.data);
      //console.log(res.data);

      const dbName = res.data.find((db) => db._id === props.deliveryBoy);

      setDeliveryBoy(dbName?.name);
    });
  };

  const orderStatuses = {
    NEW_ORDER: "NEW_ORDER",
    ASSIGNED: "ASSIGNED",
    DELIVERED: "DELIVERED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
  };

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

  const [orderStatus, setOrderStatus] = React.useState(props.status);
  const [orderSource, setOrderSource] = React.useState(props.source);
  const [orderStatusColor, setOrderStatusColor] = React.useState("success");
  const [orderSourceColor, setOrderSourceColor] = React.useState("success");

  const [assignShow, setAssignShow] = React.useState(false);
  const [orderShow, setOrderShow] = React.useState(false);

  useEffect(() => {
    setOrderStatusColor(getStatusColor(orderStatus));
  }, [orderStatus]);

  useEffect(() => {
    setOrderSourceColor(getSourceColor(orderSource));
  }, [orderSource]);

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
              axios.put(`http://localhost:8000/orders/status`, {
                orderId: props.oid,
                status: orderStatuses.DELIVERED,
              });
              // setOrderStatus(orderStatuses.DELIVERED);
            } else if (orderStatus === orderStatuses.DELIVERED) {
              axios.put(`http://localhost:8000/orders/status`, {
                orderId: props.oid,
                status: orderStatuses.COMPLETED,
              });
              // setOrderStatus(orderStatuses.COMPLETED);
            }
          }
        }}
        className="d-flex flex-column mb-3 border p-2 rounded"
      >
        <></>
        <div className="d-flex flex-row w-100">
          <div className="w-100 d-flex">
            <span onClick={() => setOrderShow(true)} className="" style={{ fontSize: 24, fontWeight: 700, margin: 0, height: "fit-content" }}>
              #{String(props.orderNumber).padStart(3, "0")}
            </span>
            <Badge pill bg="none" style={{ width: "fit-content", marginLeft: "5px", marginBottom: "0px", alignSelf: "center", backgroundColor: orderSourceColor, fontSize: "8px" }}>
              {orderSource?.toUpperCase()}
            </Badge>
          </div>
          {orderStatus !== orderStatuses.CANCELLED && orderStatus !== orderStatuses.COMPLETED && <span style={{ margin: 0, marginRight: "5px", height: "fit-content", fontWeight: 600, fontSize: 22, color: minutesLeft > 0 ? "green" : "red" }}>{minutesLeft.toString().split(".")[0]}'</span>}
        </div>

        <span style={{ width: "100%", textAlign: "left", fontWeight: "300", marginBottom: "4px" }}>{orderTime}</span>

        <div>
          <Badge pill bg="none" style={{ width: "fit-content", marginBottom: "5px", backgroundColor: orderStatusColor }}>
            {getOrderStatusLabel(orderStatus).toUpperCase()}
          </Badge>
        </div>
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
                //console.log("assign clicked");
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
            <span style={{ margin: 0, fontWeight: 500 }}>{deliveryBoy && deliveryBoy?.split(" ")[0]?.toUpperCase() + " " + deliveryBoy?.split(" ")[1][0] + "."}</span>
          </span>
        )}

        {orderStatus === orderStatuses.DELIVERED && (
          <span className="d-flex">
            <Bicycle style={{ fontSize: 22, margin: 0, marginRight: "5px", color: "#0082e6" }} />
            <span style={{ margin: 0, fontWeight: 500 }}>{deliveryBoy && deliveryBoy?.split(" ")[0].toUpperCase() + " " + deliveryBoy?.split(" ")[1][0] + "."}</span>
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
            <span style={{ margin: 0, fontWeight: 500 }}>{deliveryBoy && deliveryBoy?.split(" ")[0].toUpperCase() + " " + deliveryBoy?.split(" ")[1][0] + "."}</span>
          </span>
        )}

        <AssignModal orderId={props.oid} show={assignShow} setShow={setAssignShow} deliveryBoys={deliveryBoys} setDeliveryBoy={setDeliveryBoy} />

        <OrderModal show={orderShow} setShow={setOrderShow} />
      </div>
    </>
  );
};

export default Order;

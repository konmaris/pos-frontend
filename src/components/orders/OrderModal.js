import axios from "axios";
import moment from "moment";
import React, { useEffect } from "react";
import { Modal, Button, Form, Table, Container, Row, Col, Badge } from "react-bootstrap";
import { ArrowLeftRight, CheckLg, Pencil, PencilFill, Printer, PrinterFill, XLg, XOctagon } from "react-bootstrap-icons";
import ReactSelect from "react-select";

const OrderModal = (props) => {
  const [order, setOrder] = React.useState({});
  const [editDeliveryBoy, setEditDeliveryBoy] = React.useState(false);
  const [db, setDb] = React.useState("");
  const [_dbs, setDbs] = React.useState([]);
  const [showCancelModal, setShowCancelModal] = React.useState(false);

  const handleCancelOrder = async () => {
    await axios
      .put("https://esp-pos-backend.onrender.com/orders/cancel", {
        orderId: props.order,
      })
      .then((res) => {
        //console.log(res);
        fetchOrder();
        setShowCancelModal(false);
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  const fetchRiders = async () => {
    await axios.get("https://esp-pos-backend.onrender.com/deliveryBoys").then((res) => {
      let dbs = [];
      res.data
        .filter((db) => db.status === "active")
        .forEach((db) => {
          dbs.push({ value: db._id, label: db.name });
        });

      setDbs(dbs);
    });
  };

  const fetchOrder = () => {
    axios
      .get(`https://esp-pos-backend.onrender.com/orders/${props.order}`)
      .then((res) => {
        setOrder(res.data);

        //console.log(res.data);
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  const handleClose = () => {
    setEditDeliveryBoy(false);
    props.setShow(false);
  };

  const getPaymentMethodLabel = (paymentMethod) => {
    switch (paymentMethod) {
      case "cash":
        return "Cash";
      case "prepaid":
        return "Prepaid";
      case "card":
        return "Card";
      case "online":
        return "Online";
      case "iris":
        return "Iris";
      default:
        return "Unknown";
    }
  };

  let orderTime = new Date(parseInt(order?.orderTime));
  let deliveryTime = new Date(parseInt(order?.deliveryTime));

  const orderItems = order?.order?.items?.map((item, idx) => {
    const itemExtras = item?.extras?.map((extra, idx) => {
      return (
        <li key={idx} style={{ backgroundColor: "" }}>
          <Row>
            <Col style={{ fontWeight: 700, color: "#fff" }}>{item.quantity}x</Col>
            <Col style={{ fontWeight: 400 }} xs={8}>
              {extra.optionLabel}
            </Col>
            <Col style={{ textAlign: "left", fontWeight: 600, color: "#fff" }}>{(item.quantity * item.price).toFixed(2)}€</Col>
          </Row>
        </li>
      );
    });

    return (
      <li key={idx}>
        <Container className="mb-3">
          <Row>
            <Col style={{ fontWeight: 700, color: item?.category === "special_charge" ? "#fff" : "#000" }}>{item.quantity}x</Col>
            <Col style={{ fontWeight: 600 }} xs={8}>
              {item.name}
            </Col>
            <Col style={{ textAlign: "right", fontWeight: 600 }}>{(item.quantity * item.price).toFixed(2)}€</Col>
          </Row>
          <ul style={{ padding: 0, listStyle: "none" }}>{itemExtras}</ul>
          {item.comments && (
            <Row>
              <Col style={{ fontWeight: 700, color: "#fff" }}>{item.quantity}x</Col>
              <Col style={{ fontWeight: 400 }} xs={8}>
                <span style={{ fontWeight: 500 }}>* {item.comments}</span>
              </Col>
              <Col style={{ textAlign: "right", fontWeight: 600, color: "#fff" }}>{(item.quantity * item.price).toFixed(2)}€</Col>
            </Row>
          )}
        </Container>
      </li>
    );
  });

  React.useEffect(() => {
    fetchOrder();
    //console.log(props.deliveryBoys);
    setDbs([]);

    // props.deliveryBoys
    //   ?.filter((db) => db.status === "active")
    //   ?.forEach((db) => {
    //     setDbs((prev_dbs) => [...prev_dbs, { value: db._id, label: db.name }]);
    //   });

    fetchRiders();

    // find the delivery boy from _dbs using props.deliveryBoy
  }, []);

  let orderTotal = 0;

  order?.order?.items?.forEach((item) => {
    if (item.id !== "discount") {
      orderTotal += item.quantity * item.price;
    } else {
      orderTotal -= item.quantity * item.price;
    }
  });

  return (
    <div>
      <Modal scrollable show={props.show} onHide={handleClose}>
        <Modal.Header className="d-flex">
          <Modal.Title style={{ flex: 100 }}>#{String(order?.dailyOrderNumber).padStart(3, "0")}</Modal.Title>

          <Badge className="mx-1" pill bg="primary">
            {props?.status === "ASSIGNED" ? "ASSIGNED" : props?.status === "DELIVERED" ? "DELIVERED" : props?.status === "COMPLETED" ? "COMPLETED" : props?.status === "CANCELLED" ? "CANCELLED" : "NEW ORDER"}
          </Badge>
          <Badge className="mx-1" pill bg="" style={{ backgroundColor: "#810050" }}>
            {order?.source === "efood" ? "EFOOD" : order?.source === "wolt" ? "WOLT" : order?.source === "box" ? "BOX" : order?.source === "telephone" ? "TELEPHONE" : order?.source === "walkin" ? "WALK-IN" : "UNKNOWN"}
          </Badge>
          <Badge className="mx-1" pill bg="danger">
            {order?.type === "delivery" ? "DELIVERY" : order?.type === "takeaway" ? "TAKEAWAY" : "UNKNOWN"}
          </Badge>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Container className="m-0 p-0">
              <Row>
                <Col style={{ fontWeight: 500 }}>Order time:</Col>
                <Col xs={7}>{orderTime.toLocaleTimeString("el-GR", { hour12: false, hour: "2-digit", minute: "2-digit" })}</Col>
              </Row>
              <Row>
                <Col style={{ fontWeight: 500 }}>Delivery time:</Col>
                <Col xs={7}>{deliveryTime.toLocaleTimeString("el-GR", { hour12: false, hour: "2-digit", minute: "2-digit" })}</Col>
              </Row>

              <Row>
                <Col style={{ fontWeight: 500 }}>Payment:</Col>
                <Col xs={7}>{getPaymentMethodLabel(order.paymentMethod)}</Col>
              </Row>

              {order?.paymentMethod === "prepaid" && order?.courierTip > 0 && (
                <Row>
                  <Col style={{ fontWeight: 500 }}>Courier tip:</Col>
                  <Col xs={7}>{order.courierTip.toFixed(2)}€</Col>
                </Row>
              )}

              {props?.status !== "NEW_ORDER" && props?.status !== "CANCELLED" && props?.type === "delivery" && (
                <>
                  {!editDeliveryBoy ? (
                    <Row className="d-flex align-items-center">
                      <Col style={{ fontWeight: 500 }}>Courier:</Col>
                      <Col xs={7} className="d-flex align-items-center">
                        <span style={{ backgroundColor: "", flex: 100 }}>{props?.deliveryBoy}</span>{" "}
                        {order?.status !== "CANCELLED" && order?.status !== "COMPLETED" && (
                          <Button
                            onClick={() => {
                              fetchRiders();
                              setDb(_dbs.filter((db) => db.label === props.deliveryBoy)[0]);
                              setEditDeliveryBoy(true);
                            }}
                            className="d-flex align-items-center"
                            variant="outline-dark"
                            style={{ fontSize: 12, fontWeight: 700, marginLeft: "12px", paddingLeft: "10px", paddingRight: "10px", paddingTop: "5px", paddingBottom: "5px" }}
                          >
                            <ArrowLeftRight style={{ marginRight: "4px" }} />
                            CHANGE
                          </Button>
                        )}
                      </Col>
                    </Row>
                  ) : (
                    <Row className="d-flex justify-content-center align-items-center mt-2">
                      <Col style={{ fontWeight: 500 }}>Courier:</Col>
                      <Col xs={7} className="d-flex align-items-center" style={{ backgroundColor: "" }}>
                        <div className="w-100" style={{ marginRight: "8px" }}>
                          <ReactSelect
                            isSearchable={false}
                            defaultValue={db}
                            options={_dbs}
                            value={db}
                            onChange={(e) => {
                              //console.log(e);
                              setDb(e);
                            }}
                          />
                        </div>
                        <Button
                          style={{ marginRight: "3px", fontWeight: 500 }}
                          onClick={async () => {
                            //console.log(JSON.stringify(order.deliveryBoy) !== JSON.stringify(db.value));
                            //console.log({ prev: order.deliveryBoy, next: db });
                            if (JSON.stringify(order.deliveryBoy) !== JSON.stringify(db.value)) {
                              await axios
                                .put("https://esp-pos-backend.onrender.com/orders/assign", {
                                  orderId: props.order,
                                  deliveryBoyId: db.value,
                                })
                                .then((res) => {
                                  //console.log(res);
                                  fetchOrder();
                                })
                                .catch((err) => {
                                  //console.log(err);
                                });
                              setEditDeliveryBoy(false);
                              //console.log("Save");
                            } else {
                              //console.log("No changes");
                              setEditDeliveryBoy(false);
                            }
                          }}
                          variant="outline-success"
                        >
                          <CheckLg />
                        </Button>
                        <Button
                          style={{ marginRight: "3px" }}
                          onClick={() => {
                            setEditDeliveryBoy(false);
                            //console.log("Cancel save");
                          }}
                          variant="outline-danger"
                        >
                          <XLg />
                        </Button>
                      </Col>
                    </Row>
                  )}
                </>
              )}
            </Container>
          </div>

          {props.type === "delivery" && (
            <div className="mb-3">
              <p style={{ fontSize: 22, fontWeight: 500 }}>Customer details</p>
              <Container className="m-0 p-0">
                <Row>
                  <Col style={{ fontWeight: 500 }}>Address:</Col>
                  <Col xs={8}>
                    {order?.customer?.street} {order?.customer?.streetNumber}
                  </Col>
                </Row>
                <Row>
                  <Col style={{ fontWeight: 500 }}>Postal code:</Col>
                  <Col xs={8}>{order?.customer?.postalCode}</Col>
                </Row>
                <Row>
                  <Col style={{ fontWeight: 500 }}>Ringbell:</Col>
                  <Col xs={8}>{order?.customer?.doorbell}</Col>
                </Row>
                <Row>
                  <Col style={{ fontWeight: 500 }}>Floor:</Col>
                  <Col xs={8}>{order?.customer?.floor}</Col>
                </Row>
                <Row>
                  <Col style={{ fontWeight: 500 }}>Telephone:</Col>
                  <Col xs={8}>{order?.customer?.telephone}</Col>
                </Row>
                <Row>
                  <Col style={{ fontWeight: 500 }}>Notes:</Col>
                  <Col xs={8}>{order?.customer?.notes}</Col>
                </Row>
              </Container>
            </div>
          )}

          <div className="mb-3">
            <p style={{ fontSize: 22, fontWeight: 500 }}>Order details</p>

            <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>{orderItems}</ul>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex align-items-center">
          {order?.status !== "CANCELLED" && order?.status !== "COMPLETED" && (
            <Button
              onClick={() => {
                //console.log("close");
                props.setShow(false);
                setShowCancelModal(true);
              }}
              variant="outline-danger"
              style={{}}
            >
              <div className="d-flex flex-row justify-content-center align-items-center">
                <XOctagon />

                <p style={{ margin: 0, padding: 0, backgroundColor: "", paddingLeft: "6px", fontWeight: 500, fontSize: 14 }}>CANCEL</p>
              </div>
            </Button>
          )}

          {props?.type === "takeaway" && order?.status !== "CANCELLED" && (
            <Button
              onClick={() => {
                //console.log("close");
                props.setShow(false);
                setShowCancelModal(true);
              }}
              variant="outline-danger"
              style={{}}
            >
              <div className="d-flex flex-row justify-content-center align-items-center">
                <XOctagon />

                <p style={{ margin: 0, padding: 0, backgroundColor: "", paddingLeft: "6px", fontWeight: 500, fontSize: 14 }}>CANCEL</p>
              </div>
            </Button>
          )}

          <Button variant="outline-secondary" style={{}} onClick={() => {}}>
            <div className="d-flex flex-row justify-content-center align-items-center">
              <Printer />

              <p style={{ margin: 0, padding: 0, backgroundColor: "", paddingLeft: "6px", fontWeight: 500, fontSize: 14 }}>PRINT</p>
            </div>
          </Button>
          <div style={{ flex: 100, display: "flex", justifyContent: "end", backgroundColor: "" }}>
            <p style={{ fontSize: 22, fontWeight: 500, backgroundColor: "", padding: 0, margin: 0, paddingRight: "10px" }}>Total:</p>
            <p style={{ fontSize: 22, fontWeight: 300, backgroundColor: "", textAlign: "", padding: 0, margin: 0 }}>{orderTotal.toFixed(2)}€</p>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showCancelModal}
        onHide={() => {
          setShowCancelModal(false);
          props.setShow(true);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel order</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel the order?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowCancelModal(false);
              props.setShow(true);
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              handleCancelOrder();
              // props.setShow(true);
            }}
            variant="danger"
          >
            Cancel order
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderModal;

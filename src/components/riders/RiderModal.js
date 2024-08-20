import axios from "axios";
import React, { useEffect } from "react";
import { Badge, Button, Col, Container, Form, ListGroup, Modal, Row } from "react-bootstrap";
import { ArrowLeftRight, Bicycle, Cash, CashStack, CheckLg, CreditCard, EmojiLaughingFill, EmojiWink, EmojiWinkFill, GeoAltFill, List, Pencil, Receipt, XLg } from "react-bootstrap-icons";

const RiderModal = ({ show, setShow, rider, setRider }) => {
  const [riderData, setRiderData] = React.useState({});
  const [currentOrders, setCurrentOrders] = React.useState([]);

  const [cashForChange, setCashForChange] = React.useState("");
  const [editCashForChange, setEditCashForChange] = React.useState(false);

  const [orderAmountSum, setOrderAmountSum] = React.useState(0);
  const [orderCashSum, setOrderCashSum] = React.useState(0);
  const [orderTipSum, setOrderTipSum] = React.useState(0);

  const getStatusColor = (status) => {
    switch (status) {
      case "NEW_ORDER":
        return "#9a0000";
      case "ASSIGNED":
        return "#004a9a";
      case "DELIVERED":
        return "#9a008d";
      case "COMPLETED":
        return "#009a36";
      case "CANCELLED":
        return "#555555";
      default:
        return "secondary";
    }
  };

  const fetchRiderData = async () => {
    // fetch rider data
    const url = `https://esp-pos-backend.onrender.com/deliveryBoys/${rider}`;

    await axios
      .get(url)
      .then((res) => {
        setRiderData(res.data);
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  const fetchCurrentOrders = async () => {
    // fetch current orders
    if (riderData.lastShift) {
      const url = `https://esp-pos-backend.onrender.com/orders/current/${rider}?shift_id=${riderData.lastShift}`;

      await axios
        .get(url)
        .then((res) => {
          setCurrentOrders(res.data);
        })
        .catch((err) => {
          //console.log(err);
        });
    }
  };

  useEffect(() => {
    setOrderAmountSum(0);
    setOrderCashSum(0);
    setOrderTipSum(0);

    if (currentOrders.length > 0) {
      currentOrders.forEach((order) => {
        setOrderAmountSum((prev) => prev + order.order.total);

        if (order.paymentMethod === "cash") {
          setOrderCashSum((prev) => prev + order.order.total);
        }

        if (order.courierTip > 0) {
          setOrderTipSum((prev) => prev + order.courierTip);
        }
      });
    }
  }, [currentOrders]);

  useEffect(() => {
    const lastShiftId = riderData?.lastShift;
    const lastShift = riderData?.shifts?.find((shift) => shift._id === lastShiftId);
    const cashForChange = lastShift?.cashForChange;

    if (cashForChange >= 0) setCashForChange(cashForChange.toFixed(2));

    fetchCurrentOrders();
  }, [riderData]);

  useEffect(() => {
    if (rider !== "") {
      fetchRiderData();
      //   fetchCurrentOrders();
    }
  }, [rider]);

  const handleClose = () => {
    setRiderData({});
    setShow(false);
    setRider("");
    setEditCashForChange(false);
    setCashForChange("");
    setCurrentOrders([]);
    setOrderAmountSum(0);
    setOrderCashSum(0);
    setOrderTipSum(0);
  };

  const currentOrdersMap = currentOrders.map((order, index) => {
    return (
      <ListGroup.Item key={index} as="li">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <span style={{ display: "flex", flex: 1, height: "fit-content", margin: "auto", gap: "7px", backgroundColor: "", alignItems: "center" }}>
            <span style={{ fontSize: 22, fontWeight: 600 }}>#{String(order.dailyOrderNumber).padStart(3, "0")}</span>
            <span style={{ fontWeight: 300, fontSize: 22 }}>{new Date(parseInt(order.orderTime)).toLocaleTimeString("el-GR", { hour12: false, hour: "2-digit", minute: "2-digit" })}</span>
          </span>
          <span style={{ display: "flex", height: "fit-content", margin: "auto", gap: "5px" }}>
            {order.courierTip > 0 && (
              <Badge bg="" style={{ backgroundColor: "#6b00b3", fontSize: 10 }}>
                <div className="d-flex align-items-center">
                  <EmojiWinkFill style={{ fontSize: 14, marginRight: "3px" }} />
                  {order.courierTip.toFixed(2)}€
                </div>
              </Badge>
            )}
            <Badge style={{ backgroundColor: order.paymentMethod === "cash" ? "#f06000" : "#006cf0", fontSize: 10 }} bg="">
              {order.paymentMethod === "cash" ? (
                <div className="d-flex align-items-center">
                  <Cash style={{ fontSize: 14, marginRight: "3px" }} />
                  {order.paymentMethod.toUpperCase()}
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <CreditCard style={{ fontSize: 14, marginRight: "3px" }} />
                  PREPAID
                </div>
              )}
            </Badge>
            <Badge className="d-flex align-items-center" bg="" style={{ fontSize: 10, backgroundColor: getStatusColor(order.status) }} pill>
              {order.status.toUpperCase()}
            </Badge>
          </span>
        </div>
        <div className="mt-2 d-flex align-items-center">
          <Receipt style={{ fontSize: 20, margin: 0, marginRight: "5px", color: "#0082e6" }} />
          <span>{order.order.total.toFixed(2)}€</span>
        </div>
        <div className="d-flex mb-1 align-items-center">
          <GeoAltFill style={{ fontSize: 20, margin: 0, marginRight: "5px", color: "#0082e6" }} />
          <span>
            {order.customer.street.toUpperCase()} {order.customer.streetNumber.toUpperCase()}
          </span>
        </div>
      </ListGroup.Item>
    );
  });

  const lastShiftId = riderData?.lastShift;
  const lastShift = riderData?.shifts?.find((shift) => shift._id === lastShiftId);

  // //console.log("lastShift", lastShift);

  //calculate if rider last shift end time was less than 12 hours ago
  const lastShiftEndTime = lastShift?.end;
  const lastShiftEnd = new Date(parseInt(lastShiftEndTime));
  const now = new Date();
  const timeDiff = now - lastShiftEnd;
  const timeDiffHours = timeDiff / 1000 / 60 / 60;

  return (
    <Modal scrollable show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title className="w-100">
          <div className="d-flex">
            <span style={{ flex: 100 }}>Rider tab</span>
            {riderData.status === "active" && (
              <Button
                style={{ width: "fit-content", fontSize: 14, fontWeight: 600 }}
                onClick={async () => {
                  await axios.put(`https://esp-pos-backend.onrender.com/deliveryBoys/updateShift`, {
                    deliveryBoyId: rider,
                    shiftStatus: "end",
                  });
                  setEditCashForChange(false);
                  fetchRiderData();
                  fetchCurrentOrders();
                }}
                variant="danger"
              >
                END SHIFT
              </Button>
            )}
            {riderData.status === "inactive" && (
              <Button
                style={{ width: "fit-content", fontSize: 14, fontWeight: 600 }}
                onClick={async () => {
                  await axios.put(`https://esp-pos-backend.onrender.com/deliveryBoys/updateShift`, {
                    deliveryBoyId: rider,
                    shiftStatus: "start",
                  });
                  setEditCashForChange(false);
                  fetchRiderData();
                  fetchCurrentOrders();
                }}
                variant="success"
              >
                BEGIN SHIFT
              </Button>
            )}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="m-0 p-0 mb-3">
          <Row>
            <Col style={{ fontWeight: 500 }}>Rider name:</Col>
            <Col xs={8}>{riderData?.name}</Col>
          </Row>
          <Row>
            <Col style={{ fontWeight: 500 }}>Telephone:</Col>
            <Col xs={8}>{riderData?.telephone}</Col>
          </Row>

          <Row>
            <Col style={{ fontWeight: 500 }}>Status:</Col>
            <Col xs={8}>
              <Badge bg={riderData?.status === "active" ? "success" : "danger"}>{riderData?.status?.toUpperCase()}</Badge>
            </Col>
          </Row>
        </Container>

        {(timeDiffHours < 12 || riderData?.status === "active") && (
          <>
            <h4>Details</h4>
            <Container className="m-0 p-0 mb-3">
              {lastShift?.cashForChange >= 0 && (
                <Row className="d-flex align-items-center justify-content-center" style={{ marginTop: editCashForChange ? "7px" : "0px", marginBottom: editCashForChange ? "7px" : "0px" }}>
                  <Col xs={4} style={{ fontWeight: 500, backgroundColor: "" }}>
                    Cash for change:
                  </Col>
                  {editCashForChange && riderData?.status === "active" ? (
                    <>
                      <Col>
                        <Form.Control
                          type="text"
                          value={cashForChange}
                          style={{ fontSize: 14 }}
                          onChange={(e) => {
                            // regex only allow numbers and one dot
                            const regex = /^[0-9]*\.?[0-9]*$/;
                            if (regex.test(e.target.value)) {
                              setCashForChange(e.target.value);
                            }
                          }}
                        />
                      </Col>
                      <Col>
                        <Button
                          style={{ marginRight: "3px", fontWeight: 500, fontSize: 14 }}
                          onClick={() => {
                            axios
                              .put(`https://esp-pos-backend.onrender.com/deliveryBoys/updateShiftCashForChange`, { deliveryBoyId: rider, cashForChange: parseFloat(cashForChange) })
                              .then((res) => {
                                //console.log("Update cash for change", res.data);
                                fetchRiderData();
                                setEditCashForChange(false);
                              })
                              .catch((err) => {
                                //console.log(err);
                              });
                          }}
                          variant="outline-success"
                        >
                          <CheckLg />
                        </Button>
                        <Button
                          style={{ marginRight: "3px", fontSize: 14 }}
                          onClick={() => {
                            setEditCashForChange(false);
                            setCashForChange(lastShift?.cashForChange.toFixed(2));
                            //console.log("Cancel save");
                          }}
                          variant="outline-danger"
                        >
                          <XLg />
                        </Button>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col xs={riderData?.status === "active" ? 2 : 8} style={{ backgroundColor: "" }}>
                        <span>{lastShift?.cashForChange.toFixed(2)}€</span>
                      </Col>

                      {riderData?.status === "active" && (
                        <Col xs={6}>
                          <Button
                            onClick={() => {
                              setEditCashForChange(true);
                            }}
                            disabled={riderData?.status !== "active"}
                            className="d-flex align-items-center justify-content-center"
                            variant="outline-dark"
                            style={{ fontSize: 12, fontWeight: 700, marginLeft: "12px", paddingLeft: "10px", paddingRight: "10px", height: "25px", backgroundColor: "" }}
                          >
                            <Pencil style={{ marginRight: "4px" }} />
                            EDIT
                          </Button>
                        </Col>
                      )}
                    </>
                  )}
                </Row>
              )}
              {lastShift?.start && (
                <Row>
                  <Col style={{ fontWeight: 500 }}>Shift start:</Col>
                  <Col xs={8}>{new Date(parseInt(lastShift?.start)).toLocaleTimeString("el-GR", { hour12: false, hour: "2-digit", minute: "2-digit" })}</Col>
                </Row>
              )}

              {lastShift?.end !== null && (
                <Row>
                  <Col style={{ fontWeight: 500 }}>Shift end:</Col>
                  <Col xs={8}>{new Date(parseInt(lastShift?.end)).toLocaleTimeString("el-GR", { hour12: false, hour: "2-digit", minute: "2-digit" })}</Col>
                </Row>
              )}

              <Row>
                <Col style={{ fontWeight: 500 }}>Orders:</Col>
                <Col xs={8}>{currentOrders.length}</Col>
              </Row>

              <Row>
                <Col style={{ fontWeight: 500 }}>Revenue:</Col>
                <Col xs={8}>{orderAmountSum.toFixed(2)}€</Col>
              </Row>

              <Row>
                <Col style={{ fontWeight: 500 }}>Cash collected:</Col>
                <Col xs={8}>{orderCashSum.toFixed(2)}€</Col>
              </Row>

              <Row>
                <Col style={{ fontWeight: 500 }}>Tips:</Col>
                <Col xs={8}>{orderTipSum.toFixed(2)}€</Col>
              </Row>

              <Row>
                <Col style={{ fontWeight: 500 }}>Store cash:</Col>
                <Col xs={8}>{(orderCashSum + parseFloat(cashForChange) - orderTipSum).toFixed(2)}€</Col>
              </Row>
            </Container>
            {currentOrders.length > 0 && <h4 className="mt-3 mb-3">Orders</h4>}

            <ListGroup as="ul">{currentOrdersMap}</ListGroup>
            {/* <pre>{JSON.stringify(currentOrders, 0, 4)}</pre> */}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default RiderModal;

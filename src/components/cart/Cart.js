import React, { useEffect } from "react";
import CartContext from "../../context/CartContext";
import { Badge, Button, ButtonGroup, Col, Container, Dropdown, DropdownButton, Form, ListGroup, Modal, Nav, Row } from "react-bootstrap";
import { PersonFill } from "react-bootstrap-icons";
import OrdersContext from "../../context/OrdersContext";
import truncateString from "../../functions/truncateString";

import axios from "axios";

import Select from "react-select";
import SpecialChargeModal from "../modals/specialChargeModal";
import DiscountModal from "../modals/discountModal";

const Cart = (props) => {
  const { cart, setCart } = React.useContext(CartContext);

  const [orderMode, setOrderMode] = React.useState({ label: "TAKEAWAY", value: "takeaway" });
  const [orderSource, setOrderSource] = React.useState({ label: "Walk-in", value: "walkin" });
  const [customer, setCustomer] = React.useState({});
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const [validCustomer, setValidCustomer] = React.useState(false);
  const [invalidCustomer, setInvalidCustomer] = React.useState(false);
  const [savedAddressesExist, setSavedAddressesExist] = React.useState(false);

  const [showSpecialChargeModal, setShowSpecialChargeModal] = React.useState(false);
  const [showDiscountModal, setShowDiscountModal] = React.useState(false);

  const [showCustomerModal, setShowCustomerModal] = React.useState(false);
  const [customerDetailsValid, setCustomerDetailsValid] = React.useState(false);

  const [customerAddresses, setCustomerAddresses] = React.useState([]);
  const [customerAddress, setCustomerAddress] = React.useState({});

  const [tip, setTip] = React.useState(0);
  const [deliveryTime, setDeliveryTime] = React.useState(5);

  const [tempCustomer, setTempCustomer] = React.useState({});

  const handleDeleteItemFromCart = (idx) => {
    const newItems = cart.items.filter((item, index) => {
      return index !== idx;
    });

    if (cart.items[idx].id === "discount") {
      setCart({ items: newItems, total: cart.total + cart.items[idx].price * cart.items[idx].quantity });
    } else {
      setCart({ items: newItems, total: cart.total - cart.items[idx].price * cart.items[idx].quantity });
    }
  };

  useEffect(() => {
    if (paymentMethod === "cash") {
      setTip(0);
    }
  }, [paymentMethod]);

  useEffect(() => {
    if (orderMode.value === "delivery") {
      setDeliveryTime(15);
    } else {
      setDeliveryTime(5);
    }
  }, [orderMode]);

  useEffect(() => {
    if (orderMode.value === "delivery") {
      setOrderSource({ label: "Efood", value: "efood" });
    } else if (orderMode.value === "takeaway") {
      setOrderSource({ label: "Walk-in", value: "walkin" });
    } else {
    }
  }, [orderMode]);

  const handleCheckout = () => {
    ////console.log({ customer: customer, order: cart });
    const orderTime = Date.now();
    const deliveryTimestamp = Date.now() + deliveryTime * 60 * 1000;

    const order = { source: orderSource.value, type: orderMode.value, customer: customer, order: cart, paymentMethod: paymentMethod, orderTime: orderTime, deliveryTime: deliveryTimestamp, courierTip: tip, status: orderMode.value === "takeaway" ? "COMPLETED" : "NEW_ORDER" };

    axios.post("https://esp-pos-backend.onrender.com/orders", order).then((response) => {
      ////console.log(response.status, response.data);
    });

    // setOrders([...orders, order]);
    setCart({ items: [], total: 0 });
    setCustomer({});
    setCustomerDetailsValid(false);
    setValidCustomer(false);
    setInvalidCustomer(false);
    setTip(0);

    if (orderMode.value === "delivery") {
      setDeliveryTime(15);
    } else {
      setDeliveryTime(5);
    }

    setValidCustomer(false);
    setInvalidCustomer(false);
    setCustomerAddresses([]);
    setCustomerAddress({});
    setTempCustomer({});

    //console.log({ order: order });
  };

  useEffect(() => {
    if (orderMode.value === "delivery") {
      if (tempCustomer?.street && tempCustomer?.streetNumber && tempCustomer?.postalCode && tempCustomer?.telephone) {
        setCustomerDetailsValid(true);
      } else {
        setCustomerDetailsValid(false);
      }
    }
    //console.log(tempCustomer);
  }, [tempCustomer]);

  useEffect(() => {
    setPaymentMethod("cash");
  }, [orderMode]);

  useEffect(() => {
    //console.log(customerAddress);

    if (customerAddress?.address) {
      setTempCustomer((prev) => {
        return { telephone: prev.telephone, ...customerAddress.address };
      });
    }
  }, [customerAddress]);

  useEffect(() => {
    //console.log(customer);
  }, [customer]);

  useEffect(() => {
    //console.log(cart);
  }, [cart]);

  const cartItems = cart.items?.map((item, idx) => {
    // console.log(item?.extras);
    const itemExtras = item.extras?.map((extra, idx) => {
      const extraName = extra.optionName;
      return (
        <div key={extraName}>
          <>
            <>
              {extra.optionShow === true && <>{truncateString(extra.optionLabel, 20)}</>}
              {extra.optionValue === true && `${extra.optionLabel}`}
              {/* {truncateString(extra.optionLabel, 20)} */}
            </>
          </>
        </div>
      );
    });
    return (
      <div key={idx}>
        <ListGroup.Item style={{ height: "fit-content", borderRadius: "5px" }} as="li" className="d-flex justify-content-between align-items-start mb-3">
          <div className="ms-1 me-auto">
            <div>
              <div className="fw-bold">
                <div>{item.name}</div>
              </div>
            </div>
            <div>{itemExtras}</div>
            {item.comments && <div>{item.comments}</div>}
            <Badge
              onClick={() => {
                handleDeleteItemFromCart(idx);
              }}
              bg="danger"
              pill
              style={{ marginBottom: "6px", marginTop: "6px" }}
            >
              REMOVE
            </Badge>
          </div>
          <Badge bg="success" pill>
            {(item?.price * item?.quantity).toFixed(2)} €
          </Badge>
        </ListGroup.Item>
      </div>
    );
  });

  useEffect(() => {
    //console.log(tip);
  }, [tip]);

  return (
    <div className={props.className} style={props.style}>
      <div style={{ gap: "10px" }} className="d-flex mb-3 w-100 align-content-center ">
        {/* <h2 className="m-0 p-0" style={{ flex: "100%" }}>
          Cart
        </h2> */}
        <DropdownButton align="end" style={{ flex: "50%" }} as={ButtonGroup} variant="primary" title={orderMode.label}>
          <Dropdown.Item
            onClick={() => {
              setOrderMode({ label: "TAKEAWAY", value: "takeaway" });
            }}
            active={orderMode.value === "takeaway"}
          >
            TAKEAWAY
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setOrderMode({ label: "DELIVERY", value: "delivery" });
            }}
            active={orderMode.value === "delivery"}
          >
            DELIVERY
          </Dropdown.Item>
        </DropdownButton>

        <div style={{ backgroundColor: "", flex: "50%" }}>
          <DropdownButton align="end" style={{ display: "flex" }} as={ButtonGroup} variant="outline-primary" title={orderSource.label.toUpperCase()}>
            <Dropdown.Item
              onClick={() => {
                setOrderSource({ label: "Walk-in", value: "walkin" });
              }}
              active={orderSource.value === "walkin"}
            >
              WALK-IN
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setOrderSource({ label: "Telephone", value: "telephone" });
              }}
              active={orderSource.value === "telephone"}
            >
              TELEPHONE
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setOrderSource({ label: "Efood", value: "efood" });
              }}
              active={orderSource.value === "efood"}
            >
              EFOOD
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setOrderSource({ label: "Wolt", value: "wolt" });
              }}
              active={orderSource.value === "wolt"}
            >
              WOLT
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setOrderSource({ label: "Box", value: "box" });
              }}
              active={orderSource.value === "box"}
            >
              BOX
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      {orderMode.value === "delivery" ? (
        <>
          <div className="m-0 mb-3 p-0 d-flex flex-row  align-content-center">
            <PersonFill size={28} className="p-0" style={{ marginRight: "6px" }} color="#007bff" />
            <span className="m-0 p-0 h-100" style={{ fontSize: "14px", fontWeight: 600, alignSelf: "center" }}>
              {customer.street && customer.streetNumber ? customer?.street?.toUpperCase() + " " + customer?.streetNumber : "No address selected"}
            </span>
            <Button
              onClick={() => {
                setTempCustomer(customer);
                setShowCustomerModal(true);
              }}
              variant="primary"
              size="sm"
              style={{ marginLeft: "auto", fontSize: "12px", fontWeight: 600 }}
            >
              CHANGE
            </Button>
          </div>
        </>
      ) : null}

      <div style={{ display: "flex", gap: "10px" }} className="mb-3">
        <Button onClick={() => setShowSpecialChargeModal(true)} style={{ fontSize: "14px", width: orderSource.value !== "box" ? "50%" : "100%", height: "40px" }} variant="outline-primary">
          CHARGE
        </Button>
        {orderSource.value !== "box" && (
          <Button onClick={() => setShowDiscountModal(true)} style={{ fontSize: "14px", width: "50%", height: "40px" }} variant="outline-primary">
            DISCOUNT
          </Button>
        )}
      </div>

      <div className="" style={{ backgroundColor: "", height: orderMode.value === "delivery" ? "48%" : "60%", minHeight: orderMode.value === "delivery" ? "48%" : "60%", overflowY: "scroll" }}>
        {cartItems?.length !== 0 && <ListGroup as="ol">{cartItems}</ListGroup>}
      </div>

      {orderMode.value === "delivery" && (
        <ButtonGroup //add gap betwewnn buttons
          className="mb-2 mt-3"
          style={{ gap: "0px", width: "100%", display: "flex", justifyContent: "space-between" }}
        >
          <Button
            onClick={() => {
              if (tip === 0.5) {
                setTip(0);
              } else {
                setTip(0.5);
              }
            }}
            style={{ fontSize: "14px", width: "25%", height: "40px" }}
            variant={tip === 0.5 ? "primary" : "outline-primary"}
            disabled={paymentMethod === "cash" ? true : false}
          >
            0,50€
          </Button>
          <Button
            onClick={() => {
              if (tip === 1) {
                setTip(0);
              } else {
                setTip(1);
              }
            }}
            style={{ fontSize: "14px", width: "25%", height: "40px" }}
            variant={tip === 1 ? "primary" : "outline-primary"}
            disabled={paymentMethod === "cash" ? true : false}
          >
            1,00€
          </Button>
          <Button
            onClick={() => {
              if (tip === 2) {
                setTip(0);
              } else {
                setTip(2);
              }
            }}
            style={{ fontSize: "14px", width: "25%", height: "40px" }}
            variant={tip === 2 ? "primary" : "outline-primary"}
            disabled={paymentMethod === "cash" ? true : false}
          >
            2,00€
          </Button>
          <Button
            onClick={() => {
              // setCart({ items: cart.items, total: cart.total + 0 });
            }}
            style={{ fontSize: "14px", width: "25%", height: "40px" }}
            variant="outline-primary"
            disabled={paymentMethod === "cash" ? true : false}
          >
            SET
          </Button>
        </ButtonGroup>
      )}

      {orderMode.value === "delivery" && (
        <ButtonGroup //add gapp betwewnn buttons
          className="mb-3"
          style={{ gap: "0px", width: "100%", display: "flex", justifyContent: "space-between" }}
        >
          <Button
            onClick={() => {
              setPaymentMethod("prepaid");
            }}
            style={{ fontSize: "14px", width: "25%", height: "40px" }}
            variant={paymentMethod === "prepaid" ? "primary" : "outline-primary"}
          >
            PREPAID
          </Button>
          <Button
            onClick={() => {
              setPaymentMethod("cash");
            }}
            style={{ fontSize: "14px", width: "25%", height: "40px" }}
            variant={paymentMethod === "cash" ? "primary" : "outline-primary"}
          >
            CASH
          </Button>
        </ButtonGroup>
      )}

      {orderMode.value === "takeaway" && (
        <ButtonGroup //add gapp betwewnn buttons
          className="mb-3 mt-3"
          style={{ gap: "0px", width: "100%", display: "flex", justifyContent: "space-between" }}
        >
          <Button
            onClick={() => {
              setPaymentMethod("cash");
            }}
            style={{ fontSize: "14px", width: "25%", height: "40px" }}
            variant={paymentMethod === "cash" ? "primary" : "outline-primary"}
          >
            CASH
          </Button>
          <Button
            onClick={() => {
              setPaymentMethod("card");
            }}
            style={{ fontSize: "14px", width: "25%", height: "40px" }}
            variant={paymentMethod === "card" ? "primary" : "outline-primary"}
          >
            CARD
          </Button>
          <Button
            onClick={() => {
              setPaymentMethod("iris");
            }}
            style={{ fontSize: "14px", width: "25%", height: "40px" }}
            variant={paymentMethod === "iris" ? "primary" : "outline-primary"}
          >
            IRIS
          </Button>
          <Button
            onClick={() => {
              setPaymentMethod("online");
            }}
            style={{ fontSize: "14px", width: "27%", height: "40px" }}
            variant={paymentMethod === "online" ? "primary" : "outline-primary"}
          >
            ONLINE
          </Button>
        </ButtonGroup>
      )}

      {orderMode.value === "delivery" ? (
        <ButtonGroup //delivery
          className="mb-3"
          style={{ gap: "0px", width: "100%", display: "flex", justifyContent: "space-between" }}
        >
          <Button onClick={() => setDeliveryTime(10)} variant={deliveryTime === 10 ? "primary" : "outline-primary"}>
            10
          </Button>
          <Button onClick={() => setDeliveryTime(15)} variant={deliveryTime === 15 ? "primary" : "outline-primary"}>
            15
          </Button>
          <Button onClick={() => setDeliveryTime(20)} variant={deliveryTime === 20 ? "primary" : "outline-primary"}>
            20
          </Button>
          <Button onClick={() => setDeliveryTime(25)} variant={deliveryTime === 25 ? "primary" : "outline-primary"}>
            25
          </Button>
          <Button onClick={() => setDeliveryTime(30)} variant={deliveryTime === 30 ? "primary" : "outline-primary"}>
            30
          </Button>
          <Button onClick={() => setDeliveryTime(35)} variant={deliveryTime === 35 ? "primary" : "outline-primary"}>
            35
          </Button>
        </ButtonGroup>
      ) : (
        <ButtonGroup //takeaway
          className="mb-3"
          style={{ gap: "0px", width: "100%", display: "flex", justifyContent: "space-between" }}
        >
          <Button onClick={() => setDeliveryTime(5)} variant={deliveryTime === 5 ? "primary" : "outline-primary"}>
            5
          </Button>
          <Button onClick={() => setDeliveryTime(10)} variant={deliveryTime === 10 ? "primary" : "outline-primary"}>
            10
          </Button>
          <Button onClick={() => setDeliveryTime(15)} variant={deliveryTime === 15 ? "primary" : "outline-primary"}>
            15
          </Button>
          <Button onClick={() => setDeliveryTime(20)} variant={deliveryTime === 20 ? "primary" : "outline-primary"}>
            20
          </Button>
          <Button onClick={() => setDeliveryTime(25)} variant={deliveryTime === 25 ? "primary" : "outline-primary"}>
            25
          </Button>
        </ButtonGroup>
      )}

      <Button disabled={orderMode.value === "takeaway" && cart.items?.length > 0 ? false : orderMode.value === "delivery" && cart.items?.length > 0 && customer?.telephone ? false : true} onClick={handleCheckout} className="" style={{ fontSize: "20px", width: "100%", height: "65px" }} variant="primary">
        Checkout {cart.total?.toFixed(2)} €
      </Button>

      <Modal
        backdrop="static"
        keyboard={true}
        show={showCustomerModal}
        onHide={() => setShowCustomerModal(false)}
        onExit={() => {
          setValidCustomer(false);
          setInvalidCustomer(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>Customer Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="d-flex">
              <Form.Group className="mb-3" style={{ flex: 100 }}>
                <Form.Label>Telephone</Form.Label>
                <Form.Control
                  isValid={validCustomer}
                  isInvalid={invalidCustomer}
                  value={tempCustomer?.telephone}
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/; //change this to allow also only 10 digits

                    if (e.target.value === "" || re.test(e.target.value)) {
                      setTempCustomer({ ...tempCustomer, telephone: e.target.value });
                    }
                  }}
                  type="text"
                  placeholder="Enter telephone"
                />
              </Form.Group>

              <Button
                onClick={async () => {
                  await axios
                    .get(`https://esp-pos-backend.onrender.com/customers/${tempCustomer?.telephone}`)
                    .then((res) => {
                      //console.log(res?.data?.addresses);

                      const customer_ = res.data;

                      if (customer_.addresses.length > 0) {
                        setSavedAddressesExist(true);
                        let _customerAddresses = [];
                        customer_.addresses.forEach((address) => {
                          _customerAddresses.push({ value: address.street.split(" ")[0] + address.streetNumber, label: address.street + " " + address.streetNumber, address: { ...address, telephone: tempCustomer.telephone } });
                        });

                        setCustomerAddresses(_customerAddresses);
                        //console.log(_customerAddresses);
                        setCustomerAddress(_customerAddresses[0]);

                        // setCustomerAddresses([{ value: customer_.street.split(" ")[0] + customer_.streetNumber, label: customer_.street + " " + customer_.streetNumber, address:  }]);
                        // setCustomerAddress(customerAddresses[0]);
                        // setTempCustomer(customer_);
                        setValidCustomer(true);
                        setInvalidCustomer(false);
                      }
                    })
                    .catch((error) => {
                      setTempCustomer({ street: "", streetNumber: "", doorbell: "", floor: "", postalCode: "", notes: "", telephone: tempCustomer.telephone });
                      setInvalidCustomer(true);
                      setValidCustomer(false);

                      setCustomerAddresses([]);
                      // setCustomerAddress({});
                      setSavedAddressesExist(false);

                      //console.log(error);
                    });

                  // const customer_ = customers.find((_customer) => {
                  //   return _customer.telephone === tempCustomer.telephone;
                  // });
                }}
                variant="primary"
                size="sm"
                style={{ fontWeight: 600, height: "36px", marginLeft: "10px", alignSelf: "center", marginTop: "15px" }}
              >
                SEARCH
              </Button>
            </div>
            {savedAddressesExist && (
              <Form.Group className="mb-3">
                <Form.Label>Saved address(es)</Form.Label>

                <Select
                  value={customerAddress}
                  defaultValue={customerAddress}
                  options={customerAddresses}
                  onChange={(e) => {
                    setCustomerAddress(e);
                  }}
                />
              </Form.Group>
            )}

            <Container className="m-0 p-0">
              <Row>
                <Col xs={7}>
                  <Form.Group className="mb-3">
                    <Form.Label>Street name</Form.Label>
                    <Form.Control
                      value={tempCustomer?.street}
                      onChange={(e) => {
                        setTempCustomer({ ...tempCustomer, street: e.target.value });
                      }}
                      type="text"
                      placeholder="Enter street name"
                    />
                  </Form.Group>
                </Col>
                <Col xs={5}>
                  <Form.Group className="mb-3">
                    <Form.Label>Street number</Form.Label>
                    <Form.Control
                      value={tempCustomer?.streetNumber}
                      onChange={(e) => {
                        setTempCustomer({ ...tempCustomer, streetNumber: e.target.value });
                      }}
                      type="text"
                      placeholder="Enter street number"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Container>
            <Container className="m-0 p-0">
              <Row>
                <Col xs={5}>
                  <Form.Group className="mb-3">
                    <Form.Label>Doorbell</Form.Label>
                    <Form.Control
                      value={tempCustomer?.doorbell}
                      onChange={(e) => {
                        setTempCustomer({ ...tempCustomer, doorbell: e.target.value });
                      }}
                      type="text"
                      placeholder="Enter doorbell"
                    />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Floor</Form.Label>
                    <Form.Control
                      value={tempCustomer?.floor}
                      onChange={(e) => {
                        setTempCustomer({ ...tempCustomer, floor: e.target.value });
                      }}
                      type="text"
                      placeholder="Enter floor"
                    />
                  </Form.Group>
                </Col>
                <Col xs={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Postal code</Form.Label>
                    <Form.Control
                      value={tempCustomer?.postalCode}
                      onChange={(e) => {
                        setTempCustomer({ ...tempCustomer, postalCode: e.target.value });
                      }}
                      type="text"
                      placeholder="Enter postal code"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Container>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                value={tempCustomer?.notes}
                onChange={(e) => {
                  setTempCustomer({ ...tempCustomer, notes: e.target.value });
                }}
                type="text"
                placeholder="Enter notes"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCustomerModal(false);
              setSavedAddressesExist(false);
              setTempCustomer({});
              setValidCustomer(false);
              setInvalidCustomer(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!customerDetailsValid}
            onClick={() => {
              setSavedAddressesExist(false);
              setCustomer(tempCustomer);
              setShowCustomerModal(false);
              setTempCustomer({});
              setValidCustomer(false);
              setInvalidCustomer(false);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <SpecialChargeModal showSpecialChargeModal={showSpecialChargeModal} setShowSpecialChargeModal={setShowSpecialChargeModal} />
      <DiscountModal source={orderSource} showDiscountModal={showDiscountModal} setShowDiscountModal={setShowDiscountModal} />
    </div>
  );
};

export default Cart;

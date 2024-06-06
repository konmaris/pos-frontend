import React, { useEffect } from "react";
import CartContext from "../../context/CartContext";
import { Badge, Button, ButtonGroup, Dropdown, DropdownButton, Form, ListGroup, Modal, Nav } from "react-bootstrap";
import { PersonFill } from "react-bootstrap-icons";
import OrdersContext from "../../context/OrdersContext";
import truncateString from "../../functions/truncateString";

import axios from "axios";

const Cart = (props) => {
  const { cart, setCart } = React.useContext(CartContext);

  const [orderMode, setOrderMode] = React.useState({ label: "Takeaway", value: "takeaway" });
  const [orderSource, setOrderSource] = React.useState({ label: "Telephone", value: "telephone" });
  const [customer, setCustomer] = React.useState({});
  const [validCustomer, setValidCustomer] = React.useState(false);
  const [invalidCustomer, setInvalidCustomer] = React.useState(false);

  const [showCustomerModal, setShowCustomerModal] = React.useState(false);
  const [customerDetailsValid, setCustomerDetailsValid] = React.useState(false);

  const [tempCustomer, setTempCustomer] = React.useState({});

  const handleDeleteItemFromCart = (idx) => {
    const newItems = cart.items.filter((item, index) => {
      return index !== idx;
    });
    setCart({ items: newItems, total: cart.total - cart.items[idx].price });
  };

  const handleCheckout = () => {
    //console.log({ customer: customer, order: cart });
    const orderTime = Date.now();
    const deliveryTime = Date.now() + 15 * 60 * 1000;

    const order = { source: orderSource.value, type: orderMode.value, customer: customer, order: cart, orderTime: orderTime, deliveryTime: deliveryTime, status: orderMode.value === "takeaway" ? "COMPLETED" : "NEW_ORDER" };

    // setOrders([...orders, order]);
    setCart({ items: [], total: 0 });
    setCustomer({});
    setCustomerDetailsValid(false);
    setValidCustomer(false);
    setInvalidCustomer(false);
    setOrderMode({ label: "Takeaway", value: "takeaway" });

    //console.log({ order: order });

    axios.post("https://pos-backend-356y.onrender.com/orders", order).then((response) => {
      //console.log(response.status, response.data);
    });
  };

  useEffect(() => {
    if (orderMode.value === "delivery") {
      if (tempCustomer.street && tempCustomer.streetNumber && tempCustomer.postalCode && tempCustomer.telephone) {
        setCustomerDetailsValid(true);
      } else {
        setCustomerDetailsValid(false);
      }
    }
  }, [tempCustomer]);

  const cartItems = cart.items?.map((item, idx) => {
    const itemExtras = item.extras?.map((extra, idx) => {
      //console.log(extra);
      const extraName = extra.optionName;
      return (
        <div key={extraName}>
          {extra.optionShow === true || extra.optionValue === true ? (
            <>
              <>{extra.optionShow === true ? <>{truncateString(extra.optionLabel, 20)}</> : extra.optionValue === true ? `${extra.optionName}` : <>{truncateString(extra.optionLabel, 20)}</>}</>
            </>
          ) : null}
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
            <Badge
              onClick={() => {
                handleDeleteItemFromCart(idx);
              }}
              bg="danger"
              pill
            >
              REMOVE
            </Badge>
          </div>
          <Badge bg="success" pill>
            {item?.price?.toFixed(2)} €
          </Badge>
        </ListGroup.Item>
      </div>
    );
  });

  return (
    <div className={props.className} style={props.style}>
      <div className="d-flex mb-4 w-100 align-content-center ">
        <h2 className="m-0 p-0" style={{ flex: "100%" }}>
          Cart
        </h2>
        <DropdownButton as={ButtonGroup} variant="outline-primary" title={orderMode.label}>
          <Dropdown.Item
            onClick={() => {
              setOrderMode({ label: "Takeaway", value: "takeaway" });
            }}
            active={orderMode.value === "takeaway"}
          >
            Takeaway
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setOrderMode({ label: "Delivery", value: "delivery" });
            }}
            active={orderMode.value === "delivery"}
          >
            Delivery
          </Dropdown.Item>
        </DropdownButton>
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
          <div style={{ width: "100%", backgroundColor: "" }} className="mb-3">
            <DropdownButton align="end" style={{ display: "flex", width: "100%" }} as={ButtonGroup} variant="outline-primary" title={orderSource.label.toUpperCase()}>
              <Dropdown.Item
                onClick={() => {
                  setOrderSource({ label: "Telephone", value: "telephone" });
                }}
                active={orderMode.value === "telephone"}
              >
                TELEPHONE
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setOrderSource({ label: "Efood", value: "efood" });
                }}
                active={orderMode.value === "efood"}
              >
                EFOOD
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setOrderSource({ label: "Wolt", value: "wolt" });
                }}
                active={orderMode.value === "wolt"}
              >
                WOLT
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setOrderSource({ label: "Box", value: "box" });
                }}
                active={orderMode.value === "box"}
              >
                BOX
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </>
      ) : null}

      <div className="" style={{ minHeight: orderMode.value === "delivery" ? "70%" : "76%", maxHeight: orderMode.value === "delivery" ? "70%" : "76%", overflowY: "auto" }}>
        {cartItems?.length === 0 ? <h3 className="mt-3">Your cart is empty</h3> : <ListGroup as="ol">{cartItems}</ListGroup>}
      </div>

      <Button disabled={orderMode.value === "takeaway" && cart.items?.length > 0 ? false : orderMode.value === "delivery" && cart.items?.length > 0 && customer?.telephone ? false : true} onClick={handleCheckout} className="" style={{ fontSize: "20px", width: "100%", height: "65px" }} variant="primary">
        Checkout {cart.total?.toFixed(2)} €
      </Button>

      <Modal backdrop="static" keyboard={false} show={showCustomerModal} onHide={() => setShowCustomerModal(false)}>
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
                  value={tempCustomer.telephone}
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
                    .get(`https://pos-backend-356y.onrender.com/customers/${tempCustomer.telephone}`)
                    .then((res) => {
                      // //console.log(res.data);

                      const customer_ = res.data;

                      if (customer_) {
                        setTempCustomer(customer_);
                        setValidCustomer(true);
                        setInvalidCustomer(false);
                      } else {
                        setInvalidCustomer(true);
                        setValidCustomer(false);
                      }
                    })
                    .catch((error) => {
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
            <Form.Group className="mb-3">
              <Form.Label>Street name</Form.Label>
              <Form.Control
                value={tempCustomer.street}
                onChange={(e) => {
                  setTempCustomer({ ...tempCustomer, street: e.target.value });
                }}
                type="text"
                placeholder="Enter street name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Street number</Form.Label>
              <Form.Control
                value={tempCustomer.streetNumber}
                onChange={(e) => {
                  setTempCustomer({ ...tempCustomer, streetNumber: e.target.value });
                }}
                type="text"
                placeholder="Enter street number"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Doorbell</Form.Label>
              <Form.Control
                value={tempCustomer.doorbell}
                onChange={(e) => {
                  setTempCustomer({ ...tempCustomer, doorbell: e.target.value });
                }}
                type="text"
                placeholder="Enter doorbell"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Floor</Form.Label>
              <Form.Control
                value={tempCustomer.floor}
                onChange={(e) => {
                  setTempCustomer({ ...tempCustomer, floor: e.target.value });
                }}
                type="text"
                placeholder="Enter floor"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Postal code</Form.Label>
              <Form.Control
                value={tempCustomer.postalCode}
                onChange={(e) => {
                  setTempCustomer({ ...tempCustomer, postalCode: e.target.value });
                }}
                type="text"
                placeholder="Enter postal code"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCustomerModal(false);
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
    </div>
  );
};

export default Cart;

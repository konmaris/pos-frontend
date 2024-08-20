import React from "react";
import { Alert, Button, ButtonGroup, Form, Modal } from "react-bootstrap";
import CartContext from "../../context/CartContext";

const SpecialChargeModal = ({ showSpecialChargeModal, setShowSpecialChargeModal }) => {
  const { cart, setCart } = React.useContext(CartContext);

  const [specialChargeText, setSpecialChargeText] = React.useState("");
  const [specialChargeInvalid, setSpecialChargeInvalid] = React.useState(false);
  const [specialChargeReason, setSpecialChargeReason] = React.useState("");

  return (
    <Modal
      show={showSpecialChargeModal}
      onHide={() => {
        setShowSpecialChargeModal(false);
        setSpecialChargeText("");
        setSpecialChargeReason("");
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add charge</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Alert show={specialChargeInvalid} variant="danger">
            {/* Το ποσό πρέπει να είναι μικρότερο από 10€ */}
            The amount must be less than 10€
          </Alert>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <ButtonGroup className="w-100">
              <Button onClick={() => setSpecialChargeReason("Delivery fee")} variant={specialChargeReason === "Delivery fee" ? "primary" : "outline-primary"}>
                DELIVERY FEE
              </Button>
              <Button onClick={() => setSpecialChargeReason("Small order surcharge")} variant={specialChargeReason === "Small order surcharge" ? "primary" : "outline-primary"}>
                SMALL ORDER SURCHARGE
              </Button>

              <Button onClick={() => setSpecialChargeReason("Other")} variant={specialChargeReason === "Other" ? "primary" : "outline-primary"}>
                OTHER
              </Button>
            </ButtonGroup>
          </Form.Group>
          <Form.Group className="mb-4" controlId="formBasicEmail">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              value={specialChargeText}
              isInvalid={specialChargeInvalid}
              onChange={(e) => {
                // use regex to allow only numbers and only 2 decimal points
                const regex = /^[0-9]+(\.[0-9]{0,2})?$/;

                if (regex.test(e.target.value) || e.target.value === "") {
                  setSpecialChargeText(e.target.value);
                }
              }}
              type="text"
              placeholder="Amount"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div style={{ gap: "10px", width: "100%", backgroundColor: "", display: "flex", alignItems: "center", justifyContent: "end" }}>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowSpecialChargeModal(false);
              setSpecialChargeText("");
              setSpecialChargeReason("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            disabled={specialChargeText === "" || specialChargeReason === ""}
            onClick={() => {
              const specialCharge = parseFloat(specialChargeText);
              if (specialCharge > 10) {
                setSpecialChargeInvalid(true);
              } else {
                // add special charge to cart
                const newItems = [...cart.items];
                newItems.push({ name: specialChargeReason, price: specialCharge, id: "special_charge", quantity: 1, category: "special_charge" });
                setCart({ items: newItems, total: cart.total + specialCharge });
                setSpecialChargeText("");
                setSpecialChargeReason("");
                setSpecialChargeInvalid(false);
                setShowSpecialChargeModal(false);
              }
            }}
          >
            Add charge
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SpecialChargeModal;

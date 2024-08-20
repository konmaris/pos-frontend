import React, { useEffect } from "react";
import { Alert, Button, ButtonGroup, Form, Modal } from "react-bootstrap";
import CartContext from "../../context/CartContext";

const DiscountModal = ({ showDiscountModal, setShowDiscountModal, source }) => {
  const { cart, setCart } = React.useContext(CartContext);

  const [discountText, setDiscountText] = React.useState("");
  const [discountInvalid, setDiscountInvalid] = React.useState(false);
  const [piniata2Invalid, setPiniata2Invalid] = React.useState(false);
  const [piniata5Invalid, setPiniata5Invalid] = React.useState(false);
  const [piniata7Invalid, setPiniata7Invalid] = React.useState(false);
  const [discountExists, setDiscountExists] = React.useState(false);
  const [discountReason, setDiscountReason] = React.useState("");
  const [discountFieldDisabled, setDiscountFieldDisabled] = React.useState(true);

  //useEffect to scan cart items to see if discount already exists and update discountExists state
  useEffect(() => {
    let discountExists = false;
    cart?.items?.forEach((item) => {
      if (item.id === "discount") {
        discountExists = true;
      }
    });
    setDiscountExists(discountExists);
  }, [cart.items]);

  useEffect(() => {
    if (source.value === "wolt") {
      setDiscountReason("Cash collection difference");
      setDiscountFieldDisabled(false);
    }

    if (source.value === "telephone" || source.value === "walkin") {
      setDiscountReason("Special discount");
      setDiscountFieldDisabled(false);
    }
  }, [showDiscountModal]);

  return (
    <Modal
      show={showDiscountModal}
      onHide={() => {
        setShowDiscountModal(false);
        setDiscountText("");
        setDiscountReason("");
        setDiscountFieldDisabled(true);
        setPiniata2Invalid(false);
        setPiniata5Invalid(false);
        setPiniata7Invalid(false);

        setDiscountInvalid(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add discount</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Alert show={discountInvalid} variant="danger">
            {/* Το ποσό πρέπει να είναι μικρότερο από 10€ */}
            The amount must be less than 10€
          </Alert>
          <Alert show={discountExists} variant="danger">
            {/* Έχει ήδη προστεθεί έκπτωση στο καλάθι */}
            Discount already exists in cart
          </Alert>
          <Alert show={piniata2Invalid} variant="danger">
            {/* Για να εφαρμοστεί η έκπτωση το καλάθι πρέπει να είναι από 6€ και πάνω */}
            To apply the discount the cart must be 6€ or more
          </Alert>
          <Alert show={piniata5Invalid} variant="danger">
            {/* Για να εφαρμοστεί η έκπτωση το καλάθι πρέπει να είναι από 15€ και πάνω */}
            To apply the discount the cart must be 15€ or more
          </Alert>
          <Alert show={piniata7Invalid} variant="danger">
            {/* Για να εφαρμοστεί η έκπτωση το καλάθι πρέπει να είναι από 20€ και πάνω */}
            To apply the discount the cart must be 20€ or more
          </Alert>

          <Form.Group className="mb-3">
            <ButtonGroup className="w-100">
              {source.value === "efood" && (
                <>
                  <Button
                    onClick={() => {
                      setDiscountReason("Lucky Piniata 2€");
                      setDiscountText("2.00");
                      setDiscountFieldDisabled(true);
                      setPiniata2Invalid(false);
                      setPiniata5Invalid(false);
                      setPiniata7Invalid(false);
                    }}
                    variant={discountReason === "Lucky Piniata 2€" ? "primary" : "outline-primary"}
                  >
                    PINIATA 2€
                  </Button>
                  <Button
                    onClick={() => {
                      setDiscountReason("Lucky Piniata 5€");
                      setDiscountText("5.00");
                      setDiscountFieldDisabled(true);
                      setPiniata2Invalid(false);
                      setPiniata5Invalid(false);
                      setPiniata7Invalid(false);
                    }}
                    variant={discountReason === "Lucky Piniata 5€" ? "primary" : "outline-primary"}
                  >
                    PINIATA 5€
                  </Button>
                  <Button
                    onClick={() => {
                      setDiscountReason("Lucky Piniata 7€");
                      setDiscountText("7.00");
                      setDiscountFieldDisabled(true);
                      setPiniata2Invalid(false);
                      setPiniata5Invalid(false);
                      setPiniata7Invalid(false);
                    }}
                    variant={discountReason === "Lucky Piniata 7€" ? "primary" : "outline-primary"}
                  >
                    PINIATA 7€
                  </Button>
                </>
              )}
              {(source.value === "telephone" || source.value === "walkin") && (
                <Button
                  onClick={() => {
                    setDiscountText("");
                    setDiscountReason("Special discount");
                    setDiscountFieldDisabled(false);
                    setPiniata2Invalid(false);
                    setPiniata5Invalid(false);
                    setPiniata7Invalid(false);
                  }}
                  variant={discountReason === "Special discount" ? "primary" : "outline-primary"}
                >
                  OTHER
                </Button>
              )}

              {source.value === "wolt" && (
                <Button
                  onClick={() => {
                    setDiscountText("");
                    setDiscountReason("Cash collection difference");
                    setDiscountFieldDisabled(false);
                    setPiniata2Invalid(false);
                    setPiniata5Invalid(false);
                    setPiniata7Invalid(false);
                  }}
                  variant={discountReason === "Cash collection difference" ? "primary" : "outline-primary"}
                >
                  CASH DIFFERENCE
                </Button>
              )}
            </ButtonGroup>
          </Form.Group>
          <Form.Group className="mb-4" controlId="formBasicEmail">
            <Form.Label>Discount amount</Form.Label>
            <Form.Control
              value={discountText}
              disabled={discountFieldDisabled}
              isInvalid={discountInvalid}
              onChange={(e) => {
                // use regex to allow only numbers and only 2 decimal points
                const regex = /^[0-9]+(\.[0-9]{0,2})?$/;

                if (regex.test(e.target.value) || e.target.value === "") {
                  setDiscountText(e.target.value);
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
              setShowDiscountModal(false);
              setDiscountText("");
              setDiscountReason("");
              setDiscountFieldDisabled(true);
              setPiniata2Invalid(false);
              setPiniata5Invalid(false);
              setPiniata7Invalid(false);

              setDiscountInvalid(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            disabled={discountText === "" || discountReason === "" || discountInvalid || piniata2Invalid || piniata5Invalid || piniata7Invalid || discountExists}
            onClick={() => {
              const specialCharge = parseFloat(discountText);
              if (specialCharge > 10) {
                setDiscountInvalid(true);
              } else {
                if (!discountExists) {
                  if (discountReason === "Lucky Piniata 2€" || discountReason === "Lucky Piniata 5€" || discountReason === "Lucky Piniata 7€") {
                    if (discountReason === "Lucky Piniata 2€" && cart.total < 6) {
                      setPiniata2Invalid(true);

                      return;
                    } else if (discountReason === "Lucky Piniata 5€" && cart.total < 15) {
                      setPiniata5Invalid(true);

                      return;
                    } else if (discountReason === "Lucky Piniata 7€" && cart.total < 20) {
                      setPiniata7Invalid(true);

                      return;
                    } else {
                      const newItems = [...cart.items];
                      newItems.push({ name: discountReason, price: specialCharge, id: "discount", quantity: 1, category: "discount" });
                      setCart({ items: newItems, total: cart.total - specialCharge });
                      setDiscountText("");
                      setDiscountReason("");
                      setDiscountInvalid(false);
                      setShowDiscountModal(false);
                      setDiscountInvalid(false);
                      return;
                    }
                  } else {
                    const newItems = [...cart.items];
                    newItems.push({ name: discountReason, price: specialCharge, id: "discount", quantity: 1, category: "discount" });
                    setCart({ items: newItems, total: cart.total - specialCharge });
                    setDiscountText("");
                    setDiscountReason("");
                    setDiscountInvalid(false);
                    setShowDiscountModal(false);

                    return;
                  }
                } else {
                  setDiscountExists(true);
                  return;
                }
              }
            }}
          >
            Add discount
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DiscountModal;

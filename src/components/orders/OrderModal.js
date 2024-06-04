import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const OrderModal = (props) => {
  const handleClose = () => {
    props.setShow(false);
  };

  return (
    <div>
      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Assign order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label style={{ fontWeight: "600" }}>Choose a delivery boy</Form.Label>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleClose}>
            Assign
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderModal;

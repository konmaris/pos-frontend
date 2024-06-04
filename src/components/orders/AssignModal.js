import React from "react";
import { Form, Modal, Button } from "react-bootstrap";

const AssignModal = (props) => {
  const handleClose = () => {
    props.setShow(false);
  };

  const handleAssign = () => {
    props.setDeliveryBoy(delBoy);
    props.setOrderStatus("ASSIGNED");
    props.setShow(false);
  };

  const [delBoy, setDelBoy] = React.useState("");

  return (
    <div>
      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Assign order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label style={{ fontWeight: "600" }}>Choose a delivery boy</Form.Label>
          <div key="inline-radio" className="mb-3">
            {props.deliveryBoys.map((db) => {
              return (
                <Form.Check
                  onClick={(e) => {
                    setDelBoy(db.name);
                  }}
                  inline
                  key={db.id}
                  type="radio"
                  label={db.name}
                  name={db.name}
                  id={db.id}
                />
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleAssign}>
            Assign
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssignModal;

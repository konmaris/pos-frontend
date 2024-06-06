import axios from "axios";
import React from "react";
import { Form, Modal, Button } from "react-bootstrap";

const AssignModal = (props) => {
  const handleClose = () => {
    props.setShow(false);
  };

  const handleAssign = () => {
    // use axios to put order to change the delivery boy
    axios
      .put(`http://localhost:8000/orders/assign`, {
        orderId: props.orderId,
        deliveryBoyId: delBoy,
      })
      .then((res) => {})
      .catch((err) => {
        //console.log(err);
      });

    axios
      .put(`http://localhost:8000/orders/status`, {
        orderId: props.orderId,
        status: "ASSIGNED",
      })
      .then((res) => {})
      .catch((err) => {
        //console.log(err);
      });

    props.setShow(false);
    // props.setOrderStatus("ASSIGNED");
    // fetchOrders();
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
                    //console.log(db._id);
                    setDelBoy(db._id);
                  }}
                  inline
                  key={db._id}
                  name="group1"
                  type="radio"
                  label={db.name}
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

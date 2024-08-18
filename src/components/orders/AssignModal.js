import axios from "axios";
import React from "react";
import { Form, Modal, Button } from "react-bootstrap";
import ReactSelect from "react-select";

const AssignModal = (props) => {
  const [delBoy, setDelBoy] = React.useState("");

  const handleClose = () => {
    setDelBoy("");
    props.setShow(false);
  };

  const handleAssign = () => {
    // use axios to put order to change the delivery boy
    axios
      .put(`https://esp-pos-backend.onrender.com/orders/assign`, {
        orderId: props.orderId,
        deliveryBoyId: delBoy.value,
        shiftId: delBoy.lastShift,
      })
      .then((res) => {})
      .catch((err) => {
        //console.log(err);
      });

    props.setShow(false);
  };

  let dbs_ = [];
  props.deliveryBoys?.forEach((db) => {
    if (db.status === "active") {
      dbs_.push({ value: db._id, label: db.name, lastShift: db.lastShift });
    }
  });

  // //console.log(props.deliveryBoys);
  return (
    <div>
      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ανάθεση παραγγελίας</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label style={{ fontWeight: "600" }}>Επιλέξτε έναν διανομέα</Form.Label>
          <ReactSelect options={dbs_} onChange={(e) => setDelBoy(e)} placeholder="Επιλέξτε διανομέα..." value={delBoy} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-success" onClick={handleAssign}>
            Ανάθεση
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssignModal;

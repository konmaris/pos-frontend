import axios from "axios";
import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

const RiderModal = ({ show, setShow, rider, setRider }) => {
  const [riderData, setRiderData] = React.useState({});
  const [currentOrders, setCurrentOrders] = React.useState([]);

  const fetchRiderData = async () => {
    // fetch rider data
    const url = `https://esp-pos-backend.onrender.com/deliveryBoys/${rider}`;

    await axios
      .get(url)
      .then((res) => {
        setRiderData(res.data);
      })
      .catch((err) => {
        console.log(err);
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
          console.log(err);
        });
    }
  };

  useEffect(() => {
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
  };

  return (
    <Modal scrollable show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title className="w-100">
          <div className="d-flex">
            <span style={{ flex: 100 }}>Καρτέλα διανομέα</span>
            {riderData.status === "active" && (
              <Button
                style={{ width: "fit-content", fontSize: 14, fontWeight: 600 }}
                onClick={async () => {
                  await axios.put(`https://esp-pos-backend.onrender.com/deliveryBoys/updateShift`, {
                    deliveryBoyId: rider,
                    shiftStatus: "end",
                  });

                  fetchRiderData();
                  fetchCurrentOrders();
                }}
                variant="danger"
              >
                ΔΙΑΚΟΠΗ ΒΑΡΔΙΑΣ
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

                  fetchRiderData();
                  fetchCurrentOrders();
                }}
                variant="success"
              >
                ΕΝΑΡΞΗ ΒΑΡΔΙΑΣ
              </Button>
            )}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Παραγγελίες</h4>
        <pre>{JSON.stringify(currentOrders, 0, 4)}</pre>
        <h4>Στοιχεία διανομέα</h4>
        <pre>{JSON.stringify(riderData, 0, 4)}</pre>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => setShow(false)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RiderModal;

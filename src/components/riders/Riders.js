import axios from "axios";
import React, { useEffect } from "react";
import { Badge, Card, Col, Row, Spinner } from "react-bootstrap";
import { Dot } from "react-bootstrap-icons";
import RiderModal from "./RiderModal";
import LoadingContext from "../../context/LoadingContext";

const Riders = () => {
  const [riders, setRiders] = React.useState([]);
  const [currentRider, setCurrentRider] = React.useState("");

  const { loading, setLoading } = React.useContext(LoadingContext);

  const [showRiderModal, setShowRiderModal] = React.useState(false);

  const handleFetchRiders = async () => {
    await axios
      .get("https://esp-pos-backend.onrender.com/deliveryBoys")
      .then((res) => {
        setRiders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  useEffect(() => {
    handleFetchRiders();
    setInterval(() => {
      handleFetchRiders();
    }, 10000);
  }, []);

  const ridersMap = riders.map((rider, idx) => {
    if (rider.status !== "disabled") {
      return (
        <Col
          key={`rider-${idx}`}
          onClick={() => {
            setCurrentRider(rider._id);
            setShowRiderModal(true);
          }}
        >
          <Card style={{ height: "130px" }}>
            <Card.Body>
              <Card.Title style={{ height: "70%" }}>{rider.name}</Card.Title>
              <Card.Text>
                <Badge bg={rider.status === "active" ? "success" : rider.status === "inactive" ? "danger" : "secondary"}>{rider.status.toUpperCase()}</Badge>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      );
    } else {
      return null;
    }
  });

  return (
    <>
      {loading ? (
        <div className="w-100 h-75 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div>
          <Row xs={1} md={3} className="g-4">
            {ridersMap}
          </Row>
        </div>
      )}

      {/* )  */}
      <RiderModal show={showRiderModal} setShow={setShowRiderModal} rider={currentRider} setRider={setCurrentRider} />
    </>
  );
};

export default Riders;

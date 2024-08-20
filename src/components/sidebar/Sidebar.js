import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { Bicycle, FileBarGraph, FileBarGraphFill, FileText, FileTextFill, Person, PersonFill } from "react-bootstrap-icons";
import LoadingContext from "../../context/LoadingContext";

const Sidebar = (props) => {
  //   const [props.activeView, props.activeView] = React.useState("orders");
  const { setLoading } = React.useContext(LoadingContext);
  const buttonStyle = { transition: "ease-in-out", transitionDuration: "0.15s", borderRadius: "8px", color: "white", width: "50px", height: "50px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "25px" };

  return (
    <div style={props.style} className={props.className}>
      <div style={{ backgroundColor: "", height: "100%", display: "flex", alignItems: "start", justifyContent: "center", marginTop: "0.6rem" }}>
        <ButtonGroup style={{ gap: "10px", transition: "ease-in", transitionDuration: "0.2s" }} vertical>
          <span
            onClick={() => {
              setLoading(true);
              props.setActiveView("orders");
            }}
            style={{ ...buttonStyle, backgroundColor: props.activeView === "orders" ? "#0d6efd" : "#fff", color: props.activeView === "orders" ? "#fff" : "#0d6efd" }}
          >
            {props.activeView === "orders" ? <FileTextFill /> : <FileText />}
          </span>
          <span
            onClick={() => {
              // setLoading(true);
              props.setActiveView("stats");
            }}
            style={{ ...buttonStyle, backgroundColor: props.activeView === "stats" ? "#0d6efd" : "#fff", color: props.activeView === "stats" ? "#fff" : "#0d6efd" }}
          >
            {props.activeView === "stats" ? <FileBarGraphFill /> : <FileBarGraph />}
          </span>
          <span
            onClick={() => {
              setLoading(true);
              props.setActiveView("dbs");
            }}
            style={{ ...buttonStyle, backgroundColor: props.activeView === "dbs" ? "#0d6efd" : "#fff", color: props.activeView === "dbs" ? "#fff" : "#0d6efd" }}
          >
            <Bicycle />
          </span>
          {/* <span
            onClick={() => {
              props.setActiveView("user");
            }}
            style={{ ...buttonStyle, backgroundColor: props.activeView === "user" ? "#0d6efd" : "#fff", color: props.activeView === "user" ? "#fff" : "#0d6efd" }}
          >
            {props.activeView === "user" ? <PersonFill /> : <Person />}
          </span> */}
        </ButtonGroup>
      </div>
    </div>
  );
};

export default Sidebar;

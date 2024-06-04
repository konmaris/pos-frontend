import React from "react";
import Nav from "react-bootstrap/Nav";
import Products from "./Products";

const Categories = (props) => {
  const [currKey, setCurrKey] = React.useState("cold_drinks");

  const categories = props.categories;

  const categoriesMap = categories.map((category) => {
    return (
      <Nav.Item key={category.eKey}>
        <Nav.Link eventKey={category.eKey}>{category.label.toUpperCase()}</Nav.Link>
      </Nav.Item>
    );
  });

  return (
    <div>
      <Nav
        variant="pills"
        activeKey={currKey}
        onSelect={(e) => {
          setCurrKey(e);
        }}
        defaultActiveKey="cold_drinks"
        style={{ marginBottom: "1rem" }}
        className="mb-4"
      >
        {categoriesMap}
      </Nav>
      <Products category={currKey} />
    </div>
  );
};

export default Categories;

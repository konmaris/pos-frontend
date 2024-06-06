import React from "react";
import Nav from "react-bootstrap/Nav";
import Products from "./Products";

const Categories = (props) => {
  const [currKey, setCurrKey] = React.useState("cold_coffees");

  const categories = props.categories;
  const currCategory = categories.filter((category) => category.name === currKey);

  const categoriesMap = categories.map((category) => {
    return (
      <Nav.Item key={category.name}>
        <Nav.Link eventKey={category.name}>{category.label.toUpperCase()}</Nav.Link>
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
      <Products category={currCategory[0]?._id} />
    </div>
  );
};

export default Categories;

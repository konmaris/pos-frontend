import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Products from "./Products";

const Categories = (props) => {
  const [currKey, setCurrKey] = React.useState("cold_coffees");

  const [currCategory, setCurrCategory] = React.useState({}); // [product, setProduct

  const categories = props.categories;

  useEffect(() => {
    setCurrCategory(categories.filter((category) => category.name === currKey)[0]);
  }, [currKey]);

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
      <Products category={currCategory} />
    </div>
  );
};

export default Categories;

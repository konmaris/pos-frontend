import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Products from "./Products";
import { Navbar } from "react-bootstrap";

const Categories = (props) => {
  // //console.log("props", props);
  const [currCategory, setCurrCategory] = React.useState(props.categories[0]); // [product, setProduct

  // const [currCategory, setCurrCategory] = React.useState({}); // [product, setProduct

  const categories = props.categories;

  // useEffect(() => {
  //   setCurrCategory(categories.filter((category) => category.name === currKey)[0]);
  // }, []);

  const categoriesMap = categories.map((category) => {
    return (
      <Nav.Item style={{ fontSize: 14, whiteSpace: "nowrap" }} key={category.name}>
        <Nav.Link eventKey={category.name}>{category.label.toUpperCase()}</Nav.Link>
      </Nav.Item>
    );
  });

  return (
    <div className="h-100 w-100">
      <Nav
        variant="pills"
        activeKey={currCategory.name}
        onSelect={(e) => {
          //console.log(e);
          setCurrCategory(() => {
            return categories.filter((category) => category.name === e)[0];
          });
        }}
        defaultActiveKey={props.categories[0].name}
        className="mb-4"
        style={{ overflowX: "auto", overflowY: "hidden", flexWrap: "nowrap" }}
      >
        {categoriesMap}
      </Nav>

      <Products category={currCategory._id} />
    </div>
  );
};

export default Categories;

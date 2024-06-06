import React, { useEffect } from "react";
import axios from "axios";
import Categories from "./Categories";

const Menu = (props) => {
  const [categories, setCategories] = React.useState([]);

  useEffect(() => {
    axios.get("https://pos-backend-356y.onrender.com/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  return (
    <div className={props.className} style={props.style}>
      <h2 className="mb-4">Menu</h2>
      <Categories categories={categories} />
    </div>
  );
};

export default Menu;

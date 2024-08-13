import React, { useEffect } from "react";
import axios from "axios";
import Categories from "./Categories";
import { Spinner } from "react-bootstrap";
import LoadingContext from "../../context/LoadingContext";

const Menu = (props) => {
  const [categories, setCategories] = React.useState([]);
  const { loading, setLoading } = React.useContext(LoadingContext);

  useEffect(() => {
    const fetchCategories = async () => {
      axios.get("https://esp-pos-backend.onrender.com/categories").then((res) => {
        setCategories(res.data);
      });
    };
    fetchCategories();
  }, []);

  return (
    <>
      <div className={props.className} style={props.style}>
        {/* <h2 className="mb-4">Menu</h2> */}
        {categories.length > 0 && <Categories categories={categories} />}
      </div>
    </>
  );
};

export default Menu;

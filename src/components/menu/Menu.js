import React from "react";
import Categories from "./Categories";

const Menu = (props) => {
  const categories = [
    { eKey: "cold_drinks", label: "Cold Drinks" },
    { eKey: "hot_drinks", label: "Hot Drinks" },
    { eKey: "wraps", label: "Wraps" },
    { eKey: "pastries", label: "Pastries" },
  ];
  return (
    <div className={props.className} style={props.style}>
      <h2 className="mb-4">Menu</h2>
      <Categories categories={categories} />
    </div>
  );
};

export default Menu;

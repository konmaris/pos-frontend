import React, { useEffect } from "react";
import { Button, Card, CardGroup, Col, Form, Modal, Row } from "react-bootstrap";
import CartContext from "../../context/CartContext";

const products = [
  {
    id: 0,
    category: "cold_drinks",
    name: "Freddo Espresso",
    price: 2.0,
    extras: [
      {
        name: "sugar",
        label: "Sugar",
        type: "multiple_choice",
        options: [
          { label: "Black", value: 0 },
          { label: "A bit", value: 1 },
          { label: "Medium", value: 2 },
          { label: "Sweet", value: 3 },
        ],
        cost: 0,
        showValue: true,
        required: true,
      },
      {
        name: "size",
        label: "Size",
        type: "multiple_choice",
        options: [
          { label: "Regular", value: 0, cost: 0, showValue: false },
          { label: "XLarge", value: 1, cost: 1, showValue: true },
        ],
        cost: 0,
        showValue: false,
        required: true,
      },
      {
        name: "variety",
        label: "Variety",
        type: "multiple_choice",
        options: [
          { label: "House blend (100% Arabica)", value: 0, cost: 0, showValue: false },
          { label: "Ethiopia Murago", value: 1, cost: 0.5, showValue: true },
          { label: "El Salvador Hermanos Menas", value: 2, cost: 0.5, showValue: true },
          { label: "Guatemala Santa Rita", value: 3, cost: 0.5, showValue: true },
          { label: "Colombia Tumbaga (Decaf)", value: 4, cost: 0.5, showValue: true },
        ],
        cost: 0,
        showValue: false,
        required: true,
      },
      {
        name: "decaf",
        label: "Decaffeinated",
        type: "switch",
        cost: 0.2,
        showValue: false,
        required: false,
      },
      {
        name: "milk",
        label: "Fresh milk",
        type: "checkbox",
        cost: 0.1,
        showValue: false,
        required: false,
      },
      {
        name: "plant_milk",
        label: "Plant milk",
        type: "checkbox",
        cost: 0.5,
        showValue: false,
        required: false,
      },
    ],
  },
  { id: 1, category: "cold_drinks", name: "Frappe", price: 2.5 },
  {
    id: 2,
    category: "hot_drinks",
    name: "Flat White",
    price: 2.2,
    extras: [
      {
        name: "sugar",
        label: "Sugar",
        type: "multiple_choice",
        options: [
          { label: "Black", value: 0 },
          { label: "A bit", value: 1 },
          { label: "Medium", value: 2 },
          { label: "Sweet", value: 3 },
        ],
        cost: 0,
        showValue: true,
        required: true,
      },
      {
        name: "size",
        label: "Size",
        type: "multiple_choice",
        options: [
          { label: "Regular", value: 0, cost: 0, showValue: false },
          { label: "XLarge", value: 1, cost: 1, showValue: true },
        ],
        cost: 0,
        showValue: false,
        required: true,
      },
      {
        name: "decaf",
        label: "Decaffeinated",
        type: "switch",
        cost: 0.2,
        showValue: false,
        required: false,
      },
      {
        name: "milk",
        label: "Fresh milk",
        type: "checkbox",
        cost: 0.1,
        showValue: false,
        required: false,
      },
      {
        name: "plant_milk",
        label: "Plant milk",
        type: "checkbox",
        cost: 0.5,
        showValue: false,
        required: false,
      },
    ],
  },
  { id: 3, category: "cold_drinks", name: "Iced Espresso", price: 4 },
  { id: 4, category: "hot_drinks", name: "Latte", price: 4.5 },
  { id: 5, category: "hot_drinks", name: "Espresso", price: 3.5 },
  { id: 6, category: "wraps", name: "Chicken Wrap", price: 6.5 },
  { id: 7, category: "wraps", name: "Veggie Wrap", price: 5.5 },
  { id: 8, category: "pastries", name: "Croissant", price: 2.5 },
  { id: 9, category: "pastries", name: "Muffin", price: 2.0 },
];

const Products = (props) => {
  const { cart, setCart } = React.useContext(CartContext);
  const [currProduct, setCurrProduct] = React.useState({}); // [product, setProduct

  /* MODAL */
  const [show, setShow] = React.useState(false);
  const [saveButtonActive, setSaveButtonActive] = React.useState(false);

  const [currProductExtras, setCurrProductExtras] = React.useState([]); // [product, setProduct

  const handleClose = () => {
    setShow(false);
    setCurrProduct(null);
    setCurrProductExtras([]);
  };
  const handleShow = () => setShow(true);

  const handleAddToCart = (product) => {
    const newItems = [...cart.items];

    //calculate cost of extras
    let extrasCost = 0;
    currProductExtras.forEach((extra) => {
      const extraName = Object.keys(extra)[0];

      if (extra[extraName].value) {
        extrasCost += extra[extraName].cost;
      }
      console.log({ extraCost: extrasCost });
    });

    // console.log("extrasCost", extrasCost);

    const product_ = { ...product, extras: currProductExtras, price: product.price + extrasCost };
    newItems.push(product_);
    setCart({ items: newItems, total: cart.total + product_.price });
    setCurrProductExtras([]);
    setCurrProduct(null);
  };

  const category = props.category;

  const categoryProducts = products.filter((product) => {
    return product.category === category;
  });

  const productsMap = categoryProducts.map((product, idx) => {
    return (
      <Col key={product.name}>
        <Card
          style={{ height: "130px" }}
          key={product.name}
          onClick={() => {
            // handleAddToCart(product);
            setCurrProduct(product.id);
            handleShow();
          }}
        >
          {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
          <Card.Body>
            <Card.Title style={{ height: "70%" }}>{product.name}</Card.Title>
            <Card.Text>{product.price.toFixed(2)} €</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    );
  });

  useEffect(() => {
    console.log(currProductExtras);
  }, [currProductExtras]);

  //using useEffect to check if all required extras are selected
  useEffect(() => {
    let requiredExtras = products[currProduct]?.extras?.filter((extra) => {
      return extra.required === true;
    });

    // console.log(requiredExtras);

    let requiredExtrasNames = requiredExtras?.map((extra) => {
      return extra.name;
    });

    let requiredExtrasValues = currProductExtras?.map((extra) => {
      return Object.keys(extra)[0];
    });

    let missingRequiredExtras = requiredExtrasNames?.filter((requiredExtra) => {
      return !requiredExtrasValues?.includes(requiredExtra);
    });

    console.log(missingRequiredExtras);

    if (missingRequiredExtras?.length > 0 || missingRequiredExtras === undefined) {
      setSaveButtonActive(false);
    } else {
      setSaveButtonActive(true);
    }
  }, [currProductExtras]);

  const extrasRender = products[currProduct]?.extras?.map((extra) => {
    return (
      <div key={extra.name}>
        {extra.type === "multiple_choice" ? (
          <>
            <Form.Label style={{ fontWeight: "600" }}>{extra.label}</Form.Label>
            <div key="inline-radio" className="mb-3">
              {extra.options.map((option) => {
                return (
                  <Form.Check
                    onClick={(e) => {
                      setCurrProductExtras((prev) => {
                        //filter out the previous extra with the same name
                        let prev_ = prev?.filter((prevExtra) => {
                          return Object.keys(prevExtra)[0] !== extra.name;
                        });

                        if (option?.cost > 0 || extra.cost > 0) {
                          prev_.push({ [extra.name]: { optionLabel: option.label, value: option.value, label: extra.label, cost: option.cost, showValue: true } });
                        } else {
                          prev_.push({ [extra.name]: { optionLabel: option.label, value: option.value, label: extra.label, cost: extra.cost, showValue: extra.showValue } });
                        }

                        return prev_;
                      });
                    }}
                    inline
                    key={option.label}
                    type="radio"
                    label={option.label + (option.cost > 0 ? ` (+${option.cost.toFixed(2)}€)` : "")}
                    name={extra.name}
                    id={option.label}
                  />
                );
              })}
            </div>
          </>
        ) : extra.type === "switch" ? (
          <>
            <Form.Label style={{ fontWeight: "600" }}>{extra.label + (extra.cost > 0 ? ` (+${extra.cost.toFixed(2)}€)` : "")}</Form.Label>
            <Form.Check // prettier-ignore
              type="switch"
              id="custom-switch"
              onChange={(e) => {
                console.log(e.target.checked);
                setCurrProductExtras((prev) => {
                  let prev_ = prev.filter((prevExtra) => {
                    return Object.keys(prevExtra)[0] !== extra.name;
                  });

                  prev_.push({ [extra.name]: { value: e.target.checked, label: extra.label, cost: extra.cost, showValue: extra.showValue } });
                  return prev_;
                });
              }}
            />
          </>
        ) : null}
      </div>
    );
  });

  const extrasCheckboxesRender = products[currProduct]?.extras?.map((extra) => {
    return (
      <div key={extra.name}>
        {extra.type === "checkbox" ? (
          <Form.Check
            type="checkbox"
            label={extra.label + (extra.cost > 0 ? ` (+${extra.cost.toFixed(2)}€)` : "")}
            key={extra.name}
            onChange={(e) => {
              setCurrProductExtras((prev) => {
                //filter out the previous extra with the same name, if it exists
                let prev_ = prev.filter((prevExtra) => {
                  return Object.keys(prevExtra)[0] !== extra.name;
                });

                prev_.push({ [extra.name]: { value: e.target.checked, label: extra.label, cost: extra.cost, showValue: extra.showValue } });
                return prev_;
              });
            }}
          />
        ) : null}
      </div>
    );
  });

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{products[currProduct]?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {extrasRender}
            {extrasCheckboxesRender?.length > 0 ? (
              <Form.Label className="mt-3" style={{ fontWeight: "600" }}>
                Extras
              </Form.Label>
            ) : null}
            {extrasCheckboxesRender}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            disabled={!saveButtonActive}
            onClick={() => {
              handleAddToCart(products[currProduct]);
              handleClose();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Row xs={1} md={3} className="g-4">
        {productsMap}
      </Row>
    </div>
  );
};

export default Products;

import React, { useEffect } from "react";
import { Alert, Button, ButtonGroup, Card, CardGroup, Col, Form, FormLabel, Modal, Row, Spinner } from "react-bootstrap";
import CartContext from "../../context/CartContext";
import axios from "axios";
import LoadingContext from "../../context/LoadingContext";

const Products = (props) => {
  const currCategory = props.category;

  const { loading, setLoading } = React.useContext(LoadingContext);

  const [products, setProducts] = React.useState([]);
  const [extras, setExtras] = React.useState([]);

  const { cart, setCart } = React.useContext(CartContext);
  const [currProduct, setCurrProduct] = React.useState({}); // [product, setProduct
  const [currProductObj, setCurrProductObj] = React.useState({}); // [product, setProduct

  /* MODAL */
  const [show, setShow] = React.useState(false);

  const [saveButtonActive, setSaveButtonActive] = React.useState(false);

  const [currProductExtras, setCurrProductExtras] = React.useState([]); // [product, setProduct
  const [currQuantity, setCurrQuantity] = React.useState(1);

  const fetchProducts = async () => {
    await axios.get("https://esp-pos-backend.onrender.com/products").then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  const fetchExtras = async () => {
    await axios.get("https://esp-pos-backend.onrender.com/extras").then((res) => {
      setExtras(res.data);
    });
  };

  const handleClose = () => {
    setShow(false);
    setCurrProduct(null);
    setCurrProductExtras([]);
    setCurrQuantity(1);
  };
  const handleShow = () => setShow(true);

  const handleAddToCart = (product) => {
    ////console.log("product", product);
    const newItems = [...cart.items];

    //calculate cost of extras
    let extrasCost = 0;
    ////console.log("currProductExtras", currProductExtras);
    currProductExtras.forEach((extra) => {
      if (extra.optionValue !== false) extrasCost += extra.optionPrice;
    });

    // ////console.log("extrasCost", extrasCost);

    const product_ = { ...product, extras: currProductExtras, price: product.price + extrasCost, id: product._id, quantity: currQuantity };
    delete product_._id;
    delete product_.__v;

    newItems.push(product_);
    setCart({ items: newItems, total: cart.total + product_.price * currQuantity });
    setCurrProductExtras([]);
    setCurrQuantity(1);
    setCurrProduct(null);
  };

  useEffect(() => {
    fetchProducts();
    fetchExtras();
  }, []);

  const productsMap = products.map((product) => {
    if (product.category === currCategory) {
      return (
        <Col key={product.name}>
          <Card
            style={{ height: "130px" }}
            key={product._id}
            onClick={() => {
              // handleAddToCart(product);
              setCurrProduct(product._id);
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
    } else {
      return null;
    }
  });

  const extrasRender = currProductObj?.extras?.map((extra) => {
    if (extra.type === "multiple_choice") {
      return (
        <div key={extra.name} className="mb-3">
          <Form.Label style={{ fontWeight: "600" }}>{extra.label}</Form.Label>
          <div key="inline-radio" className="mb-3">
            {extra.options.map((option) => {
              return (
                <Form.Check
                  onClick={(e) => {
                    setCurrProductExtras((prev) => {
                      ////console.log("prev", prev);
                      //filter out the previous extra with the same name
                      let prev_ = prev?.filter((prevExtra) => {
                        return prevExtra.optionName !== extra.name;
                      });

                      if (option?.cost > 0 || extra.cost > 0) {
                        prev_.push({ optionLabel: option.label, optionValue: option.value, optionName: extra.name, optionPrice: option.cost, optionShow: true });
                      } else {
                        prev_.push({ optionLabel: option.label, optionValue: option.value, optionName: extra.name, optionPrice: extra.cost, optionShow: extra.showValue });
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
        </div>
      );
    } else {
      return null;
    }
  });

  const extrasCheckboxesRender = currProductObj?.extras?.map((extra) => {
    if (extra.type === "checkbox") {
      return (
        <div key={extra.name}>
          <Form.Check
            type="checkbox"
            label={extra.label + (extra.cost > 0 ? ` (+${extra.cost.toFixed(2)}€)` : "")}
            key={extra.name}
            onChange={(e) => {
              setCurrProductExtras((prev) => {
                //filter out the previous extra with the same name, if it exists
                let prev_ = prev.filter((prevExtra) => {
                  //console.log(prevExtra.optionName);
                  //console.log(extra.name);
                  return prevExtra.optionName !== extra.name;
                });

                prev_.push({ optionValue: e.target.checked, optionLabel: extra.label, optionName: extra.name, optionPrice: extra.cost, optionShow: extra.showValue });
                //console.log(prev_);
                return prev_;
              });
            }}
          />
        </div>
      );
    } else {
      return null;
    }
  });

  //console.log(extrasCheckboxesRender);

  useEffect(() => {
    const _product = products.filter((product) => product._id === currProduct)[0];
    // ////console.log(currProductObj);

    const _extras = _product?.extras?.map((extra) => {
      return extras.find((extra_) => extra_._id === extra);
    });

    ////console.log(_extras);

    const _currObj = { ..._product, extras: _extras };

    setCurrProductObj(_currObj);
  }, [currProduct]);

  //using useEffect to check if all required extras are selected
  useEffect(() => {
    if (products) {
      let requiredExtras = currProductObj?.extras?.filter((extra) => {
        ////console.log("extra", extra);
        return extra.required === true;
      });

      ////console.log("required extras", requiredExtras);

      let requiredExtrasNames = requiredExtras?.map((extra) => {
        return extra.name;
      });

      let currExtraNames = currProductExtras?.map((extra) => {
        ////console.log("extra2", extra);
        return extra.optionName;
      });

      ////console.log("curr extra names", currExtraNames);
      ////console.log("required extra names", requiredExtrasNames);

      const extrasMatched = requiredExtrasNames?.every((val) => currExtraNames.includes(val));
      ////console.log(extrasMatched);

      if (extrasMatched) {
        setSaveButtonActive(true);
      } else {
        setSaveButtonActive(false);
      }
    }
  }, [currProductExtras, products]);

  return (
    <div className="w-100 h-75">
      <Modal scrollable show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currProductObj?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {extrasRender?.filter((extra) => extra !== null).length > 0 && extrasRender}
            <div className="mb-3">
              {extrasCheckboxesRender?.filter((extra) => extra !== null).length > 0 ? (
                <Form.Label className="" style={{ fontWeight: "600" }}>
                  Extras
                </Form.Label>
              ) : null}
              {extrasCheckboxesRender}
            </div>
            <Form.Label className="" style={{ fontWeight: "600" }}>
              Comments
            </Form.Label>
            <Form.Control
              value={currProductObj?.comments}
              onChange={(e) => {
                setCurrProductObj((prev) => {
                  return { ...prev, comments: e.target.value };
                });
              }}
              as="textarea"
              rows={3}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ width: "100%", backgroundColor: "", display: "flex", alignItems: "center" }}>
            <div style={{ flex: "100%", display: "flex" }}>
              <Button
                onClick={() => {
                  if (currQuantity > 1) setCurrQuantity(currQuantity - 1);
                }}
                style={{ height: "40px", width: "40px" }}
              >
                -
              </Button>
              <div style={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}>{currQuantity}</div>
              <Button
                onClick={() => {
                  setCurrQuantity(currQuantity + 1);
                }}
                style={{ height: "40px", width: "40px" }}
              >
                +
              </Button>
            </div>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              disabled={!saveButtonActive}
              onClick={() => {
                handleAddToCart(currProductObj);
                handleClose();
              }}
              style={{ width: "230px", marginLeft: "10px" }}
            >
              Save Changes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {loading === true ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status" variant="primary" />
        </div>
      ) : (
        <Row xs={1} md={3} className="g-4">
          {productsMap}
        </Row>
      )}
    </div>
  );
};

export default Products;

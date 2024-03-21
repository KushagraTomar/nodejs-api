const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Handling GET requests to /products",
  });
});

router.post("/", (req, res) => {
  const product = {
    name: req.body.name,
    price: req.body.price
  }
  res.status(201).json({
    message: "Handling POST requests to /products",
    createdProduct: product
  });
});

router.get("/:productId", (req, res) => {
  const id = req.params.productId;
  if (id === 'special') {
      res.status(200).json({
        message: "products/special id",
      });
  } else {
      res.status(200).json({
        message: "products/numbers id",
      });
  }
});

router.patch("/:productId", (req, res) => {
  const id = req.params.productId;
  res.status(200).json({
    message: "products/id update",
  });
});

router.delete("/:productId", (req, res) => {
  const id = req.params.productId;
  res.status(200).json({
    message: "products/id delete",
  });
});

module.exports = router;

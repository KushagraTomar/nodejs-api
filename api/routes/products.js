
const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer")

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads/')
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname)
  }
})

const fileFilter = (req, file, callback) => {
  if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
    callback(null,  true)
  } else {
    callback(null, false)
  }
}

const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5 // 5mb
  },
  fileFilter: fileFilter
})

router.get("/", (req, res) => {
  Product.find()
    .select('_id name price productImage')
    .exec()
    .then(docs => {
      // console.log(docs)
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            productImage: doc.productImage,
            price: doc.price,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id
            }
          }
        })
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
});

router.post("/", upload.single('productImage'), (req, res) => {
  console.log(req.file)
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });

  product.save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: {
          _id: result._id,
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          request: {
            type:'GET',
            url: 'http://localhost:3000/products/' + result._id
          }
        },
      });
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
});

router.get("/:productId", (req, res) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('_id name price productImage')
    .exec()
    .then(doc => {
      console.log("From database", doc)
      if (doc) {
        res.status(200).json(doc)
      } else {
        res.status(404).json({
          message: 'No valid entry for provided Id'
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
});

router.patch("/:productId", (req, res) => {
  const id = req.params.productId;
  const updateOps = {}
  for(const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Product.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
});
 
router.delete("/:productId", (req, res) => {
  const id = req.params.productId;
  Product.deleteOne({_id: id})
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
});

module.exports = router;
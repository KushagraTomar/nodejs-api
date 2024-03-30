const Order = require("../models/order");
const Product = require("../models/product")
const mongoose = require("mongoose");

exports.orders_get_all = (req, res) => {
    Order.find()
      .populate('product', 'name')
      .exec()
      .then((docs) => {
        res.status(200).json({
          count: docs.length,
          orders: docs.map((doc) => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + doc._id,
              },
            };
          }),
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }

exports.orders_post = (req, res) => {
    Product.findById(req.body.productId)
      .then((product) => {
        // if product returned is null
        // product not found for order
        if (!product) {
          return res.status(404).json({
              message: "Product Not Found"
          })
        }  
        const order = new Order({
          _id: new mongoose.Types.ObjectId(),
          product: req.body.productId,
          quantity: req.body.quantity,
        });
        return order.save();
      })
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }

exports.orders_get = (req, res) => {
    Order.findById(req.params.orderId)
    .select('_id product quantity')  
    .populate('product', 'name')
    .exec()
      .then(result => {
          if (!result) {
              return res.status(404).json({
                  message:'Order Not Found'
              })
          }
          res.status(200).json({
              order: result,
              request: {
                  type: 'GET',
                  desc: 'GET_ALL_ORDERS',
                  url: 'http://localhost:3000/orders/'
              }
          })
      })
      .catch(err => {
          console.log(err),
          res.status(500).json({
              error: err
          })
      })
  }

exports.orders_delete = (req, res) => {
    const id = req.params.orderId;
    Order.deleteOne({_id: id})
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Order deleted'
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          error: err
        })
      })
}
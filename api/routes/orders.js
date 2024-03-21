const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.status(200).json({
        message: "Handling GET requests to /orders"
    })
})

router.post('/', (req, res) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: "Handling POST requests to orders",
        orderCreated: order
    })
})

router.get('/:orderId', (req, res) => {
    res.status(200).json({
        message: "orders/id get",
        orderId: req.params.orderId
    })
})

router.delete('/:orderId', (req, res) => {
    res.status(200).json({
        message: "orders/id delete",
        orderId: req.params.orderId
    })
})

module.exports = router
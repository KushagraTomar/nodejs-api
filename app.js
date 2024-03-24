
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

mongoose.connect('mongodb+srv://new_user_1:new_user_1@cluster0.k7wenfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({}))
app.use(cors())

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

// error handling to handle unknown http request
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

// error handling to handle error in entire app
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app
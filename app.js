const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');

const bannersRoutes = require('./api/routes/banners');
const brandsRouter = require('./api/routes/brands')
const categoryRouter = require('./api/routes/category');
const productRouter = require('./api/routes/product');
const websiteRouter = require('./api/routes/website')
const settingRouter = require('./api/routes/setting')
const customerRouter = require('./api/routes/customer');
const cartRouter = require('./api/routes/cart');
const customerAddressRouter = require('./api/routes/customer-address')
const orderRouter = require('./api/routes/order');

//Local database
// mongoose.connect(`mongodb://localhost:27017/Mymart`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,}).then(() => console.log('Mongoose up')).catch(e => {
//     console.log(e)
// });

//Dev database
mongoose.connect(`mongodb+srv://Mymart:V7CM2UNi1tbRMqeR@cluster0.0onwc.mongodb.net/Mymart?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,}).then(() => console.log('Mongoose up')).catch(e => {
    console.log(e)
});

mongoose.Promise = global.Promise;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use("/banners", bannersRoutes);
app.use("/brands", brandsRouter);
app.use('/category', categoryRouter)
app.use('/product', productRouter)
app.use("/customer", customerRouter);
app.use("/cart", cartRouter);
app.use("/website", websiteRouter);
app.use("/setting", settingRouter);
app.use("/customer-address", customerAddressRouter);
app.use("/orders", orderRouter);


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;

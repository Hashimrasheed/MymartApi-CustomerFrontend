var express = require('express');
var router = express.Router();
var CustomerController = require('../controllers/CustomerController');
var { SignInCustomerRequest } = require("../Validation/CustomerRequest");

router.post("/createGuest", CustomerController.createGuest);
// router.post("/login", SignInCustomerRequest, CustomerController.login);


module.exports = router;
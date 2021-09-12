var express = require('express');
var router = express.Router();
var OrdersController = require('../controllers/OrdersController'); 
var check_auth = require("../middleware/web/check-auth");


router.get('/previous-orders', check_auth, OrdersController.previousOrders);
router.post('/create-order/:orderId', check_auth, OrdersController.createOrder);
router.post('/initiate-order', check_auth, OrdersController.initiateOrder);
router.get('/track-order/:orderId',  OrdersController.track_order);

module.exports = router;
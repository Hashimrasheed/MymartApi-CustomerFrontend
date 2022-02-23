var express = require('express');
var router = express.Router();
var check_auth = require('../middleware/check-auth');
var CartController = require('../controllers/CartController');


router.get('/', CartController.fetchCart);
router.post('/addToCart', CartController.addToCart);
router.post('/changeQuantity', CartController.changeQuantity);
router.post('/removeProduct', CartController.removeProduct);


module.exports = router;
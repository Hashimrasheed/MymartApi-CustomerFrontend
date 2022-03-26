var express = require('express');
var router = express.Router();
var check_auth = require('../middleware/check-auth');
var CartController = require('../controllers/CartController');


router.post('/', CartController.fetchCart);
router.post('/products', CartController.fetchCart); //Need to create new api 
router.post('/addToCart', CartController.addToCart);
router.post('/changeQuantity', CartController.changeQuantity);
router.post('/removeProduct', CartController.removeProduct);


module.exports = router;
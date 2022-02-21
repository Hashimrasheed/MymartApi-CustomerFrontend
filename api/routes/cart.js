var express = require('express');
var router = express.Router();
var check_auth = require('../middleware/check-auth');
var CartController = require('../controllers/CartController');


router.get('/', check_auth, CartController.fetchCart);
router.get('/', check_auth, CartController.addToCart);


module.exports = router;
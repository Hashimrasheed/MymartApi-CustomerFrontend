var express = require('express');
var router = express.Router();
var check_auth = require('../middleware/check-auth');
var CartController = require('../controllers/CustomerController');


router.get('/getAllOptions', check_auth, CartController.getAllAddOnsValues);

router.get('/getOption/:optionId', check_auth, CartController.getAddOnsValue);

router.post('/addOptions', check_auth, CartController.addAddOnsValue);

router.put('/editOption/:optionId', check_auth, CartController.editAddOnsValue);

router.delete('/deleteOption/:optionId', check_auth, CartController.deleteAddOnsValue);


module.exports = router;
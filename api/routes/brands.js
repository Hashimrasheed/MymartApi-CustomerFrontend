var express = require('express');
var router = express.Router();
var BrandsController = require('../controllers/BrandsController');


router.get('/',  BrandsController.get_all);


module.exports = router;
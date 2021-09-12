var express = require('express');
var router = express.Router();
var BannersController = require('../controllers/BannersController');


router.get('/', BannersController.get_all);


module.exports = router;

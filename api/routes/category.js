var express = require('express');
var router = express.Router();
var CategoryController = require('../controllers/CategoryController');


router.get('/',  CategoryController.get_all);
router.get('/home-page',  CategoryController.getHomePageCategory);


module.exports = router;
var express = require('express');
var router = express.Router();
const WebsiteController = require('../controllers/WebsiteController');



router.get('/', WebsiteController.fetch_business_slug);



module.exports = router;

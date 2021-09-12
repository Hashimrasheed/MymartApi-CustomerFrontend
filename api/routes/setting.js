var express = require('express');
var router = express.Router();
const SettingsController = require('../controllers/SettingsController');


router.get('/',   SettingsController.settings);
router.get('/store-logo', SettingsController.getStoreLogo);


module.exports = router;

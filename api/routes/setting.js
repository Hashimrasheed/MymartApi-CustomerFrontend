var express = require('express');
var router = express.Router();
const SettingsController = require('../controllers/SettingsController');


router.get('/',   SettingsController.settings);


module.exports = router;

var express = require('express');
var check_auth = require("../middleware/web/check-auth");
var router = express.Router();
var CustomerAddressController = require('../controllers/CustomerAddressController');
router.post('/save-address', check_auth,CustomerAddressController.saveAddress);

router.get('/fetch-all-address', check_auth,CustomerAddressController.fetch_all_address);
router.post('/mark-default-address', check_auth,CustomerAddressController.mark_default_address);
router.get('/fetch-default-address', check_auth,CustomerAddressController.fetch_default_address);

router.delete('/delete-address/:addressId', check_auth,CustomerAddressController.deleteAddress);
router.put('/edit-address/:addressId', check_auth,CustomerAddressController.editAddress);

router.post('/save-default-address', check_auth, CustomerAddressController.saveDefaultAddress);

module.exports = router;
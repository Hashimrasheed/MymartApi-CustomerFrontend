var express = require('express');
var router = express.Router();
const ProductController = require('../controllers/ProductController');


/* Routes for the product. */

router.get('/', ProductController.fetchAllProducts);
router.get('/:productId', ProductController.fetchSingleProduct);
// router.get('/', ProductController.fetch_all);
// router.get('/search-products', ProductController.searchProducts);
// router.get("/get-all-products", ProductController.getAllProducts);
// router.get('/cat/:catId', ProductController.fetchProductByCategory);


module.exports = router;

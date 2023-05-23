const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require("multer"); 


const upload = multer({ dest: 'uploads/' });


// Route for creating a new product
router.post('/createproduct', productController.createProduct);

// Route for retrieving all products
router.get('/getallproducts', productController.getProductss);

// Route for retrieving a single product by ID
router.get('/getsingleproduct/:id', productController.getProductById);

// Route for updating a product by ID
router.put('/updateproduct/:id', productController.updateProductById);

// Route for deleting a product by ID
router.delete('/deleteproduct/:id', productController.deleteProductById);

router.post('/upload', upload.array('images'), productController.uploadImages);

router.get('/getproducts', productController.getProducts);


module.exports = router;

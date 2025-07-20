import express from "express";
import {
    isAdmin,
    requireSignIn
} from '../middlewares/authMiddleware.js';
import {
    brainTreePaymentController,
    braintreeTokenController,
    createProductController,
    deleteProductController,
    getProductController,
    getSingleProductController,
    productCatagoryController,
    productCountController,
    productFilterController,
    productListController,
    relatedProductController,
    searchProductController,
    updateProductController
} from "../controllers/productController.js";
import formidable from "express-formidable";



const router = express.Router();

//routes
//create-products
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

//get products
router.get('/get-product', getProductController);

//single product
router.get('/get-product/:slug', getSingleProductController);

//update-products
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

//delete photo
router.delete('/delete-product/:pid', deleteProductController)

//filter products
router.post('/product-filter', productFilterController)

//count product
router.get('/product-count', productCountController);

//product per page
router.get('/product-list/:page', productListController);

//search-product
router.get('/search/:keyword', searchProductController);

//similar-product
router.get('/related-product/:pid/:cid', relatedProductController);

//catagory wise product
router.get("/product-catagory/:slug", productCatagoryController)

//payment route
//token
router.get("/braintree/token", braintreeTokenController)
//payment
router.post("/braintree/payment",requireSignIn, brainTreePaymentController)

export default router;
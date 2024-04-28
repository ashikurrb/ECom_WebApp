import express from "express";
import {
    isAdmin,
    requireSignIn
} from '../middlewares/authMiddleware.js';
import {
    createProductController,
    deleteProductController,
    getProductController,
    getSingleProductController,
    productCatagoryController,
    productCountController,
    productFilterController,
    productListController,
    productPhotoController,
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

//get photo
router.get('/product-photo/:pid', productPhotoController);

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

export default router;
import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { catagoryController, createCatagoryController, deleteCatagoryController, singleCatagoryController, updateCatagoryController } from '../controllers/catagoryController.js';

const router = express.Router();


//create Catagory
router.post("/create-catagory", requireSignIn, isAdmin, createCatagoryController);

//update Catagory
router.put('/update-catagory/:id', requireSignIn, isAdmin, updateCatagoryController);

//get All Catagory
router.get('/get-catagory', catagoryController)

//single Catagory
router.get('/single-catagory/:slug', singleCatagoryController);

//delete Catagory
router.delete('/delete-catagory/:id', requireSignIn, isAdmin, deleteCatagoryController)

export default router;
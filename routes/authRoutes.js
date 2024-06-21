import express from "express";
import { deleteUserController, forgotPasswordController, getAllOrdersController, getAllUsersController, getOrdersController, loginController, orderStatusController, registerController, testController, updateProfileController, updateUserController } from '../controllers/authController.js'
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing

//REGISTER || Method: POST
router.post('/register', registerController)

//LOGIN || Method: POST
router.post('/login', loginController)

//Forgot Password: POST
router.post('/forgot-password', forgotPasswordController)

//Test Routes
router.get('/test', requireSignIn, isAdmin, testController)

//protected route auth
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected Admin route auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put('/profile-update', requireSignIn, updateProfileController)

//all user list
router.get("/all-users", requireSignIn, isAdmin, getAllUsersController)

//update profile by Admin
router.put('/user-update', requireSignIn, isAdmin, updateUserController)

//delete user by admin
router.delete('/delete-user/:id', requireSignIn, isAdmin, deleteUserController)

//order
router.get("/orders", requireSignIn, getOrdersController)

//all order
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController)

//order update status
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController)

export default router;
import express from "express";
import { deleteOrderController, deleteUserController, forgotPasswordController, getAllOrdersController, getAllUsersController, getOrdersController, loginController, orderStatusController, registerController, testController, updateProfileController } from '../controllers/authController.js'
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

//all user list
router.get("/all-users", requireSignIn, isAdmin, getAllUsersController)

//delete user by admin
router.delete('/delete-user/:id', requireSignIn, isAdmin, deleteUserController)

//update profile
router.put('/profile-update', requireSignIn, updateProfileController)

//order
router.get("/orders", requireSignIn, getOrdersController)

//all order
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController)

//order update status
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController)

//delete order by admin
router.delete('/delete-order/:id', requireSignIn, isAdmin, deleteOrderController)

export default router;
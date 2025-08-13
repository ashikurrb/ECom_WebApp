import express from "express";
import { dashboardController, deleteOrderController, deleteUserController, forgotPasswordController, getAllOrdersController, getAllUsersController, getForgotPasswordOtpController, getOrdersController, getOtpController, loginController, orderStatusController, registerController, updateProfileController } from '../controllers/authController.js'
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//OTP Verification
router.post('/verify-otp', getOtpController)

//REGISTER || Method: POST
router.post('/register', registerController)

//LOGIN || Method: POST
router.post('/login', loginController)

//Verify Forgot Password OTP 
router.post('/verify-forgot-password', getForgotPasswordOtpController)

//Forgot Password: POST
router.post('/forgot-password', forgotPasswordController)

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

//dashboard
router.get("/dashboard", requireSignIn, isAdmin, dashboardController);

export default router;
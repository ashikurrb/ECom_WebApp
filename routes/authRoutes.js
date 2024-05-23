import express from "express";
import { forgotPasswordController, loginController, registerController, testController, updateProfileController } from '../controllers/authController.js'
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

export default router;
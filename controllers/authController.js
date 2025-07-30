import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js"
import { CourierClient } from '@trycourier/courier';
import crypto from 'crypto';
import JWT from "jsonwebtoken";

//courier mail token
const courier = new CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

//send otp
export const getOtpController = async (req, res) => {
    try {
        const { name, email } = req.body;
        //validation
        if (!name) {
            return res.send({ message: "Name is required" })
        }
        if (!email) {
            return res.send({ message: "Email is required" })
        }

        // Find user by email or phone
        const existingUser = await userModel.findOne({ email: email });

        // Check existing user
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(200).send({
                    success: false,
                    message: "Email is already registered"
                });
            }
        }

        // Check if there's an unexpired OTP for this email
        const existingOtp = await otpModel.findOne({
            email,
            expiresAt: { $gt: Date.now() },
        });

        if (existingOtp) {
            return res.status(200).send({
                success: true,
                message: "OTP already sent. Use it or try again later.",
            });
        }

        // Generate OTP and save it temporarily
        const otp = crypto.randomInt(100000, 999999).toString();
        await new otpModel({ name, email, otp, type: "registration", expiresAt: Date.now() + 5 * 60 * 1000 }).save();

        // Send OTP via Courier email
        const { requestId } = await courier.send({
            message: {
                to: {
                    email: email
                },
                template: process.env.COURIER_OTP_TEMPLATE_KEY,
                data: {
                    name: name,
                    otp: otp,
                },
                routing: {
                    method: "single",
                    channels: ["email"],
                },
            },
        });

        res.status(200).send({
            success: true,
            message: "OTP sent to your email",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error during registration",
            error
        })
    }
};

//POST REGISTER
export const registerController = async (req, res) => {
    try {
        const { name, email, otp, password, phone, address } = req.body;

        // Find if email exists in the database
        const otpEmail = await otpModel.findOne({ email });
        if (!otpEmail) {
            return res.status(400).send({ success: false, message: "Email not found" });
        }

        // Check if OTP matches for the provided email
        const otpRecord = await otpModel.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).send({ success: false, message: "Invalid OTP" });
        }

        // Check if OTP is expired
        if (otpRecord.expiresAt < Date.now()) {
            return res.status(400).send({ success: false, message: "OTP expired" });
        }

        //validation
        if (!name) {
            return res.send({ message: 'Name is Required' })
        }
        if (!email) {
            return res.send({ message: 'Email is Required' })
        }
        if (!password) {
            return res.send({ message: 'Password is Required' })
        }
        if (!phone) {
            return res.send({ message: 'Phone Number is Required' })
        }
        if (!address) {
            return res.send({ message: 'Address is Required' })
        }

        //check User
        const existingUser = await userModel.findOne({ email })
        //existing User
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Registered. Please Log in"
            })
        }

        //register User
        const hashedPassword = await hashPassword(password);

        // Send confirmation email
        await courier.send({
            message: {
                to: { email },
                template: process.env.COURIER_WELCOME_TEMPLATE_KEY,
                data: { name },
                routing: { method: "single", channels: ["email"] },
            },
        });

        // Delete OTP record after successful registration
        await otpModel.deleteOne({ email, otp });

        //save
        const user = await new userModel({ name, email, phone, address, password: hashedPassword }).save();
        res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        })
    }
}

//POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid Email or Password" //don't declare specifically which is wrong , email or password. for security.//
            })

        }
        //check user
        const user = await userModel.findOne({ email })

        //valid
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email not registered'
            })
        }

        //compare password
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid password'
            })
        }

        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).send({
            success: true,
            message: 'Login Successful',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Log in',
            error
        })
    }
}

export const getForgotPasswordOtpController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.send({ message: "Email is Required" })
        }

        // Find user by email or phone
        const existingUser = await userModel.findOne({ email: email });

        // Check if user exists
        if (!existingUser) {
            return res.status(200).send({
                success: false,
                message: "User Not Found. Please Sign Up"
            });
        }

        //get user name
        const name = existingUser.name;

        // Check if there's an unexpired OTP for this email
        const existingOtp = await otpModel.findOne({
            email,
            expiresAt: { $gt: Date.now() },
        });

        if (existingOtp) {
            return res.status(200).send({
                success: true,
                message: "OTP already sent. Use it or try again later.",
            });
        }

        // Generate OTP and save it temporarily
        const otp = crypto.randomInt(100000, 999999).toString();
        await new otpModel({ email, name, otp, type: "password_reset", expiresAt: Date.now() + 5 * 60 * 1000 }).save();

        // Send OTP via Courier email
        const { requestId } = await courier.send({
            message: {
                to: {
                    email: email
                },
                template: process.env.COURIER_FORGOT_PASSWORD_OTP_TEMPLATE_KEY,
                data: {
                    name: name,
                    otp: otp,
                },
                routing: {
                    method: "single",
                    channels: ["email"],
                },
            },
        });

        res.status(200).send({
            success: true,
            message: "OTP sent to your email",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error getting OTP",
            error
        })
    }
}

//Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Find if email exists in the database
        const otpEmail = await otpModel.findOne({ email });
        if (!otpEmail) {
            return res.status(400).send({ success: false, message: "Email not found" });
        }

        // Check if OTP matches for the provided email
        const otpRecord = await otpModel.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).send({ success: false, message: "Invalid OTP" });
        }

        // Check if OTP is expired
        if (otpRecord.expiresAt < Date.now()) {
            return res.status(400).send({ success: false, message: "OTP expired" });
        }

        if (!email) {
            res.status(400).send({ message: 'Email is required' })
        }
        if (!otp) {
            res.status(400).send({ message: 'OTP is required' })
        }
        if (!newPassword) {
            res.status(400).send({ message: 'New Password is required' })
        }

        //check
        const user = await otpModel.findOne({ email, otp })

        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({
            success: true,
            message: 'Password Reset Successfully'
        });

        // Delete OTP record after successful registration
        await otpModel.deleteOne({ email, otp });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

//update profile controller
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        if (password && password.length < 6) {
            return res.json({ error: "Password must be 6 digit" })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, { new: true });
        res.status(200).send({
            success: true,
            message: 'Profile Updated Successfully',
            updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(404).send({
            success: false,
            message: 'Error while Updating Profile',
            error
        })
    }
}

//all users list controller
export const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel
            .find({})
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Getting All Users",
            error,
        });
    }
};

//delete user controller
export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;
        await userModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "User Deleted Successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while Deleting User"
        })
    }
}


///Order Controller
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products")
            .populate("buyer", "name")
            .sort({ createdAt: -1 });
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while getting Orders',
            error
        })
    }
}


//all orders controller
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products")
            .populate("buyer", "name")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Getting Orders",
            error,
        });
    }
};

//update order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel
            .findByIdAndUpdate(orderId, { status }, { new: true })
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updating Orders",
            error,
        });
    }
}

//delete order controller
export const deleteOrderController = async (req, res) => {
    try {
        const { id } = req.params;
        await orderModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "Order Deleted Successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while Deleting Order"
        })
    }
}

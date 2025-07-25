import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
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
        if (!answer) {
            return res.send({ message: 'Answer is Required' })
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
        const hashedPassword = await hashPassword(password)

        //save
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, answer }).save();
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
        const { email, password } = req.body
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

//Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: 'Email is required' })
        }
        if (!answer) {
            res.status(400).send({ message: 'Answer is required' })
        }
        if (!newPassword) {
            res.status(400).send({ message: 'New Password is required' })
        }

        //check
        const user = await userModel.findOne({ email, answer })

        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong Email & Answer'
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({
            success: true,
            message: 'Password Reset Successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

//Test controller
export const testController = (req, res) => {
    res.send('Protected Route')
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

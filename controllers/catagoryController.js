import catagoryModel from "../models/catagoryModel.js";
import slugify from "slugify";

//create catagory Controller 
export const createCatagoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({ messeage: 'Name is required' })
        }
        const existingCatagory = await catagoryModel.findOne({ name });
        if (existingCatagory) {
            return res.status(200).send({
                success: true,
                messeage: 'Catagory already Exists'
            });
        }
        const catagory = await new catagoryModel({ name, slug: slugify(name), }).save();
        res.status(201).send({
            success: true,
            messeage: 'New cataogry created',
            catagory,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            messeage: 'Error in Catagory'
        })
    }
};

//update catagory Controller

export const updateCatagoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const catagory = await catagoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        res.status(200).send({
            success: true,
            messeage: 'Catagory Updated Succesfully',
            catagory,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            messeage: 'Error while Updating Catagory'
        })
    }
};

//Get All Catagory
export const catagoryController = async (req, res) => {
    try {
        const catagory = await catagoryModel.find({});
        res.status(200).send({
            success: true,
            messeage: "all catagory list fetched succesfully",
            catagory,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            messeage: "Error while getting catagoriese",
        })
    }
};

//single Catagory
export const singleCatagoryController = async (req, res) => {
    try {
        const { slug } = req.params;
        const catagory = await catagoryModel.findOne({ slug: req.params.slug })
        res.status(200).send({
            success: true,
            messeage: "Get single Catagory Successfully",
            catagory,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            messeage: "Error while getting Single Catagory",
        })
    }
};

//delete catagory controller
export const deleteCatagoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await catagoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            messeage: "catagory Deleted Succesfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            messeage: "Error while Deleting catagory"
        })
    }
}
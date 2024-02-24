import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs';

//create product controller

export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, catagory, quantity, shipping } = req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" })
            case !slug:
                return res.status(500).send({ error: "Slug is required" })
            case !description:
                return res.status(500).send({ error: "Description is required" })
            case !price:
                return res.status(500).send({ error: "Price is required" })
            case !catagory:
                return res.status(500).send({ error: "Catagory is required" })
            case !quantity:
                return res.status(500).send({ error: "Quantity is required" })
            case !photo && photo.size > 1000000:
                return res.status(500).send({ error: "Photo is required and should be less than 1 mb" })
            case !shipping:
                return res.status(500).send({ error: "Shipping is required" })
        }
        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type;
        }
        await products.save()
        res.status(201).send({
            success: true,
            messeage: 'Product created successfully',
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            messeage: "Error in creating product"
        })
    }
}

//get product controller
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('catagory').select('-photo').limit(2).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            totalCount: products.length,
            message: 'AllProduct',
            products,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            messeage: 'Error in getting product',
            error: error.messeage
        })
    }
}

//get single product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select('-photo').populate('catagory');
        res.status(200).send({
            succces: true,
            message: 'Product fetched succesfully',
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succces: false,
            error,
            message: "Error getting single product"
        })
    }
}

export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(errpr);
        res.status(500).send({
            success: false,
            message: "Getting error in photo",
            error
        })
    }
}

//delete product controller
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            succces: true,
            message: 'Product deleted succesfully',
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succces: false,
            message: 'Error while deleting product',
            error
        })
    }
}

//update product controller
export const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, catagory, quantity, shipping } = req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" })
            case !slug:
                return res.status(500).send({ error: "Slug is required" })
            case !description:
                return res.status(500).send({ error: "Description is required" })
            case !price:
                return res.status(500).send({ error: "Price is required" })
            case !catagory:
                return res.status(500).send({ error: "Catagory is required" })
            case !quantity:
                return res.status(500).send({ error: "Quantity is required" })
            case !photo && photo.size > 1000000:
                return res.status(500).send({ error: "Photo is required and should be less than 1 mb" })
            case !shipping:
                return res.status(500).send({ error: "Shipping is required" })
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields,slug:slugify(name)},
            {new: true}
            )
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type;
        }
        await products.save()
        res.status(201).send({
            success: true,
            messeage: 'Product updated successfully',
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            messeage: "Error in updating product"
        })
    }
}

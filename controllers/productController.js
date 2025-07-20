import productModel from "../models/productModel.js";
import catagoryModel from "../models/catagoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//payment Gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


export const createProductController = async (req, res) => {
  try {
    const { name, description, price, catagory, quantity, shipping } = req.fields;
    const file = req.files.photo;

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !catagory:
        return res.status(500).send({ error: "Catagory is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case !file:
        return res.status(500).send({ error: "Photo is Required" });
    }

    // Initialize product
    const productData = { name, description, price, catagory, quantity, shipping, slug: slugify(name) };
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'ecom-webapp/products',
        use_filename: true,
        unique_filename: false
      });
      productData.photo = result.secure_url;
    } catch (uploadError) {
      console.error('Cloudinary Upload Error:', uploadError);
      return res.status(500).send({ message: 'Upload failed', error: uploadError.message });
    }

    // Create and save course
    const products = new productModel(productData);
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};


//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("catagory")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting products",
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("catagory");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};


//delete product controller
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.pid);

    // If image exists, delete it
    if (product.photo) {
      const publicId = product.photo.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`ecom-webapp/products/${publicId}`);
    }

    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//Update products
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, catagory, quantity, shipping } = req.fields;
    const file = req.files.photo;
    const productId = req.params.pid;

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !catagory:
        return res.status(500).send({ error: "Catagory is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    // setup product
    const productData = { name, description, price, catagory, quantity, shipping, slug: slugify(name) };

    if (file) {
      // If old image exists, delete it
      if (product.photo) {
        const publicId = product.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`ecom-webapp/products/${publicId}`);
      }
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'ecom-webapp/products'
        });
        //save photo url to database
        productData.photo = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        return res.status(500).send({ message: 'Upload failed', error: uploadError.message });
      }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(productId, { ...productData }, { new: true });

    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating product",
    });
  }
};


//product filter
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.catagory = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args)
    res.status(200).send({
      success: true,
      products
    })

  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Products Filtering Error",
      error
    })
  }
}

//Product Count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount({});
    res.status(200).send({
      success: true,
      total
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in Product Count",
      error
    })
  }
}

// product list based on page
export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel.find({})
      .populate("catagory")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
    res.status(200).send({
      success: true,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Pagination Error",
      error
    })
  }
}

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .populate("catagory");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

//related product
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel.find({
      catagory: cid,
      _id: { $ne: pid },
    })
      .limit(3)
      .populate("catagory")
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Related Product",
      error,
    });
  }
}

//get product by Catagory
export const productCatagoryController = async (req, res) => {
  try {
    const catagory = await catagoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ catagory }).populate("catagory")
    res.status(200).send({
      success: true,
      catagory,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting Product",
      error,
    });
  }
};


//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);

      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};


//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: "nonce-from-the-client",
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });

        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

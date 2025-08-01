import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    slug: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    catagory: {
        type: mongoose.ObjectId,
        ref: 'Catagory',
        require: true,
    },
    quantity: {
        type: Number,
        require: true,
    },
    photo: {
        type: String,
        require: true,
    },
    shipping: {
        type: Boolean,
    }
}, { timestamps: true })
export default mongoose.model('Products', productSchema)
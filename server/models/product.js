import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: Array,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    offerPrice: {
        type: Array,
        required: true,
    },
    image: {
        type: Number,
        required: true,
    },
    category: {
        type: Array,
        required: true,
    },
    cartItems: {
        type: Object,
        default: {},
    },
    inStack: {
        type: Boolean,
        default: true,
    },
}, {timestamps: true});


const Product = mongoose.models.product || mongoose.model('product', productSchema);


export default Product;
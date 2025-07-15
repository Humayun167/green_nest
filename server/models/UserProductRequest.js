import mongoose from "mongoose";

const userProductRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
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
        type: Number,
        required: true,
    },
    image: {
        type: Array,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    rejectionReason: {
        type: String,
        default: '',
    },
    sellerNotes: {
        type: String,
        default: '',
    },
}, {timestamps: true});

const UserProductRequest = mongoose.models.userProductRequest || mongoose.model('UserProductRequest', userProductRequestSchema);

export default UserProductRequest;

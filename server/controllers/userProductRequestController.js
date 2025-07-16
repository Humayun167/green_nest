import {v2 as cloudinary} from 'cloudinary';
import UserProductRequest from '../models/UserProductRequest.js';
import Product from '../models/product.js';

// Submit product request by user: /api/user-product-request/submit
export const submitProductRequest = async (req, res) => {
    try {
        const { userId } = req;
        let productData = JSON.parse(req.body.productData);

        const images = req.files;

        if (!images || images.length === 0) {
            return res.json({success: false, message: "At least one image is required"});
        }

        let imagesUrl = await Promise.all(
            images.map(async(item) => {
                let result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image',
                    folder: 'user_product_requests'
                });
                return result.secure_url;
            })
        );

        await UserProductRequest.create({
            ...productData,
            userId,
            image: imagesUrl
        });

        res.json({success: true, message: "Product request submitted successfully"});

    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
};

// Get user's product requests: /api/user-product-request/user-requests
export const getUserProductRequests = async (req, res) => {
    try {
        const { userId } = req;
        const requests = await UserProductRequest.find({ userId }).sort({ createdAt: -1 });
        res.json({success: true, requests});
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
};

// Get all product requests for seller: /api/user-product-request/all-requests
export const getAllProductRequests = async (req, res) => {
    try {
        const requests = await UserProductRequest.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json({success: true, requests});
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
};

// Approve product request and add to products: /api/user-product-request/approve
export const approveProductRequest = async (req, res) => {
    try {
        const { requestId, sellerNotes } = req.body;

        const request = await UserProductRequest.findById(requestId);
        if (!request) {
            return res.json({success: false, message: "Request not found"});
        }

        // Create the product
        const productData = {
            name: request.name,
            description: request.description,
            price: request.price,
            offerPrice: request.offerPrice,
            image: request.image,
            category: request.category,
            inStock: true,
            originalSubmitterId: request.userId // Track who originally submitted this product
        };

        await Product.create(productData);

        // Update request status
        await UserProductRequest.findByIdAndUpdate(requestId, {
            status: 'approved',
            sellerNotes: sellerNotes || ''
        });

        res.json({success: true, message: "Product request approved and product added successfully"});

    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
};

// Reject product request: /api/user-product-request/reject
export const rejectProductRequest = async (req, res) => {
    try {
        const { requestId, rejectionReason, sellerNotes } = req.body;

        const request = await UserProductRequest.findById(requestId);
        if (!request) {
            return res.json({success: false, message: "Request not found"});
        }

        await UserProductRequest.findByIdAndUpdate(requestId, {
            status: 'rejected',
            rejectionReason: rejectionReason || '',
            sellerNotes: sellerNotes || ''
        });

        res.json({success: true, message: "Product request rejected"});

    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
};

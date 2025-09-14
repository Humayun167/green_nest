
import {v2 as cloudinary} from 'cloudinary';
import Product from '../models/product.js';


// Add product: /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async(item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'})
                return result.secure_url
            })
        )
        await Product.create({...productData,image:imagesUrl})
        res.json({success:true,message:"Product added successfully"})

    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
}

// get prouct : /apii/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({success: true, products});
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
}

// get single product: /api/product/id
export const productById = async (req, res) => {
     try {
        const {id} = req.body
        const product = await Product.findById(id)
        res.json({success: true, product});
     } catch (error) {
         console.log(error.message);
        return res.json({success: false, message: error.message});
     }
}

// change stock: /api/product/stock
export const changeStock = async (req, res) => {
    try {
          const {id, inStock} = req.body
          await Product.findByIdAndUpdate(id, {inStock});
             res.json({success: true, message: "Stock updated successfully"});
    } catch (error) {
         console.log(error.message);
        return res.json({success: false, message: error.message});
    }
}

// search products: /api/product/search
export const searchProducts = async (req, res) => {
    try {
        const { query, category, limit = 10 } = req.query;
        
        let searchCriteria = { inStock: true };
        
        if (query) {
            // Create a case-insensitive search for name and description
            const searchRegex = new RegExp(query, 'i');
            searchCriteria.$or = [
                { name: searchRegex },
                { description: { $elemMatch: { $regex: searchRegex } } },
                { category: searchRegex }
            ];
        }
        
        if (category) {
            searchCriteria.category = new RegExp(category, 'i');
        }
        
        const products = await Product.find(searchCriteria)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
            
        res.json({ success: true, products });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}


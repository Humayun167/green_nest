// place order cod: /api/order/cod

import Order from "../models/Order.js";
import Product from "../models/product.js";
import User from "../models/User.js";

export const placeOrderCOD = async (req, res) => {
    try {
       const { items, address } = req.body;
       const userId = req.userId;
        if(!address ||items.length ===0 ){
            return res.json({ success: false, message: " invalid data" });
        }
        let amount = await items.reduce(async(acc,item)=>{
           const product = await Product.findById(item.productId);
           return (await acc)+ product.offerPrice * item.quantity;
        },0) 
        // AAdd tax charge 
        amount += Math.floor(amount * 0.02); // 18% tax
       
        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        })
        return res.json({ success: true, message: "Order placed successfully" });
 
     } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Get orders by userId: /api/order/user

export const getUserOrders = async (req, res) => {
      try {
         const userId = req.userId;
         const orders = await Order.find({
            userId,
            $or:[{paymentType: "COD"},{isPaid:true}]
         }).populate("items.productId address").sort({createdAt:-1});
         return res.json({ success: true, orders });
      } catch (error) {
           res.json({ success: false, message: error.message });
      }
}

export const getAllOrders = async (req, res) => {
    try {
         const orders = await Order.find({
            $or:[{paymentType: "COD"},{isPaid:true}]
         }).populate("items.productId address").sort({createdAt:-1});
          res.json({ success: true, orders });
      } catch (error) {
           res.json({ success: false, message: error.message });
      }
}

// Get pending orders for products originally submitted by a user: /api/order/user-sales
export const getUserSalesOrders = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Find all orders where items contain products originally submitted by this user
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate({
            path: "items.productId",
            match: { originalSubmitterId: userId },
            select: "name category offerPrice image originalSubmitterId"
        }).populate("address").populate("userId", "name email").sort({ createdAt: -1 });

        // Filter out orders that don't have any products from this user
        const filteredOrders = orders.filter(order => 
            order.items.some(item => item.productId && item.productId.originalSubmitterId && item.productId.originalSubmitterId.toString() === userId)
        );

        return res.json({ success: true, orders: filteredOrders });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Get all orders with user submission info for seller: /api/order/seller-enhanced
export const getSellerOrdersEnhanced = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate({
            path: "items.productId",
            select: "name category offerPrice image originalSubmitterId",
            populate: {
                path: "originalSubmitterId",
                select: "name email"
            }
        }).populate("address").populate("userId", "name email").sort({ createdAt: -1 });

        // Add metadata about user-submitted products
        const enhancedOrders = orders.map(order => ({
            ...order.toObject(),
            hasUserSubmittedProducts: order.items.some(item => 
                item.productId && item.productId.originalSubmitterId
            ),
            userSubmittedItems: order.items.filter(item => 
                item.productId && item.productId.originalSubmitterId
            )
        }));

        res.json({ success: true, orders: enhancedOrders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


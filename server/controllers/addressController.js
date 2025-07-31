


// Add address: /api/address/add

import Address from "../models/Address.js";

export const addAddress = async(req,res)=>{
    try {
        const{address }= req.body;
        const userId = req.userId;
        await Address.create({...address,userId})
        res.json({success:true,message:"Address added successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Get all addresses: /api/address/get

export const getAddress = async(req,res)=>{
    try {
        const userId = req.userId;
        const addresses = await Address.find({userId});
        res.json({success:true,addresses});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Update address: /api/address/update/:id

export const updateAddress = async(req,res)=>{
    try {
        const { id } = req.params;
        const { address } = req.body;
        const userId = req.userId;
        
        // Find the address and check if it belongs to the user
        const existingAddress = await Address.findById(id);
        if (!existingAddress) {
            return res.json({success: false, message: "Address not found"});
        }
        
        if (existingAddress.userId !== userId) {
            return res.json({success: false, message: "Unauthorized to update this address"});
        }
        
        // Update the address
        const updatedAddress = await Address.findByIdAndUpdate(
            id, 
            { ...address, userId }, 
            { new: true }
        );
        
        res.json({
            success: true, 
            message: "Address updated successfully",
            address: updatedAddress
        });
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Delete address: /api/address/delete/:id

export const deleteAddress = async(req,res)=>{
    try {
        const { id } = req.params;
        const userId = req.userId;
        
        // Find the address and check if it belongs to the user
        const address = await Address.findById(id);
        if (!address) {
            return res.json({success: false, message: "Address not found"});
        }
        
        if (address.userId !== userId) {
            return res.json({success: false, message: "Unauthorized to delete this address"});
        }
        
        await Address.findByIdAndDelete(id);
        res.json({success:true, message:"Address deleted successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}
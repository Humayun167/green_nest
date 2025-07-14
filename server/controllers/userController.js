import User from './../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import {v2 as cloudinary} from 'cloudinary';

// Register users : /api/user/register
export const register =async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.json({success: false, message: 'All fields are required'});
        }


        const existingUser = await User.findOne({email})

        if(existingUser) {
            return res.json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10)


        const user =await User.create({
            name, 
            email,
            password: hashedPassword
        });

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn:'7d'} )

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Allow cross-site cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            domain: process.env.NODE_ENV === 'production' ? undefined : undefined // Let browser handle domain       
        };

        res.cookie('token', token, cookieOptions);

        // Also send token in response for localStorage storage as fallback
        return res.json({
            success: true, 
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                profileImage: user.profileImage,
                cartItems: user.cartItems
            },
            token: token
        });

    } catch (error) {
        console.error( error.message);
        return res.json({success: false, message: error.message});
    }
}

// Login users : /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.json({success: false, message: "All fields are required"});
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.json({success: false, message: "Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.json({success: false, message: "Invalid credentials"});
        }

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'7d'} )

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Allow cross-site cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            domain: process.env.NODE_ENV === 'production' ? undefined : undefined // Let browser handle domain       
        };

        res.cookie('token', token, cookieOptions);

        // Also send token in response for localStorage storage as fallback
        return res.json({
            success: true, 
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                profileImage: user.profileImage,
                cartItems: user.cartItems
            },
            token: token
        });

        
    } catch (error) {
        console.error('Login error:', error.message);
        return res.json({success: false, message: error.message});
    }
} 


// Get user details : /api/user/isAuth
export const isAuth = async (req, res) =>{
    try {
        const { userId } = req;
        const user = await User.findById(userId).select("-password");
        return res.json({ success: true, user });
    } catch (error) {
        console.log( error.message);
        res.json({ success: false, message: error.message });
    }
}
// Logout user : /api/user/logout

export const logout = async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Allow cross-site cookies in production
            domain: process.env.NODE_ENV === 'production' ? undefined : undefined // Let browser handle domain
        };

        res.clearCookie('token', cookieOptions);
        return res.json({success: true, message: "User logged out successfully"});
    } catch (error) {
          console.error( error.message);
          return res.json({success: false, message: error.message});
    }
}

// Update user profile : /api/user/update-profile
export const updateProfile = async (req, res) => {
    try {
        const { userId } = req;
        const { name, email, profileImage } = req.body;

        if (!name || !email) {
            return res.json({ success: false, message: 'Name and email are required' });
        }

        // Check if email is already taken by another user
        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.json({ success: false, message: 'Email is already taken by another user' });
        }

        const updateData = { name, email };
        if (profileImage) {
            updateData.profileImage = profileImage;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select("-password");

        return res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            user: updatedUser 
        });

    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// Update user password : /api/user/update-password
export const updatePassword = async (req, res) => {
    try {
        const { userId } = req;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: 'Current password and new password are required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Current password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

        return res.json({ 
            success: true, 
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// Get user order count : /api/user/order-count
export const getUserOrderCount = async (req, res) => {
    try {
        const { userId } = req;
        
        const orderCount = await Order.countDocuments({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        });

        return res.json({ 
            success: true, 
            orderCount 
        });

    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// Upload profile image : /api/user/upload-image
export const uploadProfileImage = async (req, res) => {
    try {
        const { userId } = req;
        
        if (!req.file) {
            return res.json({ success: false, message: 'No image file provided' });
        }

        // Upload to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'image',
            folder: 'user_profiles', // organize images in a folder
            transformation: [
                { width: 400, height: 400, crop: 'fill' }, // resize and crop to square
                { quality: 'auto', fetch_format: 'auto' } // optimize quality and format
            ]
        });

        // Update user profile image
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profileImage: result.secure_url },
            { new: true }
        ).select("-password");

        return res.json({ 
            success: true, 
            message: 'Profile image uploaded successfully',
            user: updatedUser,
            imageUrl: result.secure_url
        });

    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
};
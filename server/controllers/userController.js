
import User from './../models/User.js';
import bcrypt from 'bcryptjs';
import e from 'express';
import jwt from 'jsonwebtoken';
// Register users : /api/user/register

export const register =async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.json({success: false, message: "All fields are required"});
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

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'7d'} )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days       
        });

        return res.json({success: true, user:{email:user.email,name:user.name}});

    } catch (error) {
        console.error( error.message);
        return res.json({success: false, message: error.message});
    }
}

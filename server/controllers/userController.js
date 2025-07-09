import User from './../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

// Login users : /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.json({success: false, message: "All fields are required"});
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.json({success: false, message: "invalid email or pssword"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.json({success: false, message: "Invalid credentials"});
        }

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
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict', // CSRF protection
        });
        return res.json({success: true, message: "User logged out successfully"});
    } catch (error) {
          console.error( error.message);
          return res.json({success: false, message: error.message});
    }
}
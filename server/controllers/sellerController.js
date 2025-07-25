
import jwt  from 'jsonwebtoken';

//Login Sellers : /api/seller/login

export const sellerLogin = async(req,res)=>{
    try {
        const {email, password} = req.body;

    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'});

        // Cookie configuration for cross-origin requests
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Allow cross-site cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            domain: process.env.NODE_ENV === 'production' ? undefined : undefined // Let browser handle domain
        };

        res.cookie('sellerToken', token, cookieOptions);

        console.log('Seller logged in successfully, token set:', !!token);
        console.log('Cookie options:', cookieOptions);

        return res.json({success: true, message: 'Seller logged in successfully'});
    }
    else{
        return res.json({success: false, message: 'Invalid credentials'});
    }
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
}
// seller auth: /api/seller/is-auth

export const isSellerAuth = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// seller logout: /api/seller/logout

export const sellerLogout = async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Allow cross-site cookies in production
            domain: process.env.NODE_ENV === 'production' ? undefined : undefined // Let browser handle domain
        };

        res.clearCookie('sellerToken', cookieOptions);
        return res.json({success: true, message: "User logged out successfully"});
    } catch (error) {
          console.error( error.message);
          return res.json({success: false, message: error.message});
    }
}
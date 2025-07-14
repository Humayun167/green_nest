

import jwt from "jsonwebtoken";

const authUser = async(req,res,next)=>{
   // Try to get token from cookies first
   let token = req.cookies?.token;
   
   // If no token in cookies, try Authorization header as fallback
   if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
       token = req.headers.authorization.split(' ')[1];
   }
   
    if (!token) {
         return res.json({ success: false, message: 'No token, authorization denied' });
    } 
         
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.userId= tokenDecode.id;
        }else{
            return res.json({ success: false, message: 'Invalid token structure' });
        }
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        res.json({ success: false, message: 'Token verification failed' });
    } 
};

export default authUser;


import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import postRouter from './routes/postRoute.js';
import userProductRequestRouter from './routes/userProductRequestRoute.js';



const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// Allow multiple origin
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8081', // React Native/Expo default port
    'http://localhost:8082', // React Native/Expo alternative port
    'http://localhost:8083', // React Native/Expo additional port
    'http://10.0.2.2:8081',  // Android emulator
    'http://10.0.2.2:8082',  // Android emulator alternative port
    'http://10.0.2.2:8083',  // Android emulator additional port
    'http://192.168.1.100:8081', // Replace with your local IP for physical devices
    'http://192.168.1.100:8082', // Replace with your local IP for physical devices alternative port
    'http://192.168.1.100:8083', // Replace with your local IP for physical devices additional port
    'https://green-nest-frontend.vercel.app',
    process.env.FRONTEND_URL // Add environment variable for dynamic frontend URL
].filter(Boolean); // Filter out undefined values


// Middleware configaration
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // Also allow any vercel deployment URLs
        if (origin.includes('.vercel.app')) {
            return callback(null, true);
        }
        
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));


app.get('/',(req,res)=> res.send("Api is working"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter); 
app.use('/api/cart', cartRouter); 
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/post', postRouter);
app.use('/api/user-product-request', userProductRequestRouter);


app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
}) 
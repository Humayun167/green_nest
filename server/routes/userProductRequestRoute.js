import express from 'express';
import { upload } from '../configs/multer.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';
import { 
    submitProductRequest, 
    getUserProductRequests, 
    getAllProductRequests, 
    approveProductRequest, 
    rejectProductRequest 
} from '../controllers/userProductRequestController.js';

const userProductRequestRouter = express.Router();

// User routes
userProductRequestRouter.post('/submit', authUser, upload.array('images'), submitProductRequest);
userProductRequestRouter.get('/user-requests', authUser, getUserProductRequests);

// Seller routes
userProductRequestRouter.get('/all-requests', authSeller, getAllProductRequests);
userProductRequestRouter.post('/approve', authSeller, approveProductRequest);
userProductRequestRouter.post('/reject', authSeller, rejectProductRequest);

export default userProductRequestRouter;

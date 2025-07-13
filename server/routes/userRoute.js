import express from 'express';
import { isAuth, login, logout, register, updateProfile, updatePassword, getUserOrderCount, uploadProfileImage } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import { upload } from '../configs/multer.js';

const userRouter = express.Router();

userRouter.post('/register', register )
userRouter.post('/login', login )
userRouter.get('/is-auth',authUser,isAuth )
userRouter.get('/logout', authUser, logout )
userRouter.put('/update-profile', authUser, updateProfile )
userRouter.put('/update-password', authUser, updatePassword )
userRouter.get('/order-count', authUser, getUserOrderCount )
userRouter.post('/upload-image', authUser, upload.single('image'), uploadProfileImage )

export default userRouter; 
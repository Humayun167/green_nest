import express from 'express';
import { register } from '../controllers/userController.js';
import e from 'express';

const userRouter = express.Router();

userRouter.post('/register', register )

export default userRouter;
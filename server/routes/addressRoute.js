import express from "express";
import { addAddress, getAddress, updateAddress, deleteAddress } from "../controllers/addressController.js";
import authUser from "../middlewares/authUser.js";



const addressRouter = express.Router();

addressRouter.post('/add', authUser, addAddress);
addressRouter.get('/get', authUser, getAddress);
addressRouter.put('/update/:id', authUser, updateAddress);
addressRouter.delete('/delete/:id', authUser, deleteAddress);

export default addressRouter;
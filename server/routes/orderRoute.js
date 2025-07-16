import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, getUserSalesOrders, getSellerOrdersEnhanced, placeOrderCOD } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';


const orderRouter = express.Router();


orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/user-sales', authUser, getUserSalesOrders)
orderRouter.get('/seller', authSeller, getAllOrders)
orderRouter.get('/seller-enhanced', authSeller, getSellerOrdersEnhanced)

export default orderRouter;
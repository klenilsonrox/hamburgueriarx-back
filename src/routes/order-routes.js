// routers/orderRoutes.js
import { Router } from "express";
import adminMiddleware from "../middlewares/verifyUserAdmin.js";
import authMiddleware from "../middlewares/authenticateUser.js";
import { 
    createOrderController, 
    deleteOrderController, 
    getAllordersController, 
    getOrderByIdController, 
    getOrdersByUserIdController, 
    updateStatusOrderController, 
} from "../controllers/order-controller.js";


const RouterOrders = Router();



RouterOrders.post("/orders", authMiddleware, createOrderController);
RouterOrders.get("/orders/:id", authMiddleware, getOrderByIdController);
RouterOrders.get("/orders", authMiddleware, adminMiddleware, getAllordersController);
RouterOrders.get("/myorders", authMiddleware, getOrdersByUserIdController);
RouterOrders.delete("/orders/:id", authMiddleware, adminMiddleware, deleteOrderController);
RouterOrders.put("/orders/:id/status", authMiddleware, adminMiddleware, updateStatusOrderController);

export default RouterOrders;

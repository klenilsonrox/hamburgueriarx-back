import { Router } from "express";
import { createProductController, deleteProductController, getAllProductsController, getProductByIdControllwer, getProductBySlugController, getProductByTitleController, updateProductController,updateProductStatusController } from "../controllers/product-controller.js";
import adminMiddleware from "../middlewares/verifyUserAdmin.js";
import authMiddleware from "../middlewares/authenticateUser.js";
import { upload } from "../utils/multer.js";

const RouterProducts = Router();

RouterProducts.post("/products", authMiddleware, adminMiddleware, upload.single("imageUrl"), createProductController)
RouterProducts.get("/products", getAllProductsController)
RouterProducts.get('/products/busca', getProductByTitleController)

RouterProducts.get("/products/:id", getProductByIdControllwer)
RouterProducts.get("/products/slug/:slug", getProductBySlugController)
RouterProducts.put("/products/:id", authMiddleware, adminMiddleware,upload.single("imageUrl"), updateProductController)
RouterProducts.put("/products/:id/status", authMiddleware, adminMiddleware, updateProductStatusController)
RouterProducts.delete("/products/:id", authMiddleware, adminMiddleware, deleteProductController)

export default RouterProducts
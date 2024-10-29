import { Router } from "express";
import { createCategoryController, deleteCategoryController, getAllCategoryController, getCategoryByNameController, getCategoryBySlugController, updateCAtegoryController } from "../controllers/category-controller.js";
import authMiddleware from "../middlewares/authenticateUser.js";
import adminMiddleware from "../middlewares/verifyUserAdmin.js";
import { upload } from "../utils/multer.js";


const RouterCategory= Router()

RouterCategory.get("/categories", getAllCategoryController) 
RouterCategory.get("/categories/:name", getCategoryByNameController) 
RouterCategory.get("/categories/slug/:slug", getCategoryBySlugController) 
RouterCategory.post("/categories", authMiddleware,adminMiddleware, upload.single("imageUrl"), createCategoryController) 
RouterCategory.put("/categories/:id", authMiddleware,adminMiddleware, upload.single("imageUrl"), updateCAtegoryController) 
RouterCategory.delete("/categories/:id", authMiddleware,adminMiddleware, deleteCategoryController)


export default RouterCategory
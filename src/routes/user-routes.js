import { Router } from "express";
import {
  registerUserController,
  getAllUsersController,
  deleteUserController,
  updateUserController,
  getUserByIdController,
  getUserInfosController,
  loginUserController,
  requestPasswordReset,
  resetPasswordController
} from "../controllers/user-controllers.js";
import { verifyUserExist } from "../middlewares/verifyUserExist.js";
import authMiddleware from "../middlewares/authenticateUser.js";
import adminMiddleware from "../middlewares/verifyUserAdmin.js";

const RouterUsers = Router();


RouterUsers.post("/forgot-password", requestPasswordReset);
RouterUsers.post("/reset-password", resetPasswordController);


RouterUsers.post("/login", loginUserController);
RouterUsers.post("/register", registerUserController);


RouterUsers.get("/users", authMiddleware, adminMiddleware, getAllUsersController);
RouterUsers.get("/users/infos", authMiddleware, getUserInfosController);
RouterUsers.get("/users/:id", authMiddleware, adminMiddleware, verifyUserExist, getUserByIdController);
RouterUsers.delete("/users/:id", authMiddleware, adminMiddleware, verifyUserExist, deleteUserController);
RouterUsers.put("/users", authMiddleware, updateUserController);

export default RouterUsers;

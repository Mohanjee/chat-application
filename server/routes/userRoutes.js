import express from "express";
import { login, signUp, updateProfile } from "../controllers/userController.js";
import { checkAuth, protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup",signUp); // api endpoint to signup the user using post 
userRouter.post("/login",login); // api endpoint to login the user using post  
userRouter.put("/update-profile",protectRoute,updateProfile); // api endpoint to update the user using put in this we need to protect the route using middle ware 

userRouter.get('/check',protectRoute,checkAuth) // api endpoint to check user is authenticated or not 

export default userRouter;















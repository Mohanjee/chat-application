// Middle ware to protect routes 

import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protectRoute = async (req,res,next) =>{
    try {
        const token = req.headers.token; // we will send request for token from frontend 
        // to get user id we need to decode the token 

        const decoded = jwt.verify(token,process.env.JWT_SECRET); // decode the token and verify with the one in database

        const user = await User.findById(decoded.userId).select("-password") // finding user without password by removing password from the 
        if(!user) return res.json({success : false ,message : "User not found"}); // if user not found in the db 

        req.user = user; // if user presents and then send req as user to controller function  

        next();
    } catch (error) {
        console.log(error.message);
        
        res.json({success:false,message:error.message});
    }
}
// Controller to check if user is authenticated 

export const checkAuth = (req,res) => {
    res.json({success : true , user : req.user});
}
// SignUp a new user

import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";   
import bcrypt from "bcryptjs";


export const signUp = async (req,res) =>{
    const {fullName , email , password , bio } = req.body;

    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success:false,message : "Missing Details"});
        }
        const user = await User.findOne({email});
        if(user){
            return res.json({success:false, message:"Account Already Exists"});
        }

        // password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // Creating new user
        const newUser = await User.create({
            fullName , email , password:hashedPassword , bio
        })

        // Authenticating user 
        const token = generateToken(newUser._id);
        res.json({success:true , userData : newUser , token , message :'Account Created Successfully'})
    } catch (error) {
        console.log(error);
        res.json({success:false,message : error.message});
    }
}


// Controller to login a user 

export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        const userData = await User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password,userData.password);
        if(!isPasswordCorrect){
            return res.json({success : false,message : "Invalid Credentials" })
        }

        const token = generateToken(userData._id);

        res.json({success:true,userData,token,message: "Login Successful"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message : error.message});
    }
}

// Controller to Update use profile details

export const updateProfile = async (req,res) => {
    try {
        const {profilePic,bio,fullName} = req.body;

        const userId = req.user._id ;

        let updatedUser ; 

        if(!profilePic){
           updatedUser = await User.findByIdAndUpdate(userId , {bio,fullName} , {new:true} )
        }else{
            // const upload = await cloudinary.uploader.upload()
            const upload = await cloudinary.uploader.upload(profilePic, {
            folder: "profile_pics",
        });

            updatedUser = await User.findByIdAndUpdate(userId, {profilePic : upload.secure_url,bio,fullName},{new : true})
        }
        res.json({success:true,user : updatedUser})
    } catch (error) {
        console.log(error.message);
        res.json({success:false , message : error.message});
    }
}




 
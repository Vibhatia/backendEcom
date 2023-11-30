const express = require('express');
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
//Register a new user
let token = null;
router.post("/register",async (req,res)=>{
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString(),
    });
    try{
        const savedUser=await newUser.save();
        res.status(200).json(savedUser);

    } catch(err){
        res.status(400).json(err);
        
    }

})
router.post("/login",async (req,res)=>{
    try{
        const checkUser = await User.findOne({username:req.body.username});
        !checkUser && res.status(400).json("Wrong Credentials");
        const hashedPassword = CryptoJS.AES.decrypt(checkUser.password,process.env.SECRET);
        const oPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        oPassword!==req.body.password && res.status(400).json("Wrong Credentials");
        token = jwt.sign({
            id:checkUser._id,
            isAdmin:checkUser?.isAdmin
        },
        process.env.JWT_KEY,
        {expiresIn:"2d"}
        )
        console.log(token);
        const {password,...otherInfo} = checkUser._doc;
        res.status(200).json({...otherInfo,token});
    }catch(err){
        res.status(500).json(err);

    }

})
router.get("/logout",(req,res)=>{
    try{
        token = null;
        
    }catch(err){

    }
    res.status(200).json("hello");

})


module.exports = router;

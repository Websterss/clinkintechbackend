const express = require("express");
const loginRouter = express.Router();
const login = require("../models/login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


loginRouter.post("/signup", async(req, res) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password){
       return res.status(409).json({ message: "Please Enter All Field" })
    };

    let existing;
    try {
        existing = await login.findOne({email});
    } catch (error) {
        return res.status(409).json({ message: "Please Check internet" })
    }

    if(existing){
        return res.status(409).json({ message: "Please Login" })
    };
    
    let users;
    try {

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
       
        const hassedPassword = await bcrypt.hash(password, salt)

        users = new login({
            username, email, password: hassedPassword
        });
        await users.save();
    } catch (error) {
        return res.status(409).json({ message: "Please Check Post Error" })
    }

    return res.status(201).json({ users });

});


loginRouter.post("/signin", async(req, res) => {
    const { email , password } = req.body;

    let existing;
    try {
        existing = await login.findOne({email});
    } catch (error) {
        return res.status(409).json({ message: "Please Check internet" })
    }

    if(!existing){
        return res.status(409).json({ message: "Please Register" })
    };

    let comparePassword = await bcrypt.compareSync(password, existing.password);

    if(!comparePassword){
        return res.status(409).json({ message: "Incorrect Password, Please Check Password" })
    }

    const token = jwt.sign({_id: this._id}, process.env.JWTKEY,{
        expiresIn: "1h"
    });

    return res.status(201).json({ existing, data: token, message: "Login Successfully" });
});


module.exports = loginRouter;



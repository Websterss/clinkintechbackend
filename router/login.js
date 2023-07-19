const express = require("express");
const loginRouter = express.Router();
const login = require("../models/login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("./Nodemailer");
const crypto = require("crypto");
const Token = require("../models/token");

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



loginRouter.get("/user/get/:id", async(req, res) => {
    const id = req.params.id;

    let user;
    try {
        user = await login.findById(id);
    } catch (error) {
        return res.status(409).json({ message:"Network Error" })
    }
    return res.status(200).json({user})
});

loginRouter.post("/forgot-password/post", async(req, res) => {
    try {
        let User = await login.findOne({ email: req.body.email });
		if (!User)
			return res
				.status(409)
				.send({ message: "User with given email does not exist!" });

		let token = await Token.findOne({ userId: User._id });
		if (!token) {
			token = await new Token({
				userId: User._id,
				token: crypto.randomBytes(32).toString("hex"),
			}).save();
		}

		const url = `${process.env.BASE_URL}password-reset/${User._id}/${token.token}/`;
		await sendEmail(User.email, "Password Reset", url);

		
		res
			.status(201)
			.send({ message: "Password reset link sent to your email account" });

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});


loginRouter.get("/forgot-password/:id/:token", async(req, res) => {
    try {
		const User = await login.findOne({ _id: req.params.id });
		if (!User) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: User._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		res.status(200).send("Valid Url");
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


loginRouter.post("/forgot-password/:id/:token", async(req, res) => {
    try {
    

        const User = await login.findById(req.params.id);
        if (!User) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: User._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

        User.password = hashPassword;
        await User.save();
        await token.delete();

        res.send("password reset sucessfully.");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
})


module.exports = loginRouter;



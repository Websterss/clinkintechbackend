const mongoose = require("mongoose");


const loginSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});


const login = new mongoose.model("Login", loginSchema);

module.exports = login;


const mongoose = require("mongoose");


const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    postId:{
        type:  String,
        required: true
    },
    Date:{
        type: String,
        required: true
    }
});


const blog = new mongoose.model("Blog", blogSchema);

module.exports = blog;
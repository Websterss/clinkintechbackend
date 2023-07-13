const express = require("express");
const blogrouter = express.Router();
const blogs = require("../models/blog");
const cloudinary = require("../utils/cloudinary");


blogrouter.post("/api/post", async(req, res) => {

    const { title, image, description, postId } = req.body;


    // image Upload cloudinary
    const result = await cloudinary.uploader.upload(image,{
        folder:"blog"
      });


    let blog =  new blogs({
        title, image, description, postId, Date: Date.now()
    })

    try {

        await blog.save();

    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Check Internet Error"});
    }

    

    return res.status(200).json({blog, message:"Blog Post Successfully"})

});


blogrouter.get("/api/get", async(req, res) => {
    let blog;
    try {
        blog = await blogs.find();
    } catch (error) {
        return res.status(500).json({message:"Check Internet Error"});
    }

    return res.status(200).json({blog});
});

blogrouter.get("/api/get/:id", async(req, res) => {
    let id = req.params.id;

    let blog;
    try {
        blog = await blogs.findById(id);
    } catch (error) {
        return res.status(500).json({message:"Check Internet Error"});
    };

    return res.status(200).json({blog});
});

blogrouter.patch("/api/update/:id", async(req, res) => {
   
   let { title,  description } = req.body;

    let id = req.params.id;

   
    let blog;

    try {
        blog = await blogs.findByIdAndUpdate(id, {
            title, description, Date: Date.now()
        })
    } catch (error) {
        return res.status(500).json({message:"Check Internet Error"});
    }

    return res.status(200).json({blog, message:"Blog Updated Successfully"});

});


blogrouter.delete("/api/delete/:id", async(req, res) => {
   let id = req.params.id;

   let blog;

   try {
    blog = await blogs.findByIdAndRemove(id)
   } catch (error) {
    return res.status(500).json({message:"Check Internet Error"});
   }
   return res.status(200).json({blog, message:"Blog Deleted Successfully"});
})

module.exports = blogrouter;

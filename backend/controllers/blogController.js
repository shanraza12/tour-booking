import Blog from "../models/Blog.js"
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "didjdktx9",
  api_key: "614217476572916",
  api_secret: "PN5ECfLa2VL3_pAO_ZgYau8UqD0",
});

export const createBlog = async (req, res) => {
    try {
      console.log(req.body);
      const newBlog = await Blog.create(req.body);
      console.log(newBlog); 
      const savedBlog = await newBlog.save();
      console.log(savedBlog);
      res.status(201).json(newBlog);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Failed to create the blog' });
    }
  };
  

// controllers/blog.controller.js
export const updateBlog = async (req, res) => {
  const { id } = req.body; // Get ID from URL, not body
  const { title, content, author, date, photo, featured } = req.body;

  // Validate ID
  if (!id) {
    return res.status(400).json({ message: "Blog ID is required" });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        author,
        date,
        photo,        // can be new URL, existing URL, or "" if removed
        featured,
      },
      { 
        new: true,
        runValidators: true, 
      }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Failed to update blog" });
  }
};


export const deleteBlog = async (req, res) => {
  const { id } = req.params; // ALWAYS use params for ID on DELETE, not body

  if (!id) {
    return res.status(400).json({ message: "Blog ID is required" });
  }

  try {
    // First check if it exists
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete it
    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      message: "Blog deleted successfully",
      data: null, // or you could return the deleted blog if you want
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the blog' });
  }
};


export const getAllBlogs = async ( req,res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({message:"success",data:blogs});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getFeaturedBlogs = async (req, res) => {
  try {
    const featuredBlogs = await Blog.find({ featured: true });
    if (featuredBlogs.length > 0) {
      res.status(200).json({
        success: true,
        message: "Featured blogs retrieved successfully",
        data: featuredBlogs,
      });
    } else {
      res.status(404).json({ success: false, message: "No featured blogs found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get featured blogs" });
  }
};
  


export const uploadBlogPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "blog-posts" }, // organized folder
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(200).json({
      message: "Photo uploaded successfully",
      url: result.secure_url, // this exact key is used in frontend
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload photo" });
  }
};
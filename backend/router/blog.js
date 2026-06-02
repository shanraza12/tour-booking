import express from 'express';
import upload from "../middleware/multer.js";
import {
  createBlog,
  updateBlog,
  getSingleBlog,
  getAllBlogs,
  uploadBlogPhoto,
  deleteBlog,
  getFeaturedBlogs} from '../controllers/blogController.js';

const blogRoute = express.Router();

blogRoute.get('/featured', getFeaturedBlogs);

blogRoute.get('/:id', getSingleBlog);

blogRoute.post('/getAll', getAllBlogs);
blogRoute.get('/', getAllBlogs);

blogRoute.post('/create', createBlog);

blogRoute.post('/update', updateBlog);
blogRoute.delete('/delete/:id', deleteBlog);

blogRoute.post("/blog-photo", upload.single("photo"), uploadBlogPhoto);
export default blogRoute;

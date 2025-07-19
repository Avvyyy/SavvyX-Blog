import express from 'express'
import {isAdmin, isLoggedIn} from '../middlewares/auth.middleware.js'
import { getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost } from '../controllers/blog.controller.js';
const blogRoutes = express.Router()

blogRoutes.get('/', getBlogPosts);
blogRoutes.get('/:title', getBlogPost);
blogRoutes.post('/', isLoggedIn, isAdmin, createBlogPost);
blogRoutes.patch('/:id', isLoggedIn, isAdmin, updateBlogPost);
blogRoutes.get('/:id', isLoggedIn, isAdmin, deleteBlogPost);

export default blogRoutes;
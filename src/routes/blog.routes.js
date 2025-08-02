import express from 'express'
import {isAdmin, isLoggedIn} from '../middlewares/auth.middleware.js'
import { getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost, getCreateBlogPostPage, getUpdateBlogPost } from '../controllers/blog.controller.js';
const blogRoutes = express.Router()

blogRoutes.get('/', getBlogPosts);
blogRoutes.get('/post/:id',getBlogPost);
blogRoutes.get('/admin/', isLoggedIn, isAdmin, getBlogPosts);
blogRoutes.get('/admin/post/:id', isLoggedIn, isAdmin, getBlogPost);
blogRoutes.get('/admin/create/', isLoggedIn, isAdmin, getCreateBlogPostPage);
blogRoutes.post('/admin/create/', isLoggedIn, isAdmin, createBlogPost);
blogRoutes.get('/admin/edit/:id', isLoggedIn, isAdmin, getUpdateBlogPost);
blogRoutes.patch('/admin/edit/:id', isLoggedIn, isAdmin, updateBlogPost);
blogRoutes.delete('/admin/delete/:id', isLoggedIn, isAdmin, deleteBlogPost);

export default blogRoutes;
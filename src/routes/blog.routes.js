import express from 'express'
import {isAdmin, isLoggedIn} from '../middlewares/auth.middleware.js'
import {validateSchema} from '../middlewares/validations.middleware.js';
import { getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost, getCreateBlogPostPage, getUpdateBlogPost } from '../controllers/blog.controller.js';
import { createPostValidation, upatePostValidation } from '../validations/postValidations.js';
const blogRoutes = express.Router()

// Public blog pages (EJS or JSON depending on Accept header)
blogRoutes.get('/', getBlogPosts);  
blogRoutes.get('/post/:id', getBlogPost);

// Admin API
blogRoutes.get('/api/admin/', isLoggedIn, isAdmin, getBlogPosts);
blogRoutes.get('/api/admin/post/:id', isLoggedIn, isAdmin, getBlogPost);
blogRoutes.get('/api/admin/create/', isLoggedIn, isAdmin, getCreateBlogPostPage);
blogRoutes.post('/api/admin/create/', isLoggedIn, isAdmin, validateSchema(createPostValidation), createBlogPost);
blogRoutes.get('/api/admin/edit/:id', isLoggedIn, isAdmin, getUpdateBlogPost);
blogRoutes.patch('/api/admin/edit/:id', isLoggedIn, isAdmin, validateSchema(upatePostValidation), updateBlogPost);
blogRoutes.delete('/api/admin/delete/:id', isLoggedIn, isAdmin, deleteBlogPost);

export default blogRoutes;
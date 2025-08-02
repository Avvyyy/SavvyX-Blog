import express from 'express'
import { forgotPassword, generateAdminToken, getForgotPasswordPage, getLoginPage, getSignupPage, login, resetPassword, signgUp, logout } from '../controllers/auth.controller.js';
import { isAdmin, isLoggedIn } from '../middlewares/auth.middleware.js';
const authRoutes = express.Router()

authRoutes.get('/login', getLoginPage);
authRoutes.post('/login', login);
authRoutes.get('/get-started', getSignupPage);
authRoutes.post('/get-started', signgUp);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.get('/forgot-password', getForgotPasswordPage);
authRoutes.post('/reset-password', resetPassword);
authRoutes.get('/logout', logout);
authRoutes.get('/adminToken', isLoggedIn, isAdmin, generateAdminToken);

export default authRoutes;

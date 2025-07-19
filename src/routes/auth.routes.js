import express from 'express'
import { forgotPassword, getForgotPasswordPage, getLoginPage, getSignupPage, login, resetPassword, signgUp } from '../controllers/auth.controller.js';
const authRoutes = express.Router()

authRoutes.get('/login', getLoginPage);
authRoutes.post('/login', login);
authRoutes.get('/get-started', getSignupPage);
authRoutes.post('/get-started', signgUp);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.get('/forgot-password', getForgotPasswordPage);
authRoutes.post('/reset-password', resetPassword);
export default authRoutes;

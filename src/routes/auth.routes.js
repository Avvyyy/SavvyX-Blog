import express from 'express'
import { forgotPassword, login, signgUp } from '../controllers/auth.controller.js';
const authRoutes = express.Router()

// user login
authRoutes.post('/login', login);

// user signup
authRoutes.post('/get-started', signgUp);

// forgot password implementation
authRoutes.post('/password-reset', forgotPassword);
export default authRoutes;      
    import express from 'express'
    import { forgotPassword, generateAdminToken, login, resetPassword, signgUp } from '../controllers/auth.controller.js';
    import { isAdmin, isLoggedIn } from '../middlewares/auth.middleware.js';
    import {validateSchema} from '../middlewares/validations.middleware.js';
    import { getStartedValidation, loginValidation } from '../validations/authValidations.js';
    const authRoutes = express.Router()

    authRoutes.post('/login',validateSchema(loginValidation), login);
    authRoutes.post('/get-started', validateSchema(getStartedValidation), signgUp);
    authRoutes.post('/forgot-password', forgotPassword);
    authRoutes.post('/reset-password', resetPassword);
    // authRoutes.get('/logout', logout);
    authRoutes.get('/adminToken', isLoggedIn, isAdmin, generateAdminToken);

    export default authRoutes;

import { config } from 'dotenv';
config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import expressEjsLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import authRoutes from './src/routes/auth.routes.js';
import blogRoutes from './src/routes/blog.routes.js';
import { dbConnect } from './src/config/db.config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(expressEjsLayouts);
app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);

const PORT = process.env.PORT || 3000;
dbConnect();
app.listen(PORT,  () => {
    console.log(`Server started on port ${PORT}`)
})
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from "cookie-parser";
import expressEjsLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import authRoutes from './src/routes/auth.routes.js';
import blogRoutes from './src/routes/blog.routes.js';
import { dbConnect } from './src/config/db.config.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: true}));
app.use(expressEjsLayouts);
app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

const PORT = process.env.PORT || 3000;
dbConnect();
app.listen(PORT,  () => {
    console.log(`Server started on port ${PORT}`)
})
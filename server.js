import { config } from 'dotenv';
config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import authRoutes from './src/routes/auth.routes.js';
import blogRoutes from './src/routes/blog.routes.js';
import { dbConnect } from './src/config/db.config.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.send("this is the test route to make sure server is working")
})


dbConnect();
app.listen(PORT,  () => {
    console.log(`Server started on port ${PORT}`)
})
import express from "express";
import {getAdminBlogPosts} from "../controllers/blog.controller.js";
const pages = express.Router();


// ADMIN BLOG PAGES
pages.get("/admin/blog", getAdminBlogPosts);

pages.get("/admin/blog/create",(req, res) => {
    res.render("admin/createPost");
});

pages.get("/admin/blog/edit/:id",  (req, res) => {
    res.render("admin/editPost", { postId: req.params.id });
});

// AUTH PAGES
pages.get("/login", (req, res) => {
    res.render("auth/login");
});

pages.get("/get-started", (req, res) => {
    res.render("auth/signup");
});

pages.get("/forgot-password", (req, res) => {
    res.render("auth/forgotPassword", { token: null, error: null });
});

pages.get("/reset-password", (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.redirect("/forgot-password");
    }
    res.render("auth/forgotPassword", { token, error: null });
});

export default pages;

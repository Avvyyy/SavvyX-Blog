import express from "express";
const pages = express.Router();

// BLOG PAGES
pages.get('/blog', async (req, res) => {
    const searchTerm = req.query.searchTerm || '';
    const posts = await Blog.find(
        searchTerm ? { title: { $regex: searchTerm, $options: 'i' } } : {}
    ).lean();
    res.render('allPosts', { title: 'All Blog Posts', posts });
});

pages.get('/blog/post/:id', async (req, res) => {
    const blogPost = await Blog.findById(req.params.id).lean();
    if (!blogPost) return res.status(404).send('Post not found');
    res.render('singlePost', { title: blogPost.title, blogPost });
});


// ADMIN BLOG PAGES
pages.get("/admin/blog", (req, res) => {
    res.render("admin/blogList");
});

pages.get("/admin/blog/create", (req, res) => {
    res.render("admin/createBlog");
});

pages.get("/admin/blog/edit/:id", (req, res) => {
    res.render("admin/editBlog", { postId: req.params.id });
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

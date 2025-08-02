import { BlogPosts } from "../models/blogPost.model.js"

export const getBlogPosts = async (req, res) => {
    const { searchTerm } = req.query;
    const user = req.cookies.user || null;
    const viewPath = user?.role === 'admin'
        ? 'admin/postManagement'
        : 'user/allPosts';

    try {
        let blogPosts = [];
        if (searchTerm) {
            // blogPosts = await BlogPosts.find({ $text: { $search: title, $option: "i" } }); 
            blogPosts = await BlogPosts.find({ title: { $regex: searchTerm, $options: 'i' } })
        } else {
            blogPosts = await BlogPosts.find();
        }

        if (blogPosts.length === 0) {
            return res.render(viewPath, { user: user?.username || null, blogPosts: [], error: searchTerm ? `No post found with title: ${searchTerm}` : "There are no blog posts now" });
        }

        return res.render(viewPath, { blogPosts, searchTerm, user: user?.username || null });
    } catch (error) {
        return res.render(viewPath, { user: user?.username || null, blogPosts: [], error: "Could not retrieve blogposts" });
    }
}

export const getBlogPost = async (req, res) => {
    const user = req.cookies.user;
    const viewPath = user.role === 'admin'
        ? 'admin/'
        : 'user/';

    try {
        const { id } = req.params;
        const blogPost = await BlogPosts.findById(id);
        if (!blogPost) return res.redirect('/blog?message=Not found');


        res.render(`${viewPath}singlePost`, { blogPost, user: user?.username || null });

    } catch (error) {
        res.redirect(`/blog/${viewPath}?message=An error occurred`);
    }
}

export const getCreateBlogPostPage = async (req, res) => {
    try {
        return res.render("admin/createPost")
    } catch (error) {
        return res.redirect('/blog/admin?message=Page not found');
    }
}

export const createBlogPost = async (req, res) => {
    try {
        const payload = req.body;
        const blogPost = await BlogPosts.create(payload);
        if (blogPost)    return res.status(200).json({
            statusCode: 201,
            data: blogPost,
            message: 'Blogpost created successfully'
        });
    } catch (error) {
        return res.status(400).json({
            statusCode: 400,
            error: error.message,
            message: 'An error occurred while creating blogpost'
        });
    }
}

export const getUpdateBlogPost = async (req, res) => {
    const referrerUrl = req.headers.referer || '/blog/admin';
    try {
        const { id } = req.params;
        const blogPost = await BlogPosts.findById(id);

        if (!blogPost) return res.redirect(`${referrerUrl}?message=Page not found`);

        res.render('admin/editPost', { blogPost });

    } catch (error) {
        return res.redirect(`${referrerUrl}?message=An error occurred`);
    }
}

export const updateBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const blogPost = await BlogPosts.findByIdAndUpdate(id, payload, { new: true });

        if (!blogPost) {
            return res.status(404).json({ statusCode: 404, error: 'Blogpost not found for update', message: 'Could not update blogpost' });
        }

        return res.status(200).json({
            statusCode: 200,
            data: blogPost,
            message: 'Blogpost updated successfully'
        });
    } catch (error) {
        return res.status(400).json({
            statusCode: 400,
            error: error.message,
            message: 'An error occurred while updating the blogpost'
        });

    }
}

export const deleteBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const isDeleted = await BlogPosts.findByIdAndDelete(id);
        if (!isDeleted) {
           return res.status(400).json({
            statusCode: 404,
            error: "An error occcurred",
            message: "Delete failed. try again later"
           })
        }

       return res.status(200).json({
            statusCode: 200,
            message: "Blogpost deleted sucessfully",
           data: null
           })
    } catch (error) {
           return res.status(400).json({
            statusCode: 400,
            error: "An error occcurred",
            message: "Could not delete blogpost. Try again later"
           })
    }
}
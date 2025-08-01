import { BlogPosts } from "../models/blogPost.model.js"

export const getBlogPosts = async (req, res) => {
    const { title } = req.query;
    const user = req.cookies.user;
    
    try {
        let blogPosts = [];
        if (title) {
            // blogPosts = await BlogPosts.find({ $text: { $search: title, $option: "i" } }); 
            blogPosts = await BlogPosts.find({ title: { $regex: title, $options: 'i' } })
        } else {
            blogPosts = await BlogPosts.find();
        }

        const viewPath = req.user?.role === 'admin'
            ? 'admin/postManagement'
            : 'user/allPosts';

        if (blogPosts.length === 0) {
            return res.render(viewPath, { blogPosts: [], message: title ? `No post found with title: ${title}` : "There are no blog posts now" });
        }

        return res.render(viewPath, { blogPosts, title, user: user?.username || null });
    } catch (error) {
        return res.redirect('/?messsage=Could not retrieve blog posts');
    }
}

export const getBlogPost = async (req, res) => {
    const user = req.cookies.user;

    try {
        const { id } = req.params;
        const blogPost = await BlogPosts.findById(id);
        if (!blogPost) return res.redirect('/blog?message=Not found');

        const isAdminPath = req.cookies?.role === "admin";
        const viewPath = isAdminPath
            ? 'admin/singlePost'
            : 'user/singlePost';

        res.render(viewPath, { blogPost, user: user?.username || null });

    } catch (error) {
        res.redirect('/blog?message=An error occurred');
    }
}


export const getCreateBlogPostPage = async (req, res) => {
    try {
        return res.render("admin/createPost")
    } catch (error) {
        return res.redirect('/blog/message=Page not found');
    }
}

export const createBlogPost = async (req, res) => {
    try {
        const payload = req.body;
        const blogPost = await BlogPosts.create(payload);
        if (blogPost) return res.redirect('/blog/admin?message=New blogpost created successfully')
    } catch (error) {
        return res.redirect('/blog/admin?message=An error occurred')
    }
}

export const getUpdateBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const blogPost = await BlogPosts.findById(id);
        if (!blogPost) return res.redirect('/blog?message=Not found');

        res.render('admin/editPost', { blogPost });

    } catch (error) {
        res.redirect('/blog?message=An error occurred');
    }
}
export const updateBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const blogPost = await BlogPosts.findByIdAndUpdate(id, payload, { new: true });

        if (!blogPost) {
            return res.status(404).json({ error: "No blog post found to update" });
        }

        res.status(200).json({ message: "blog post updated successfully" });
    } catch (error) {
        res.status(400).send("Bad Request. Could not update blog post");
    }
}

export const deleteBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const isDeleted = await BlogPosts.findByIdAndDelete(id);
        if (!isDeleted) {
            return res.status(404).send("Blog post not found");
        }

        res.status(200).send("Blogpost deleted successfully");
    } catch (error) {
        res.status(400).send("Could not delete request. Try again later");
    }
}
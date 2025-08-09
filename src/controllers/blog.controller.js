import { BlogPosts } from "../models/blogPost.model.js"

export const getBlogPosts = async (req, res) => {
    const searchTerm = req.query.searchTerm || '';

    try {
        const blogPosts = await BlogPosts.find(
            searchTerm ? { title: { $regex: searchTerm, $options: 'i' } } : {}
        ).lean();

        res.render('allPosts', {
            title: 'All Blog Posts',
            posts: blogPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching blog posts.');
    }
};

export const getBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const blogPost = await BlogPosts.findById(id).lean();

        if (!blogPost) {
            return res.status(404).send('Post not found');
        }

        res.render('singlePost', {
            title: blogPost.title,
            blogPost
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the blog post.');
    }
};

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
        if (blogPost) return res.status(200).json({
            status: true,
            data: blogPost,
            message: 'Blogpost created successfully'
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            data: error.message,
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
            return res.status(404).json({ status: false, data: {}, message: 'Could not update blogpost' });
        }

        return res.status(200).json({
            statusCode: true,
            data: blogPost,
            message: 'Blogpost updated successfully'
        });
    } catch (error) {
        return res.status(400).json({
            statusCode: false,
            data: error.message,
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
                statusCode: false,
                data: {},
                message: "Delete failed. try again later"
            })
        }

        return res.status(200).json({
            status: true,
            message: "Blogpost deleted sucessfully",
            data: {}
        })
    } catch (error) {
        return res.status(400).json({
            statusCode: false,
            data: {},
            message: "Could not delete blogpost. Try again later"
        })
    }
}

export const getAdminBlogPosts = async (req, res) => {
    try {
        const blogPosts = await BlogPosts.find().lean();

        res.render("admin/blogList", {
            blogPosts,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching blog posts.");
    }
};

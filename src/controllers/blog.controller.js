import { BlogPosts } from "../models/blogPost.model.js"

export const getBlogPosts = async (req, res) => {
    try {
        const blogPosts = await BlogPosts.find();
        if (blogPosts.length === 0) {
            return res.status(200).json({message: "There are no blogposts available for retrieval"});
        }
        // return res.status(200).json(blogPosts);
         res.render("index", {
            blogPosts
        })
    } catch (error) {
        res.status(500).json({ error: "Could not retrieve blog posts" })
    }
}

export const getBlogPost = async (req, res) => {
    try {
        const { title } = req.params;
        const blogPost = await BlogPosts.findOne({ title });

        if (!blogPost) {
            return res.status(404).json({ error: `No blog post found with title ${title}` })
        }
        res.json(blogPost);
       
    } catch (error) {
        res.status(400).json({ error: `Could not find blogpost with ${req.params.title}` })
    }
}

export const createBlogPost = async (req, res) => {
    try {
        const payload = req.body;
        const blogPost = await BlogPosts.create(payload);
        res.status(201).json(blogPost);
    } catch (error) {
        res.status(400).send("Bad request. Could not create blog post");
    }
}

export const updateBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const blogPost= await BlogPosts.findByIdAndUpdate(id, payload, {new: true});

        if (!blogPost) {
      return res.status(404).json({ error: "No blog post found to update" });
    }
       
        res.status(200).json({message: "blog post updated successfully"});
    } catch (error) {
        res.status(400).send("Bad Request. Could not update blog post");
    }
}

export const deleteBlogPost = async (req, res) => {
    try {
        const {id} = req.params;
        const isDeleted = await BlogPosts.findByIdAndDelete(id);
        if (!isDeleted) {
           return res.status(404).send("Blog post not found");
        }

         res.status(200).send("Blogpost deleted successfully");
    } catch (error) {
        res.status(400).send("Could not delete request. Try again later");
    }
}
import { model, Schema } from "mongoose";

const blogPostSchema = new Schema({
    title: {type: String, required: true },
    content: {type: String, required: true},
}, {timestamps: true})

blogPostSchema.index({title: 'text', content:'text'});
export const BlogPosts = model('blog post', blogPostSchema)

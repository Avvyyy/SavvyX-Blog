import { model, Schema } from "mongoose";

const blogPostSchema = new Schema({
    title: {type: String, required: true },
    author: String,
    content: String,
}, {timestamps: true})

export const blogposts = model('Blog Posts', blogPostSchema)
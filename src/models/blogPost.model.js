import { model, Schema } from "mongoose";

const blogPostSchema = new Schema({
    title: {type: String, required: true },
    content: {type: String, required: true},
}, {timestamps: true})

export const blogPostModel = model('blogPost', blogPostSchema)

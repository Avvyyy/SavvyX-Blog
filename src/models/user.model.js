import { model, Schema } from "mongoose";

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
})

export const userModel = model('users', userSchema)
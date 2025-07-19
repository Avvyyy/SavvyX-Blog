import { model, Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, minLength: [8, "Password must be at least 8 characters"], required: true },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    email: { type: String, required: true },
    role: { type: String, enum: { values: ['admin', 'user'] }, default: "user" }
})

export const userModel = model('users', userSchema)
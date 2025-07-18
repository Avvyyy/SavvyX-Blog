import { model, Schema } from "mongoose";


const userSchema = new Schema({
    username: {type: String, unique: true,  required: true },
    password: { type: String, minLength: [8, "Password must be at least 8 characters"], required: true},
    email: {type: String, required: true },
    role: {enum: {values: ['admin', 'user']}}
})

export const User = model('user', userSchema)
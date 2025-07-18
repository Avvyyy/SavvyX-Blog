import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';

const {SECRET = "SECRET"} = process.env; //confirm why this is so

export const signgUp = async (req, res) => {
    const payload = req.body;
    try {
        payload.password = await bcrypt.hash(payload.password, 10);
        const user = await User.create(req.body);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error });
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });
        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                const token = await jwt.sign({ username: user.username }, SECRET);
                res.json({ token });
            } else {
                res.status(400).json({ error: "passwords don\t match" });
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message || "An unexpected error occurred" });
    }


}


export const forgotPassword = async (req, res) => {

}
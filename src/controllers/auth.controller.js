import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Users } from '../models/user.model.js';
import { createTransport } from 'nodemailer';

const { SECRET = "SECRET" } = process.env; //confirm why this is so

export const getSignupPage = async (req, res) => {
    try {
        res.render("getStarted");
    } catch (error) {
        res.status(404).json({ error: "Page not found" })
    }
}

export const signgUp = async (req, res) => {
    const payload = req.body;
    try {
        payload.password = await bcrypt.hash(payload.password, 10);
        const user = await Users.create(req.body);
        if (user) {
            await jwt.sign({ username: user.username }, SECRET);
            if (user.role === "admin") {
                return res.render("admin", { user });
            } else {
                return res.render("index", { user });
            }
        } else {
            return res.render("getStarted", {error: "Retry sign up"});
        }
    } catch (error) {
        res.status(400).json({ error });
    }
}

export const getLoginPage = async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        res.status(404).json({ error: "Page not found" })
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Users.findOne({ username: username });
        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                await jwt.sign({ username: user.username }, SECRET);

                if (user.role === "admin") {
                    return res.render("admin", { user });
                } else {
                    return res.render("index", { user });
                }
            } else {
                return res.render("login", { message: "Passwords do not match" })
            }
        } else {
            res.status(400)
            return res.render("login", { message: "Username does not exist" })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message || "An unexpected error occurred" });
    }
}

export const getForgotPasswordPage = async (req, res) => {
    try {
        const token = req.query.token || null;
        res.render("forgotPassword", { token });
    } catch (error) {
        return res.status(404).send("")
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email });
        if (!user) return res.status(404).json({ error: "Email does not exist on the database" })

        const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: "1h" });

        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000
        await user.save();

        const transporter = createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            to: user.email,
            subject: "Password Reset",
            text: `Click the link to reset your password: http://localhost:3000/auth/forgot-password?token=${token}`
        }

        await transporter.sendMail(mailOptions);
        return res.json({ message: "Reset link sent to email" });


    } catch (error) {
        return res.status(500).json({ error: "Try changing password later" });
    }

}

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, SECRET);
        const user = await Users.findOne({ _id: decoded._id, resetToken: token });

        if (!user || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" })
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.render('login', { message: "Password reset successful" })
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
}


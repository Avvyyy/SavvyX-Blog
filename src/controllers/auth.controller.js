import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Users } from '../models/user.model.js';
import { createTransport } from 'nodemailer';

const renderDashboard = (user) => {
    if (user.role === "admin") {
        return "/blog/admin";
    } else {
        return "/blog";
    }
}

export const getSignupPage = async (req, res) => {
    try {
        const { adminToken } = req.query;
        res.render("auth/getStarted", { adminToken });
    } catch (error) {
        res.status(404).json({ error: "Page not found" })
    }
}

export const signgUp = async (req, res) => {
    const { adminToken, ...payload } = req.body;

    try {
        if (adminToken) {
            try {
                const verifyAdminToken = jwt.verify(adminToken, process.env.SECRET);
                if (verifyAdminToken) payload.role = 'admin';
            } catch (error) {
                res.status(401).json({
                    statusCode: 401,
                    message: "Invalid or expired status code",
                    error: "The status code is invalid or expired"
                })
            }
        }

        payload.password = await bcrypt.hash(payload.password, 10);
        const userExists = await Users.findOne({ username: payload.username });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" })
        }
        const user = await Users.create(payload);
        if (user) {
            const token = await jwt.sign({ username: user.username, role: user.role }, process.env.SECRET, { expiresIn: "7d" });
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.cookie("user", { username: user.username, role: user.role }, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.redirect(renderDashboard(user));
        } else {
            return res.render("auth/getStarted", { error: "Retry sign up" });
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

export const getLoginPage = async (req, res) => {
    const { message } = req.query || null;
    try {
        res.render("auth/login", { message });
    } catch (error) {
        res.status(404).json({ error: "Page not found" })
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Users.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } });
        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                const token = await jwt.sign({ username: user.username, role: user.role }, process.env.SECRET);
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                res.cookie("user", { username: user.username, role: user.role }, {
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                return res.redirect(renderDashboard(user));
            } else {
                return res.redirect("/auth/login?message=Incorrect Password")
            }
        } else {
            res.status(400)
            return res.redirect("/auth/login?message=Username does not exist")
        }
    } catch (error) {
        return res.redirect("/auth/login?message=An unexpected error occurred")
    }
}

export const getForgotPasswordPage = async (req, res) => {
    try {
        const { token, error } = req.query || null;
        res.render("auth/forgotPassword", { token, error });
    } catch (error) {
        return res.status(404).send("")
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await Users.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } });
        if (!user) return res.redirect('/auth/forgot-password?error=User does not exist on database');


        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "1h" });

        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000
        await user.save();

        try {
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
            return res.redirect('/auth/forgot-password?error=Network error occurred. Try again later.');
        }

    } catch (error) {
        return res.redirect('/auth/forgot-password?error=An error occurred. Try again later.');
    }

}

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await Users.findOne({ _id: decoded._id, resetToken: token });

        if (!user || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" })
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        return res.redirect('/auth/login?message=Password changed successfully')
    } catch (error) {
        console.error("Error", error);
        res.status(400).json({ message: "Invalid token" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.clearCookie("user");
        return res.redirect('/auth/login');
    } catch (error) {

    }
}


export const generateAdminToken = async (req, res) => {
    const payload = {
        role: 'admin',
        purpose: 'admin_signup'
    }

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' });

    const inviteLink = `http://localhost:3000/auth/get-started?adminToken=${token}`

    res.json({
        status: 200,
        message: "Admin token generated successfully",
        data: {
            token: token,
            inviteLink: inviteLink,
        }
    })
}
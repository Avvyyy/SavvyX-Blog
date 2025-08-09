import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Users } from '../models/user.model.js';
import { createTransport } from 'nodemailer';


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
            return res.status(200).json({
                status: true,
                message: "User created successfully",
                data: { token: token, user: {username: user.username, role: user.role}}
            })
        } else {
            return res.status(400).json({
                status: false,
                message: "Error: One or two of your inputs have issues",
                data: {}
            })
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "An unexpected error occurred",
            data: {}
        })
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
                return res.status(200).json({
                    status: true,
                    message: "User logged in successfully",
                    data: { token: token, user: {username: user.username, role: user.role}}
                })
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Error: One or two of your inputs have issues",
                    data: {}
                })
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "Error: User does not exist on the database",
                data: {}
            })
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Error: An unexpected error occurred",
            data: {}
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await Users.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } });
        if (!user) return res.status(400).json({
            status: false,
            message: "Error: User does not exist on the database",
            data: {}
        })


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
            return res.status(200).json({
                status: true,
                message: "Reset link sent to email",
                data: {}
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Error: An unexpected error occurred",
                data: {}
            })
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
            return res.status(400).json({ status: false, message: "Invalid or expired token", data: {} })
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        res.status(400).json({ status: true, message: "Password reset successfully", data: {} });


    } catch (error) {
        console.error("Error", error);
        res.status(400).json({ status: false, message: "Invalid token", data: {} });
    }
}

// Look out to implement this
// export const logout = async (req, res) => {
//     try {
//         res.clearCookie("token");
//         res.clearCookie("user");
//         return res.redirect('/auth/login');
//     } catch (error) {

//     }
// }

export const generateAdminToken = async (req, res) => {
    const payload = {
        role: 'admin',
        purpose: 'admin_signup'
    }

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' });

    const inviteLink = `http://localhost:3000/auth/get-started?adminToken=${token}`

    res.status(201).json({
        status: 200,
        message: "Admin token generated successfully",
        data: {
            token: token,
            inviteLink: inviteLink,
        }
    })
}
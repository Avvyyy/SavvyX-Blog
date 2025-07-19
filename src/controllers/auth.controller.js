import jwt from 'jsonwebtoken';
import bcrypt, { hashSync } from 'bcryptjs';
import { User } from '../models/user.model.js';
import { createTransport } from 'nodemailer';

const { SECRET = "SECRET" } = process.env; //confirm why this is so

export const getSignupPage = async (req, res) => { 
    try {
        res.render("getStarted");
    } catch (error) {
        res.status(404).json({error: "Page not found"})
    }
}

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

export const getLoginPage = async (req, res) => { 
      try {
        res.render("login");
    } catch (error) {
        res.status(404).json({error: "Page not found"})
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
    try {
        const { email } = req.body;
        user = User.findOne({ email });
        if (!user) res.status(404).json({ error: "Email does not exist on the database" })

        const token = jwt.sign({ _id: user.id }, SECRET, { expiresIn: "1h" });

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
            text: `Click the link to reset your password: http://localhost:3000/reset-password/${token}`
        }

        await transporter.sendMail(mailOptions);
        res.json({ message: "Resent link sent to email" });


    } catch (error) {
        res.status(500).json({ error: "Try changing password later" });
    }

}

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({ _id: decoded.id, resetToen: token });

        if (user || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" })
        }

        user.passsword = hashSync(newPassword, 10);
        user.resetToekn = null;
        user.reserTokenExpiry = null;
        await user.save();


        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
}


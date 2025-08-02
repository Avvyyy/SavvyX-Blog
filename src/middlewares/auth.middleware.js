import jwt from 'jsonwebtoken';

export const isLoggedIn = async (req, res, next) => {
    try {
        // Use this req.header.authorisation method when building out an API which you are not doing
        // const token = req.cookies?.token || (req.header.authorization.split(" ")[1]);

        const token = req.cookies?.token;

        if (!token) {
            return res.redirect('/auth/login');
        }

        const payload = jwt.verify(token, process.env.SECRET);
        req.user = payload;
        return next();

    } catch (error) {
        return res.redirect("/auth/login?message=Authorisation failed. Retry Login");
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.redirect("/auth/login?message=Login to continue");
        }

        if (req.user.role !== "admin") {
            return res.redirect("/blog/?Only admins can view this page")
        }

        return next();
    }
    catch (error) {
        return res.redirect("/blog?message=Admin authorisation failed");
    }
}
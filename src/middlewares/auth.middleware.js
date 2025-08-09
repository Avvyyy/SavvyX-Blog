import jwt from 'jsonwebtoken';

export const isLoggedIn = async (req, res, next) => {
    try {
        // const token = req.header("Authorization")?.replace("Bearer ", ""); This works or
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.redirect('/login');
        }

        const payload = jwt.verify(token, process.env.SECRET);
        req.user = payload;
        return next();

    } catch (error) {
        return res.redirect("/login?message=Authorisation failed. Retry Login");
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.redirect("/login?message=Login to continue");
        }

        if (req.user.role !== "admin") {
            return res.redirect("/blog/?error=Unauthorised access")
        }

        return next();
    }
    catch (error) {
        return res.redirect("/blog?message=Admin authorisation failed");
    }
}
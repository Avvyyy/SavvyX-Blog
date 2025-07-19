import jwt from 'jsonwebtoken';

const { SECRET = "SECRET" } = process.env; 

export const isLoggedIn = async (req, res, next) => {
    try {
        if(req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if(token) {
                const payload = await jwt.verify(token, SECRET);
                if(payload) {
                    req.user = payload;
                    next();
                } else {
                    res.status(400).json({error: "token verification failed"});
                }
            }else {
                res.status(400).json({error: "malformed auth header"});
            }
        } else {
            res.status(400).json({error: "No auth header"}); 
        }
    } catch (error) {
        res.status(400).json({error});
    }
 
}

export const isAdmin = async (req, res, next) => {
    try{
        if (!req.user) {
            return res.status(401).json({error: "Not aunthenticated"});
        }

        if(req.user.role !== "admin") {
            //   res.redirect('/');
            return res.status(403).json({error: "Only admins can perform this operation"});
        }

        next();
    }
    catch (error) {
        return res.status(500).json({error: "Authorisation failed"});
    }
}
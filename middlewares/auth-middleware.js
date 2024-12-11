const jwt = require ('jsonwebtoken');
const User = require('../models/user-model')


const authMiddleware = async (req, res, next) => {
    
    const token = req.header("Authorization");
    //const token = req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
        return res.status(401).json({ message: "Unauthorized HTTP, token not provided" });
    }

    const jwtToken = token.replace("Bearer ", "").trim();

    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY); 

        const userData = await User.findOne({ email: isVerified.email }).select({ password: 0 });

        if (!userData) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = userData;
        req.token = token;
        req.userID = userData._id;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
}

module.exports = authMiddleware
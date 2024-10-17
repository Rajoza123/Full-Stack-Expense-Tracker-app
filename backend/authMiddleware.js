// authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1]; // Assumes "Bearer <token>"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Debugging: Check if the decoded token contains user ID
        console.log('Decoded Token:', decoded); 

        req.userId = decoded.id; // Assuming JWT contains 'id' for user
        next();
    } catch (error) {
        console.log('Authentication error:', error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authMiddleware;

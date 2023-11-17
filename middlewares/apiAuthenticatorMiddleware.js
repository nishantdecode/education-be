const jwt = require('jsonwebtoken');
const secretKey = 'EDMERTION_SECRET'; // Replace this with a secure secret key

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach the decoded user information to the request object
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

module.exports = authenticateToken;

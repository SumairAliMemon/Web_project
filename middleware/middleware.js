const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Regular authentication middleware - keep as is
const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Payload:", decoded);
        
        // Keep original structure
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Modified admin authentication middleware
const adminAuth = async (req, res, next) => {
    try {
        // Get the user from database using req.user.id
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admins only.' });
        }

        // Add role to existing req.user object
        req.user.role = user.role;

        console.log("Admin user:", req.user);
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ msg: 'Server error' });
    }
};

module.exports = {
    authMiddleware,
    adminAuth
};
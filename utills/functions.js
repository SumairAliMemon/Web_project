const jwt = require('jsonwebtoken');

// Function to extract user ID from the token in the request header
 function getUserIdFromToken(req) {
    const token = req.headers['authorization']?.split(' ')[1]; // Assumes "Bearer <token>"
    if (!token) {
        throw new Error('Token required'); // You can handle this error in your route
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id; // Return user ID from token
    } catch (error) {
        throw new Error('Invalid token'); // Handle token verification error
    }
}

module.exports = {
    getUserIdFromToken
};




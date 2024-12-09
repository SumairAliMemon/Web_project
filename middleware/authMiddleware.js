const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];

  console.log(token + "token is here ");
  if (!token) return res.status(403).json({ error: "No token provided" });

  try {

   
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach user ID to the request object
    req.userRole = decoded.role; // Attach user role to the request object
    res.userId = decoded.id; // Store the user ID in the response object
   
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = { verifyToken };

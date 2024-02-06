const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require('dotenv');
dotenv.config();

exports.authMiddleware = async (req, res, next) => {
  try {
    // Check if authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    console.log(authHeader, " this is authHeader"); 
    
    // Extract token from authorization header
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    console.log(token, " this token");

    

    // Verify token and extract user id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user from database and attach to request object
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error authenticating user" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};


const jwt = require("jsonwebtoken");
const user = require("../models/User.js");

const isLoggedIn = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await user.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access." });
  }
};

module.exports = isLoggedIn;

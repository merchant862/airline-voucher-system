const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = () => {
  return (req, res, next) => {
    try {
      const token = req.cookies?.adminToken;
      if (!token) return res.redirect('/login');

      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded; // decoded JWT info
      next();

    } catch (err) {
      console.error("Auth error:", err);
      return res.redirect('/login');
    }
  }
}

module.exports = auth;

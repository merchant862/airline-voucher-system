const jwt = require('jsonwebtoken');
require('dotenv').config();

const deauth = (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;
    if (token) {
      try {
        jwt.verify(token, process.env.SECRET);
        return res.redirect('/dashboard'); // already logged in
      } catch(e) {
        next();
      }
    } else next();
  } catch(e) {
    next(e);
  }
}

module.exports = deauth;

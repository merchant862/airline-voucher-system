const jwt = require('jsonwebtoken');
const { getSafeNext } = require('../utils/safeRedirect');
require('dotenv').config();

function isApiRequest(req) {
  return req.path === '/api' || req.path.startsWith('/api/');
}

function rejectUnauthenticated(req, res) {
  if (isApiRequest(req)) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const nextPath = getSafeNext(req.originalUrl);
  return res.redirect(`/login?next=${encodeURIComponent(nextPath)}`);
}

const auth = () => {
  return (req, res, next) => {
    try {
      const token = req.cookies?.adminToken;
      if (!token) return rejectUnauthenticated(req, res);

      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded; // decoded JWT info
      next();

    } catch (err) {
      console.error("Auth error:", err);
      return rejectUnauthenticated(req, res);
    }
  }
}

module.exports = auth;

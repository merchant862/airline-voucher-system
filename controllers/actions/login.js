const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { admins } = require('../../database/models');

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const admin = await admins.findOne({ where: { email } });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    // Generate JWT with role "admin"
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.SECRET,
      { expiresIn: '30d' }
    );

    // Set cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      maxAge: 30*24*60*60*1000, // 30 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    return res.json({ success: true, message: "Login successful" });

  } catch (err) {
    next(err);
  }
};

module.exports = loginController;

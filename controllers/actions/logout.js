const logoutController = (req, res) => {
  try {

    res.clearCookie('adminToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    return res.redirect('/'); // redirect to home route

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};

module.exports = logoutController;
require('dotenv').config();

async function dashboardViewController(req, res, next) 
{
    try{ return res.status(200).render(`../views/dashboard.ejs`, { admin: req.user }) }
    catch(error){ next(error) }
}

module.exports = dashboardViewController
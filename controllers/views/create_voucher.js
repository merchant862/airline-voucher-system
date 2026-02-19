require('dotenv').config();

async function loginViewController(req, res, next) 
{
    try{ return res.status(200).render(`../views/voucher.ejs`) }
    catch(error){ next(error) }
}

module.exports = loginViewController
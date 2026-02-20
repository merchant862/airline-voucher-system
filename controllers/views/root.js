require('dotenv').config();

async function rootViewController(req, res, next) 
{
    try{ return res.redirect('/dashboard') }
    catch(error){ next(error) }
}

module.exports = rootViewController
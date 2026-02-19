let roles = 
{
    "roles": 
    [
      { "name": "Super_Admin", "value": process.env.Super_Admin },
      { "name": "Admin",       "value": process.env.Admin },
      { "name": "Sub_Admin",   "value": process.env.Sub_Admin },
      { "name": "User",        "value": process.env.User }
    ]
}

module.exports = roles;
  
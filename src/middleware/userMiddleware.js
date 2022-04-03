const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getCurrUser = (req, res, next) => {
  const token = req.cookies.jwt;
  
  // Check if jsonwebtoken exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(401).end();
      } else {        
        let id = decodedToken.id;
        
        User.findOne({ _id: id })
        .then((user) => {
          res.locals.user = {role: user.role};
          next();
        })
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
}

module.exports = { getCurrUser };
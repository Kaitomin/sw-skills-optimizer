const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { getCurrUser } = require('../middleware/userMiddleware');

require('dotenv').config();


// JWT
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.SESSION_SECRET_KEY, { 
        expiresIn: maxAge
    });
}

// User registration
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const user = await User.create({ username, password, role });

    return res.status(201).json({ user: user._id });
  } catch (error) {
    return res.status(400).send({ error })
  }
  
});

router.get('/login', (req, res) => {
  if (res.locals.user) return res.status(401).json({msg: 'Already logged in' })
  return res.sendStatus(201)
})
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id, user.role);

    res.cookie('jwt', token, { 
      httpOnly: true, // client can't retrieve cookie with script
      maxAge: maxAge * 1000, // in ms
      sameSite: true,  // only sent for requests to the same FQDN as the domain in the cookie
      // secure: true, // only transfer over https
    });

    return res.status(201).json({ user: user._id, role: user.role });
  } catch (error) {
    return res.status(400).send({ error })
  }
});

router.post('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  return res.status(200).end();
});

router.get('/session', getCurrUser, (req, res) => {
  if (res.locals.user) {
    return res.status(200).json({ 
      user: res.locals.user._id, 
      role: res.locals.user.role 
    });
  }
  res.end();
});

module.exports = router;
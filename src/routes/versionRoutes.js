const router = require('express').Router();

router.get('/version', (req, res) => {
  res.status(200).send(process.env.FRONTEND_VERSION)
})

module.exports = router
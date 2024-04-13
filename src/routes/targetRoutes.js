const router = require('express').Router();
const Target = require('../models/Target');


router.get('/target', async (req, res) => {
  try {
    const target = await Target.find()
    return res.status(200).json({ target });
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get('/target/:slug', async (req, res) => {
  try {
    const target = await Target.findOne({ slug: req.params.slug});
    return res.status(200).json({ target });
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = router
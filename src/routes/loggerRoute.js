const router = require('express').Router();
const Logger = require('../models/Logger');

router.get('/logger', async (req, res) => {
  const logger = await Logger.find({})

  return res.status(201).json({ logger });
})

router.post('/logger', async (req, res) => {
  try {
    await Logger.create({
      date: req.body.currentDate,
      skill: req.body.skill
    })
    return res.status(201).json();
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
})

module.exports = router
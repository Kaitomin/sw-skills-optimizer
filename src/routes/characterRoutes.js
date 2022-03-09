const router = require('express').Router();
const Character = require('../models/Character');
const Skill = require('../models/Skills');
const multer = require('multer');
const fs = require("fs");
const { getCurrUser } = require('../middleware/userMiddleware');


// Set Multer storage to upload images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/src/assets/uploads/characters')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1])
  }
})

const upload = multer({ storage: storage })

// Get characters list
router.get('/', async (req, res) => {
  try {
    const charList = await Character.find({});

    return res.status(201).json({ charList });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});


// Add character
router.post('/add-new-char', upload.single('avatar'), async (req, res) => {
  try {

    let img = fs.readFileSync(req.file.path);
    let encode_img = img.toString('base64');
    const final_img = {
      contentType: req.file.mimetype,
      image: Buffer.from(encode_img,'base64')
    };

    const char = await Character.create({
      name: req.body.name,
      avatar: final_img,
      icon: req.file.filename
    })
    res.status(201).json({ char });

  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// Get character skills information
router.get('/character/:id', async (req, res) => {
  try {
    const character = await Character.findOne({ _id: req.params.id});
    const skills = await Skill.find({ character: character.name });
    return res.status(201).json({ character, skills });
  } catch (error) {
    return res.status(400).send('Unexpected error');
  }
});


module.exports = router
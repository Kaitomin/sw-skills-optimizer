const router = require('express').Router();
const Skill = require('../models/Skills');
const multer = require('multer');
const fs = require("fs");

// Set Multer storage to upload images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/src/assets/uploads/skills')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1])
  }
})

const upload = multer({ storage: storage });


// Add new skill
router.get('/add-new-skill', (req, res) => {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' })
  return res.send(201);
})
router.post('/add-new-skill', upload.single('icon'), async (req, res) => {
  try {
    let img = fs.readFileSync(req.file.path);
    let encode_img = img.toString('base64');
    const final_img = {
      contentType: req.file.mimetype,
      image: Buffer.from(encode_img,'base64')
    };

    const skill = await Skill.create({
      skillName: req.body.skillName,
      dmg: req.body.dmg,
      cast: req.body.cast,
      cd: req.body.cd,
      character: req.body.character,
      avatar: final_img,
      icon: req.file.filename
    })
    res.status(201).json({ skill });

  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

module.exports = router
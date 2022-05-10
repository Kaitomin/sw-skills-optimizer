const router = require('express').Router();
const Character = require('../models/Character');
const Skill = require('../models/Skills');
const multer = require('multer');
const fs = require("fs");
const path = require("path")
const cheerio = require('cheerio');
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
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' })
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
router.get('/character/:name', async (req, res) => {
  try {

    // updateMetaTags(req, res)

    const character = await Character.findOne({ name: req.params.name});
    const skills = await Skill.find({ character: character.name });

    return res.status(201).json({ character, skills });
  } catch (error) {
    return res.status(400).send('Unexpected error');
  }
});

// Change meta OG tags dynamically 
// app.use('/*', (req, res, next) => {
//   if (/^\/api\//.test(req.originalUrl)) next();
//   else if (/\/character\//.test(req.originalUrl)) updateMetaTags(req, res);
//   else res.sendFile(`${__dirname}/client/dist/index.html`);
// });


async function updateMetaTags(req, res) {

  // Get and parse products array from app src
  const charactersSrc = path.join(__dirname, '../../client/src/og.json')
  const charactersText = await fs.promises.readFile(charactersSrc, 'utf8')
  const charactersArr = JSON.parse(charactersText).characters

  // Retrieve product object that includes the current URL item id
  const characterName = req.originalUrl.split('/')[3];
  const characterObj = charactersArr.find(char => char.name == characterName)

  // Update the meta tag properties in the built bundle
  // const baseSrc = path.join(__dirname, '../../client/dist/index.html')
  const baseSrc = path.join(__dirname, '../../client/public/index.html')
  const baseHTML = await fs.promises.readFile(baseSrc, 'utf8')
  const $ = cheerio.load(baseHTML)

  // let $url = $('meta[property=og\\:url]')
  let $image = $('meta[property=og\\:image]')
  let $imageSecure = $('meta[property=og\\:image\\:secure_url]')
  // $url.attr('content', `https://${req.get('host')}${req.originalUrl}`)
  $image.attr('content', characterObj.ogImage)
  $imageSecure.attr('content', characterObj.ogImage)

  // console.log($url)
  // console.log($image)
  console.log($.html())

  // Send the modified HTML as the response
  // return $.html()
  res.send($.html())

  // fs.writeFileSync(path.join(__dirname, '../../client/public/index.html'), $.html())
}



module.exports = router
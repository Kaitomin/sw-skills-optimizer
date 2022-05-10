const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const charRoutes = require('./routes/characterRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require("cookie-parser");
const { getCurrUser } = require('./middleware/userMiddleware');
const path = require('path');

require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: 'http://localhost:8080',
    credentials: true,
  }
));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/dist')));
}

app.use(getCurrUser);

// Routes
app.use('/api', charRoutes);
app.use('/api', skillsRoutes);
app.use('/api', userRoutes);

// Serve file after refresh page
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
// });


// Change meta OG tags dynamically 
app.use('/*', (req, res, next) => {
  console.log("tes")
  // if (/^\/api\//.test(req.originalUrl)) {
    // console.log('if')
    // next();
  // }
  if (/character/.test(req.originalUrl)) {
    // console.log('else if')
    updateMetaTags(req, res);
  } else {
    // console.log('else')
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  }
});



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

  console.log($.html())

  // Send the modified HTML as the response
  res.send($.html())
}




// DB connection
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 8000)
  })
  .catch((err) => console.log(err))

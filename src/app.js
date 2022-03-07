const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const charRoutes = require('./routes/characterRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require("cookie-parser");
const { getCurrUser } = require('./middleware/userMiddleware');

require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: 'http://localhost:8080',
    credentials: true,
  }
));

app.use(getCurrUser)

// Routes
app.use('/api', charRoutes);
app.use('/api', skillsRoutes);
app.use('/api', userRoutes);

// DB connection
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Server listening on port :', process.env.PORT);
    })
  })
  .catch((err) => console.log(err))

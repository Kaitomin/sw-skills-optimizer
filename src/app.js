const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const charRoutes = require('./routes/characterRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const userRoutes = require('./routes/userRoutes');
const targetRoutes = require('./routes/targetRoutes');
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
app.use('/api', targetRoutes);

// Serve file after refresh page
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// DB connection
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 8000)
  })
  .catch((err) => console.log(err))

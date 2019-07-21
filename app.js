const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Passport Config
require('./config/passport')(passport);
// Load Routes
const auth = require('./routes/auth');
const app = express();

app.get('/', (req, res) => {
  res.send('it works');
});

// User Routes
app.use('/auth', auth);

const port = process.env.PORT || 5001;

app. listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(Date());
});

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Load User Model
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
const app = express();

// Load Keys
const keys = require('./config/keys');

// Map global promises
mongoose.promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
  //useMongoCLient: true,
  useNewUrlParser: true
})
  .then(() => console.log("MongoDB connected to server"))
  .catch(err => console.log(err));

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

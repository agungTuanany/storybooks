const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load User Model
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');

const app = express();

// handling static folder
app.use('*/public', express.static('public'));

// Load Keys
const keys = require('./config/keys');

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
  //useMongoCLient: true,
  useNewUrlParser: true
})
  .then(() => console.log("MongoDB connected to server"))
  .catch(err => console.log(err));

// express-handlebars middleware
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main',
}));
app.set('view engine', 'hbs');

// cookie-parser middleware
app.use(cookieParser());

// express-session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

//  !IMPORTANT write after express-session
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// User Routes
app.use('/', index);
app.use('/auth', auth);

const port = process.env.PORT || 5001;

app. listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(Date());
});

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load Models
require('./models/User');
require('./models/Story');

// Handlebars Helpers
const {
  truncate,
  stripTags
} = require('./helpers/hbs');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

const app = express();

// handling static folder
app.use('*/public', express.static('public'));
app.use('*/node_modules', express.static('node_modules'));

// body-routes middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  storiesDir: __dirname + '/views/stories',
  helpers: {
    truncate,
    stripTags
  }
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
app.use('/stories', stories);

const port = process.env.PORT || 5001;

app. listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(Date());
});

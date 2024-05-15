const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require("mongoose");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { check } = require('express-validator');

const users = require('./controllers/users.js');
const movies = require('./controllers/movies.js');

mongoose.connect('mongodb://localhost:27017/cfDB'); //Mongoose 8.3.4: useNewUrlParser, useUnifiedTopology are no longer supported
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to cfDB database");
});

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
const allowedOrigins = ['*'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const message = `The CORS policy for this application doesn't allow access from origin ${origin}`;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

const auth = require('./config/auth.js')(app);
const passport = require('passport');
require('./config/passport.js');
 

app.use('/documentation', express.static('public', {index: 'documentation.html'})); 

app.get('/', (req, res) => { res.status(200).send('Welcome to Cinephile!');});

const authenticate = passport.authenticate('jwt', { session: false });

app.get('/movies',authenticate, movies.readAll);
app.get('/movies/search', authenticate, movies.search);
app.get('/movies/featured', authenticate, movies.readFeatured);
app.get('/movies/:title', authenticate, movies.read);
app.get('/movies/genre/:name', authenticate, movies.readGenre);
app.get('/movies/:title/genre', authenticate, movies.readGenreByTitle);
app.get('/movies/director/:name', authenticate, movies.readDirector);
app.get('/movies/:title/director', authenticate, movies.readDirectorByTitle);

//Users
const validateSignup = [ 
  check('Username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({min: 5, max: 20}).withMessage('Username must be between 5 and 20 characters long')
    .isAlphanumeric().withMessage('Username contains non alphanumeric characters - not allowed'),
  check('Password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long') // Corrected here
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),
  check('Email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .normalizeEmail()
    .isEmail().withMessage('Email does not appear to be valid'),
  check('Birthday')
    .notEmpty()
    .isDate().withMessage('Birthday must be a valid date')
];

const validateUpdate = [
    check('Username')
      .optional()
      .trim()
      .isLength({min: 5, max: 20}).withMessage('Username must be between 5 and 20 characters long')
      .isAlphanumeric().withMessage('Username contains non alphanumeric characters - not allowed'),
    check('Password')
      .optional()
      .trim()
      .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),
    check('Email')
      .optional()
      .trim()
      .normalizeEmail()
      .isEmail().withMessage('Email does not appear to be valid'),
    check('Birthday')
      .optional()
      .isDate().withMessage('Birthday must be a valid date')
];

app.post('/users/signup', validateSignup, users.create);
app.get('/users/search/id/:id', authenticate, users.readById);
app.get('/users/search/username/:username',authenticate, users.readByUsername);
app.get('/users', authenticate, users.readAll);
app.put('/users/profile/update/:Username', validateUpdate, authenticate, users.update); 
app.post('/users/:Username/favorite/:Title', authenticate, users.addFavoriteMovie);
app.delete('/users/:Username/favorite/:Title', authenticate, users.removeFavoriteMovie);
app.get('/users/profile/me', authenticate, users.me); 
app.delete('/users/profile/delete', authenticate, users.delete);
app.post('/logout', (req, res) => { 
  req.logout();
  res.status(200).send('Logged out');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'An error occurred!' });
});

app.listen(port, '0.0.0.0',() => {
 console.log(`Listening on Port ${port}`);
});
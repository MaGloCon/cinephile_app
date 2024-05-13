//Import third-party modules
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require("mongoose"),
  {check, validationResult} = require('express-validator');

// Import local modules
const models = require("./models.js");
const Movies = models.Movie;
const Users = models.User;

// Initialize Express application
const app = express();
const port = 8080;

// Apply middleware
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware
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

// JWT authentication
const auth = require('./auth.js')(app); 
const passport = require('passport');
require('./passport.js');

//Connect to MongoDB database and log connection status
mongoose.connect('mongodb://localhost:27017/cfDB'); //Mongoose 8.3.4: useNewUrlParser, useUnifiedTopology are no longer supported
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to cfDB database");
});

app.use('/documentation', express.static('public', {index: 'documentation.html'})); 

app.get('/', (req, res) => {
  res.send('Welcome to Cinephile!');
});

// Retrieving all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const query = {};
    const searchableFields = ['Title', 'Year', 'Countries', 'Languages', 'Genre.Name', 'Director.Name']
    for (const key in req.query) {
      if (searchableFields.includes(key)) {
        query[key] = req.query[key];
      }
    }
    const movies = await Movies.find(query);
    if (!movies || movies.length === 0) {
      return res.status(404).send({ message: 'An error occurred while retrieving movies' });
    }
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: `Error retrieving movies` });
  }
});

// Retrieving all details of a specific movie
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { title } = req.params;
  try {
    const movie = await Movies.findOne({ Title: title });
    if (!movie) {
      return res.status(404).send({ message: `The movie "${title}" couldn't be found.` });
    }
    res.status(200).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error retrieving movie: ${title}` });
  }
});

// Retrieving details of a specific genre
app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const  { name } = req.params;
  try {
    const movie = await Movies.findOne({ 'Genre.Name': name }, { 'Genre.$': 1 });
    if (!movie || !movie.Genre || movie.Genre.length === 0) {
      return res.status(404).send({ message: `The genre could not be found` });
    }
    res.status(200).json(movie.Genre[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message:`Error retrieving genre: ${genre}` });
  }
});

// Retrieving all genres of a specific movie
app.get('/movies/:title/genre', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { title } = req.params;
  try {
    const movie = await Movies.findOne({ Title: title });
    if (!movie || !movie.Genre || movie.Genre.length === 0) {
      return res.status(404).send({ message: `The movie could not be found or it does not have a genre` });
    }
    res.status(200).json(movie.Genre);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message:`Error retrieving genre(s) for movie: ${title}` });
  }
});

// Retrieving details of a specific director
app.get('/movies/director/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const  { name } = req.params;
  try {
    const movie = await Movies.findOne({ 'Director.Name': name });
    if (!movie || !movie.Director) {
      return res.status(404).send({ message: `The director could not be found.` });
    }
    res.status(200).json(movie.Director);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error retrieving director: ${name}` });
  }
});

// Retrieving director(s) of a specific movie
app.get('/movies/:title/director', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { title } = req.params;
  try {
    const movie = await Movies.findOne({ Title: title });
    if (!movie || !movie.Director || movie.Director.length === 0) {
      return res.status(404).send({ message: `The movie could not be found or it does not have a director`});
    }
    res.status(200).json(movie.Director);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error retrieving director(s) for: ${title}`);
  }
});

// Retrieving all users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const users = await Users.find();
    res.status(201).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
});

// Retrieving a single user
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await Users.findOne({ Username: req.params.Username });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
});

//User registration requests -- adding a new user
app.post('/users',
[ 
  check('Username', 'Username is required').isLength({min: 5}), 
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(), 
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail(),
  check('Birthday', 'Birthday is required').not().isEmpty() 
],
async (req, res) => {
  try {
    const errors = validationResult(req); //Check for validation errors
    
    if (!errors.isEmpty()) {  //If validation errors)
      return res.status(422).json({ errors: errors.array() });
    }

    const hashedPassword = Users.hashPassword(req.body.Password); 
    const existingUser = await Users.findOne({ Username: req.body.Username }); //Check if a user already exists with the requested username

    if (existingUser) {
      return res.status(400).send(`${req.body.Username} already exists`);
    } else { //If the user does not exist, create a new user
      const user = await Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      });

      return res.status(201).json(user);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Error: ${error}`);
  }
});

// User profile/account update requests
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
[ 
  check('Username').isEmail(),
  check('Password').isLength({ min: 5 }),
  check('Email').isEmail(),
  check('Birthday').isDate()
], 
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if(req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied'); //use 403 for forbidden?
  }
  try {
    const hashedPassword = Users.hashPassword(req.body.Password);
    const updatedUser = await Users.findOneAndUpdate({ Username: req.params.Username }, 
      { $set:
        {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      }, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
});



// User favorite movies add requests -- changed from using movie _id to Title to be more intuitive/user-friendly
app.post('/users/:Username/movies/:Title', passport.authenticate('jwt', { session: false }), 
async (req, res) => {
  try {
    const movie = await Movies.findOne({ Title: req.params.Title });
    if (!movie) {
      return res.status(400).send('Movie not found');
    }
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: movie._id } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(400).send('User not found');
    }
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
});

// User favorite movies delete requests -- changed from using movie _id to Title to be more intuitive/user-friendly
app.delete('/users/:Username/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movies.findOne({ Title: req.params.Title });
    if (!movie) {
      return res.status(400).send('Movie not found');
    }
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: movie._id } },
      { new: true }
    );
    if (!updatedUser) {
      res.status(400).send( {message: `Movie ${req.params.Title} was not found in the favorite list of ${req.params.Username}` });
    } else {
      res.status(200).send({ message: `Movie ${req.params.Title} was deleted from the favorite list of ${req.params.Username}` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
});

// User account delete requests
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await Users.findOneAndDelete({ Username: req.params.Username }); // Mongoose 8.3.4: ./findOneandRemove() is deprecated
    if (!user) {
      res.status(400).send({ message: `${req.params.Username} was not found` });
    } else {
      res.status(200).send({ message: `${req.params.Username} was deleted.` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
});

// Global Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'An error occurred!' });
});

// Server listening
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
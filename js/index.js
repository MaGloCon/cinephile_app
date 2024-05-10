//Import third-party modules
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require("mongoose");

// Import local modules
const Models = require("./models.js");

// Retrieve individual models from the Models object
const Movies = Models.Movie;
const Users = Models.User;

// Initialize Express application
const app = express();

// Apply middleware
app.use(morgan('common'));
app.use(bodyParser.json());

const auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');

//Connect to local MongoDB database and log connection status
mongoose.connect('mongodb://localhost:27017/cfDB');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to cfDB database");
});

app.use('/documentation', express.static('public', {index: 'documentation.html'}));

app.get('/', (req, res) => {
    res.send('Welcome to Cinephile!');
})

// Retrieving all movies
app.get('/movies',
passport.authenticate('jwt', { session: false }),
async (req, res) => {
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
      return res.status(404).send({ message: 'No movies found.' });
    }
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error retrieving movies' });
  }
});

// Retrieving all details of a specific movie
app.get('/movies/:title',
passport.authenticate('jwt', { session: false }),
async (req, res) => {
  const { title } = req.params;
  try {
    const movie = await Movies.findOne({ Title: title });
    if (!movie) {
      return res.status(400).send({ message: `The movie "${title}" couldn't be found.` });
    }
    res.status(200).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error retrieving movie: ${title}` });
  }
});

// Retrieving details of a specific genre
app.get('/movies/genre/:name',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const  { name } = req.params;
    try {
      const movie = await Movies.findOne({ 'Genre.Name': name }, { 'Genre.$': 1 });
      if (!movie || !movie.Genre || movie.Genre.length === 0) {
        return res.status(400).send({ message: `The "${genre}" genre couldn't be found` });
      }
      res.status(200).json(movie.Genre[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message:`Error retrieving genre: ${genre}` });
  }
});

// Retrieving all genres of a specific movie
app.get('/movies/:title/genre', 
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { title } = req.params;
    try {
      const movie = await Movies.findOne({ Title: title });
      if (!movie || !movie.Genre || movie.Genre.length === 0) {
        return res.status(400).send({ message: `The movie "${title}" could not be found or it does not have a genre` });
      }
      res.status(200).json(movie.Genre);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message:`Error retrieving genre(s) for movie: ${title}` });
    }
});

// Retrieving details of a specific director
app.get('/movies/director/:name', 
passport.authenticate('jwt', { session: false }),
async (req, res) => {
  const  { name } = req.params;
  try {
    const movie = await Movies.findOne({ 'Director.Name': name });
    if (!movie || !movie.Director) {
      return res.status(400).send({ message: `${name} could not be found.` });
    }
    res.status(200).json(movie.Director);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error retrieving director: ${name}` });
  }
});

// Retrieving director(s) of a specific movie
app.get('/movies/:title/director',
passport.authenticate('jwt', { session: false }),
async (req, res) => {
  const { title } = req.params;
  try {
    const movie = await Movies.findOne({ Title: title });
    if (!movie || !movie.Director || movie.Director.length === 0) {
      return res.status(400).send({ message: `The movie "${title}" could not be found or it does not have a director`});
    }
    res.status(200).json(movie.Director);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error retrieving director(s) for movie: ${title}`);
  }
});

// Retrieving all users
app.get('/users',
passport.authenticate('jwt', { session: false }),
async (req, res) => {
  try {
    const users = await Users.find();
    res.status(201).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
});

// Retrieving a single user
app.get('/users/:Username',
passport.authenticate('jwt', { session: false }),
async (req, res) => {
  try {
    const user = await Users.findOne({ Username: req.params.Username });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
});

//User registration requests -- adding a new user
app.post('/users', async (req, res) => {
  try {
    const user = await Users.findOne({ Username: req.body.Username });
    if (user) {
      return res.status(400).send({ message: `${req.body.Username} already exists` });
    } else {
      const newUser = await Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      });
      res.status(201).json(newUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: `Error: ${err}` });
  }
});

// User profile/account update requests
app.put('/users/:Username',
passport.authenticate('jwt', { session: false }),
async (req, res) => {
  if(req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  try {
    const updatedUser = await Users.findOneAndUpdate({ Username: req.params.Username }, 
      { $set:
        {
          Username: req.body.Username,
          Password: req.body.Password,
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
  
// User favorite movies add requests
app.post('/users/:Username/movies/:MovieID',
passport.authenticate('jwt', { session: false }),
async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate({ Username: req.params.Username }, 
      {
       $push: { FavoriteMovies: req.params.MovieID }
      },
      { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
});

// User favorite movies update requests
app.put('/users/:Username/movies/:OldMovieID/:NewMovieID',
passport.authenticate('jwt', { session: false }),
async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username, FavoriteMovies: req.params.OldMovieID },
      { $set: { "FavoriteMovies.$": req.params.NewMovieID } },
      { new: true }
    );
    if (!updatedUser) {
      res.status(400).send({ message: `Movie ${req.params.OldMovieID} was not found in the favorite list of ${req.params.Username}` });
    } else {
      res.status(200).send({ message: `Movie ${req.params.OldMovieID} was updated to ${req.params.NewMovieID} in the favorite list of ${req.params.Username}`});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
});

// User favorite movies delete requests
app.delete('/users/:Username/movies/:MovieID',
passport.authenticate('jwt', { session: false }),
async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    );
    if (!updatedUser) {
      res.status(400).send('Movie ' + req.params.MovieID + ' was not found in the favorite list of ' + req.params.Username);
    } else {
      res.status(200).send('Movie ' + req.params.MovieID + ' was deleted from the favorite list of ' + req.params.Username);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
});

// User account delete requests
app.delete('/users/:Username',
passport.authenticate('jwt', { session: false }),
async (req, res) => {
  try {
    const user = await Users.findOneAndDelete({ Username: req.params.Username });
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
});

// Global Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'An error occurred!', error: err.stack });
});

// Server listening
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});


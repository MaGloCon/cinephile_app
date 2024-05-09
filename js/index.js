//Import third-party modules
const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      mongoose = require("mongoose"),
      uuid = require('uuid');

// Import local modules
const Models = require("./models.js");

// Retrieve individual models from the Models object
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Director = Models.Director;

// Initialize Express application
const app = express();

// Apply middleware
app.use(morgan('common'));
app.use(bodyParser.json());

//Connect to local MongoDB database and log connection status
mongoose.connect('mongodb://localhost:27017/cfDB');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to cfDB database");
});

// Serve documentation.html (static)
app.use('/documentation', express.static('public', {index: 'documentation.html'}));

// Get homepage
app.get('/', (req, res) => {
    res.send('Welcome to Cinephile!');
})

// Get all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movies.find();
    if (!movies || movies.length === 0) {
      return res.status(404).send('No movies found');
    }
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while trying to retrieve the movies');
  }
});

// Get a single movie by title
app.get('/movies/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const movie = await Movies.findOne({Title: title});
    if (!movie) {
      return res.status(400).send('no such movie');
    }
    res.status(200).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while trying to retrieve the movie');
  }
});

//Get all movies of a specific genre -- res: array of movies
app.get('/movies/genre/:Name/movies', async (req, res) => {
  const { Name } = req.params;
  try {
    const movies = await Movies.find({ 'Genre.Name': Name });
    if (!movies || movies.length === 0) {
      return res.status(400).send('No movies found in this genre');
    }
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while trying to retrieve the movies');
  }
});

// Get details (name & description) of a specific Genre by Genre Name -- res: genre object
app.get('/movies/genre/:name', async (req, res) => {
  const  { name } = req.params;
  try {
    const movie = await Movies.findOne({ 'Genre.Name': name }, {'Genre.$': 1});
    if (!movie || !movie.Genre || movie.Genre.length === 0) {
      return res.status(400).send('no such genre');
    }
    res.status(200).json(movie.Genre[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while trying to retrieve the genre');
  }
});

// Get all genres of a specific movie by title
app.get('/movies/:title/genre', async (req, res) => {
  const { title } = req.params;
  try {
    const movie = await Movies.findOne({Title: title});
    if (!movie || !movie.Genre || movie.Genre.length === 0) {
      return res.status(400).send('No such movie or the movie does not have a genre');
    }
    res.status(200).json(movie.Genre);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while trying to retrieve the genres');
  }
});

// Get all movies directed by a specific director -- res: array of movies
app.get('/movies/director/:name/movies', async (req, res) => {
  const { name } = req.params;
  try {
    const movies = await Movies.find({ 'Director.Name': name });
    if (!movies || movies.length === 0) {
      return res.status(400).send('No movies found from this director');
    }
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while trying to retrieve the movies');
  }
});

// Get details (name & description) of a specific director by Name -- res: director object
app.get('/movies/director/:name', async (req, res) => {
  const  { name } = req.params;
  try {
    const movie = await Movies.findOne({ 'Director.Name': name });
    if (!movie || !movie.Director) {
      return res.status(400).send('no such director');
    }
    res.status(200).json(movie.Director);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while trying to retrieve the director');
  }
});

// Get director by movie title -- res: array of director objects
app.get('/movies/:title/director', async (req, res) => {
  const { title } = req.params;
  try {
    const movie = await Movies.findOne({Title: title});
    if (!movie || !movie.Director || movie.Director.length === 0) {
      return res.status(400).send('No such movie or the movie does not have a director');
    }
    res.status(200).json(movie.Director);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while trying to retrieve the director(s)');
  }
});

// Get movies by language -- res: array of movies
app.get('/movies/language/:language', async (req, res) => {
  const { language } = req.params;
  try {
    const movies = await Movies.find({Languages: {$in: [language]}});
    if (!movies || movies.length === 0) {
      return res.status(400).send('No movies found in this language');
    }
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while trying to retrieve the movies');
  }
});

// Get movies by country -- res: array of movies
app.get('/movies/country/:country', async (req, res) => {
  const { country } = req.params;
  try {
    const movies = await Movies.find({Countries: {$in: [country]}});
    if (!movies || movies.length === 0) {
      return res.status(400).send('No movies found from this country');
    }
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while trying to retrieve the movies');
  }
});

//Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await Users.find();
    res.status(201).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Get a user by username
app.get('/users/:Username', async (req, res) => {
  try {
    const user = await Users.findOne({ Username: req.params.Username });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

//Add a new user
app.post('/users', async (req, res) => {
  try {
    const user = await Users.findOne({ Username: req.body.Username });
    if (user) {
      return res.status(400).send(req.body.Username + ' already exists');
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
    res.status(500).send('Error: ' + error);
  }
});

// Update a user's info, by username
app.put('/users/:Username', async (req, res) => {
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
    res.status(500).send('Error: ' + err);
  }
});
  
// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate({ Username: req.params.Username }, 
      {
       $push: { FavoriteMovies: req.params.MovieID }
      },
      { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Update a movie in a user's list of favorites
app.put('/users/:Username/movies/:OldMovieID/:NewMovieID', async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username, FavoriteMovies: req.params.OldMovieID },
      { $set: { "FavoriteMovies.$": req.params.NewMovieID } },
      { new: true }
    );
    if (!updatedUser) {
      res.status(400).send('Movie ' + req.params.OldMovieID + ' was not found in the favorite list of ' + req.params.Username);
    } else {
      res.status(200).send('Movie ' + req.params.OldMovieID + ' was updated to ' + req.params.NewMovieID + ' in the favorite list of ' + req.params.Username);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Remove a movie from a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
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
    res.status(500).send('Error: ' + err);
  }
});

// Remove a user by Username
app.delete('/users/:Username', async (req, res) => {
  try {
    const user = await Users.findOneAndDelete({ Username: req.params.Username });
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Global Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('An error occurred!');
});

// Start server and Listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});

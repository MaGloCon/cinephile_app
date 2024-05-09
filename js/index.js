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
app.get('/movies', (req, res) => {
  Movies.find()
    .then(movies => {
      if (!movies || movies.length === 0) {
        return res.status(404).send('No movies found');
      }
      res.status(200).json(movies);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('An error occurred while trying to retrieve the movies');
    });
});

// Get a single movie by title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  Movies.findOne({Title: title})
    .then(movie => {
      if (!movie) {
        return res.status(400).send('no such movie');
      }
      res.status(200).json(movie);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('An error occurred while trying to retrieve the movie');
    });
});

// Get genre by name
app.get('/movies/genre/:name', (req, res) => {
  const { name } = req.params;
  Movies.find()
    .then(movies => {
      if (!movies || movies.length === 0) {
        return res.status(404).send('No movies found');
      }
      let foundGenre = null;
      for(let movie of movies) {
        for(let genre of movie.Genre) {
          if (genre.Name === name) {
            foundGenre = genre;
            break;
          }
        }
        if(foundGenre) break;
      }
      if (!foundGenre) {
        return res.status(400).send('no such genre');
      }
      res.status(200).json(foundGenre);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('An error occurred while trying to retrieve the genre');
    });
});

// Get director by name 
app.get('/movies/Director/:Name', (req, res) => {
  const  { Name } = req.params;
  Movies.findOne({ 'Director.Name': Name })
    .then(movie => {
      if (!movie || !movie.Director) {
        return res.status(400).send('no such director');
      }
      res.status(200).json(movie.Director);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('An error occurred while trying to retrieve the director');
    });
});

//Get all users
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add a new user
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update a user's info, by username
app.put('/users/:Username', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, 
    { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    }, { new: true })

  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })

});
  
// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, 
    {
     $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }) 
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Remove a movie from a user's list of favorites
app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
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

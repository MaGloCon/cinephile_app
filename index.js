const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require("mongoose");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
 
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

const passport = require('passport');
require('./config/passport.js');
const auth = require('./config/auth.js')(app); 

app.use('/documentation', express.static('public', {index: 'documentation.html'})); 


app.get('/', (req, res) => { res.status(200).send('Welcome to Cinephile!');});


app.get('/movies', movies.readAll);
app.get('/movies/search', movies.search);
app.get('/movies/featured', movies.readFeatured);
app.get('/movies/:title', movies.read);
app.get('/movies/genre/:name', movies.readGenre);
app.get('/movies/:title/genre', movies.readGenreByTitle);
app.get('/movies/director/:name', movies.readDirector);
app.get('/movies/:title/director', movies.readDirectorByTitle);

const authenticate = passport.authenticate('jwt', { session: false });

app.post('/users/signup', users.create);
app.post('/logout', (req, res) => { 
  req.logout();
  res.status(200).send('Logged out');
});
app.get('/users', users.readAll);
app.get('/users/search/id/:id', users.readById);
app.get('/users/search/username/:username', users.readByUsername);
app.get('/users/profile/me', authenticate, users.me); 
app.post('/users/profile/update', authenticate, users.update); 
app.delete('/users/profile/delete', authenticate, users.delete);
app.post('/users/:Username/movies/:title', authenticate, users.addFavoriteMovie);
app.delete('/users/:Username/movies/:title', authenticate, users.deleteFavoriteMovie);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'An error occurred!' });
});

app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
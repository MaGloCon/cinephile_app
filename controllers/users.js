
const { check, validationResult } = require('express-validator');

const { Movies, Users } = require('../models/models');

module.exports = {};

module.exports.create = [
  check('Username', 'Username is required').isLength({min: 5}), 
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(), 
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail(),
  check('Birthday', 'Birthday is required').not().isEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req); 
      
      if (!errors.isEmpty()) {  
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
  }
];

module.exports.readAll = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(201).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
};

module.exports.readById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
}

module.exports.readByUsername = async (req, res) => {
  try {
    const user = await Users.findOne(req.params.Username);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
};

module.exports.me = async (req, res) => {
  try {
    const user = await Users.findOne({ Username: req.user.Username });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }

}
// User account update requests
module.exports.update = [
  check('Username').isEmail(),
  check('Password').isLength({ min: 5 }),
  check('Email').isEmail(),
  check('Birthday').isDate(),
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
  }
];


module.exports.addFavoriteMovie = async (req, res) => {
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
};

module.exports.deleteFavoriteMovie = async (req, res) => {
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
};

module.exports.delete = async (req, res) => {
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
};
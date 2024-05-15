
const { check, validationResult } = require('express-validator');

const { Movie, User } = require('../models/models');

module.exports = {};

module.exports.create = [
  check('Username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({min: 5, max: 20}).withMessage('Username must be between 5 and 20 characters long')
    .isAlphanumeric().withMessage('Username contains non alphanumeric characters - not allowed'),
  check('Password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 5 characters long')
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
    .isDate().withMessage('Birthday must be a valid date'),
  async (req, res) => {
    try {
      const errors = validationResult(req); 
      if (!errors.isEmpty()) {  
        return res.status(422).json({ errors: errors.array() });
      }

      const hashedPassword = User.hashPassword(req.body.Password); 
      const existingUser = await User.findOne({ Username: req.body.Username }); //Check if a user already exists with the requested username

      if (existingUser) {
        return res.status(400).send(`${req.body.Username} already exists`);
      } else { //If the user does not exist, create a new user
        const user = await User.create({
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
    const users = await User.find();
    res.status(201).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
};

module.exports.readById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
}

module.exports.readByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ Username: req.params.username });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
};

module.exports.me = async (req, res) => {
  try {
    const user = await User.findOne({ Username: req.user.Username });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
};

// User account update requests
module.exports.update = [
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
    .isDate().withMessage('Birthday must be a valid date'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if(req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied'); //use 403 for forbidden?
    }
    try {
      const hashedPassword = User.hashPassword(req.body.Password);
      const updatedUser = await User.findOneAndUpdate({ Username: req.params.Username }, 
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

module.exports.delete = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ Username: req.params.Username }); // Mongoose 8.3.4: ./findOneandRemove() is deprecated
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


module.exports.addFavoriteMovie = async (req, res) => {
  try {
    const movie = await Movies.findOne({ Title: req.params.Title });
    if (!movie) {
      return res.status(400).send('Movie not found');
    }
    const updatedUser = await User.findOneAndUpdate(
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
    const updatedUser = await User.findOneAndUpdate(
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


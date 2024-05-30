
const { Movie, User } = require('../models/models');
const { validationResult } = require('express-validator');


module.exports = {};

module.exports.create = async (req, res) => {
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
  };

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
module.exports.update = 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if(req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied'); 
    }
    try {
      let userData= {
        Username: req.body.Username,
        Email: req.body.Email,
        Birthday: req.body.Birthday  
      }
      
      if (req.body.Password) {
        userData.Password = User.hashPassword(req.body.Password);
      }

      const updatedUser = await User.findOneAndUpdate({ Username: req.params.Username }, 
        { $set: userData }, { new: true });
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Error: ${err}` });
    }
  };

module.exports.delete = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Mongoose 8.3.4: ./findOneandRemove() is deprecated
    if (!user) {
      res.status(400).send({ message: `User with id ${req.params.id} was not found` });
    } else {
      res.status(200).send({ message: `User with id ${req.params.id} was deleted.` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error: ${err}` });
  }
};


module.exports.addFavoriteMovie = async (req, res) => {
  try {
    const movie = await Movie.findOne({ Title: { $regex: new RegExp(`^${req.params.title}$`, 'i') } });
    if (!movie) {
      return res.status(400).send('Movie not found');
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
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

module.exports.removeFavoriteMovie = async (req, res) => {
  try {
    const movie = await Movie.findOne({ Title: { $regex: new RegExp(`^${req.params.title}$`, 'i') } });
    if (!movie) {
      return res.status(400).send('Movie not found');
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { FavoriteMovies: movie._id } },
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


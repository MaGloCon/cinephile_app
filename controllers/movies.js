const { Movie } = require('../models/models.js');
const mongoose = require('mongoose');
module.exports = {};

module.exports.readAll = async (req, res) => {
  try {
    const movies = await Movie.find();
    if (!movies || movies.length === 0) {
      return res.status(404).send({ message: 'No movies found' });
    }

    res.status(200).json(movies);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'An error occurred while retrieving movies' });
    }
};

module.exports.search = async (req, res) => {
  try {
    const query = {};
    const searchableFields = ['Title', 'Year', 'Countries', 'Languages', 'Genre.Name', 'Director.Name']
  
    for (const key in req.query) {
      if (searchableFields.includes(key)) {
        query[key] = new RegExp(req.query[key], 'i');// Reg
      }
    }

    if (req.query.decade) {
      const startYear = req.query.decade.substring(0, 4); // allows searchs with/without 's' at the end (ex. 1990 or 1990s)
      const endYear = (parseInt(startYear) + 9).toString();
      query.Year = {
        $gte: startYear,
        $lte: endYear
      };
    }

    const movies = await Movie.find(query);
    if (!movies || movies.length === 0) {
      return res.status(404).send({ message: 'An error occurred while retrieving movies' });
    }

    res.status(200).json(movies); 
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while processing your request' });
  }
};

module.exports.read = async (req, res) => {
  const { title } = req.params;
  try {
    const movies = await Movie.findOne({ Title: title });
    if (!movies) {
      return res.status(404).send({ message: `The movie "${title}" couldn't be found.` });
    }
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error retrieving movie: ${title}` });
  }
};

module.exports.readGenre = async (req, res) => {
  const { name } = req.params;
  try {
    const movie = await Movie.findOne({ 'Genre.Name': name }, { 'Genre.$': 1 });
    if (!movie || !movie.Genre || movie.Genre.length === 0) {
      return res.status(404).send({ message: `The genre could not be found` });
    }
    res.status(200).json(movie.Genre[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message:`Error retrieving genre: ${genre}` });
  }
};

module.exports.readGenreByTitle = async (req, res) => {
  const { title } = req.params;
  try {
    const movie = await Movie.findOne({ Title: title });

    if (!movie || !movie.Genre || movie.Genre.length === 0) {
      return res.status(404).send({ message: `The movie could not be found or it does not have a genre` });
    }

    res.status(200).json(movie.Genre);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message:`Error retrieving genre(s) for movie: ${title}` });
  };
};

module.exports.readDirector = async (req, res) => {
  const  { name } = req.params;
  try {
    const movie = await Movie.findOne({ 'Director.Name': name });
    if (!movie || !movie.Director) {
      return res.status(404).send({ message: `The director could not be found.` });
    }
    res.status(200).json(movie.Director);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error retrieving director: ${name}` });
  }
};

module.exports.readDirectorByTitle = async (req, res) => {
  const { title } = req.params;
  try {
    const movie = await Movie.findOne({ Title: title });
    if (!movie || !movie.Director || movie.Director.length === 0) {
      return res.status(404).send({ message: `The movie could not be found or it does not have a director`});
    }
    res.status(200).json(movie.Director);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error retrieving director(s) for: ${title}`);
  }
};

module.exports.readFeatured = async (req, res) => {
  try {
    const movies = await Movie.find({ Featured: true });
    if (!movies || movies.length === 0) {
      return res.status(404).send({ message: 'No featured movies found' });
    }

    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while retrieving featured movies' });
  }
};
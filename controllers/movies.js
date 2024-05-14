const Movies = require('../models/models.js');

module.exports = {};

module.exports.readAll = async (req, res) => {
  try {
    const movies = await Movies.find();
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
      const startYear = parseInt(req.query.decade);
      const endYear = startYear + 9;
      query.year = {
        $gte: startYear.toString(),
        $lte: endYear.toString()
      };
    }
    const movies = await Movies.find(query).sort(req.query);
    if (!movies || movies.length === 0) {
      return res.status(404).send({ message: 'An error occurred while retrieving movies' });
    }

    res.status(200).json(movies); 
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error) {
      res.status(500).send({ message: 'An error occurred while searching the database' });

    } else {
      res.status(500).send({ message: 'An unknown error occurred' });
    }
  }
};

module.exports.read = async (req, res) => {
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
};

module.exports.readGenre = async (req, res) => {
  const { name } = req.params;
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
};

module.exports.readGenreByTitle = async (req, res) => {
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
  };
};

module.exports.readDirector = async (req, res) => {
  const  { directorName } = req.params;
  try {
    const movie = await Movies.findOne({ 'Director.Name': directorName });
    if (!movie || !movie.Director) {
      return res.status(404).send({ message: `The director could not be found.` });
    }
    res.status(200).json(movie.Director);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Error retrieving director: ${directorName}` });
  }
};

module.exports.readDirectorByTitle = async (req, res) => {
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
};

module.exports.readFeatured = async (req, res) => {
  try {
    const movies = await Movies.find({ Featured: true });
    if (!movies || movies.length === 0) {
      return res.status(404).send({ message: 'No featured movies found' });
    }
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error retrieving featured movies' });
  }
}

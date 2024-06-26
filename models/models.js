const mongoose = require("mongoose"),
  bcrypt = require('bcrypt');

const movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    TitleOrigin: [String],
    Year: { type: String, required: true },
    Countries: [{ type: String, required: true}],
    Languages: [{ type: String, required: true}],
    Genre: [{
      Name: String,
      Description: String
    }],
    Director: [{
      Name: String,
      Bio: String,
      Birth: String,
      Death: String
    }],
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

const userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

const Movies = mongoose.model("Movie", movieSchema);
const Users = mongoose.model("User", userSchema);

module.exports.Movie = Movies;
module.exports.User = Users;
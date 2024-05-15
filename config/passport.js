const passport = require('passport'),
  LocalStrategy = require('passport-local'),
  Models = require('../models/models.js'),
  passportJWT = require('passport-jwt');


const Users = Models.User, 
  JWTStrategy = passportJWT.Strategy, 
  ExtractJWT = passportJWT.ExtractJwt; 


//Define basic HTTP authentication for login requests
passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      await Users.findOne({ Username: username })
      .then((user) => {
        if (!user) {
          console.log('incorrect username');
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }
        if (!user.validatePassword(password)) {
          console.log('incorrect password');
          return callback(null, false, { message: 'Incorrect password.' });
        }
        console.log('finished');
        return callback(null, user);
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          return callback(error);
        }
      })
    }
  )
);
//Use JWTStrategy for JWT-based authentication 
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //bearer token is a type of access token
  secretOrKey: 'CinephileSecret'
}, async (jwtPayload, callback) => {
  try {
    const user = await Users.findById(jwtPayload._id);
    return callback(null, user);
  } catch (error) {
    return callback(error);
  }
}));
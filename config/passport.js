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
      passwordField: 'Password'
    },
    async (username, password, callback) => { 
      console.log(`${username} ${password}`); 
      try {
        const user = await Users.findOne({ Username: username }); 
        if (!user) {
          console.log('incorrect username');
          return callback(null, false, { //null is for an error, false is for no user
            message: 'Incorrect username or password.',
          });
        }
        console.log('finished');
        return callback(null, user); //null is for an error, user is for a successful login
      } catch (error) {
        console.log(error);
        return callback(error); 
      }
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
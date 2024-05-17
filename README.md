# Cinephile API

## Introduction

Cinephile API is a RESTful API designed for movie enthusiasts. It provides endpoints for retrieving and manipulating data about movies, genres, directors, and users.

## Table of Contents
- Requirements
- Modules
- Installation


## Requirements

- node.js (version 14 or later)
- MongoDB (version 4.4 or later)
- npm (version 6 or later)

## Modules
### Recommended Modules:
- Express.js: for building the API
- Mongoose: for MongoDB object modeling
- body-parser: for parsing incoming request bodies
- bcrypt: A library for hashing passwords.
- body-parser: Node.js body parsing middleware.
- cors: Middleware that can be used to enable CORS with various options.
- express: Fast, unopinionated, minimalist web framework for Node.js
- express-validator: An express.js middleware for validator.
- jsonwebtoken: An implementation of JSON Web Tokens.
- mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.
- morgan: HTTP request logger middleware for Node.js
- passport: Express-compatible authentication middleware for Node.js.
- passport-jwt: Passport strategy for authenticating with a JSON Web Token.
- passport-local: Passport strategy for authenticating with a username and password.

### Optional:

- - morgan: HTTP request logger middleware for Node.js
- nodemon: A tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.


## Installation

Follow these steps to get the Cinephile App up and running on your local machine:

1. Clone the repository

    Use the following command to clone this repository:

        git clone https://github.com/yourusername/cinephile_app.git

2. Navigate to the project directory

    Change your current directory to the project's directory:

        cd cinephile_app
3. Install the dependencies

    Use npm to install the dependencies listed in the package.json file:

        npm install

4. Start the server

    Use the following command to start the server:
        
        npm start

    If you want to start the server with nodemon (which will automatically restart the server whenever you make changes to your files), use the following command:
        
        npm run dev

Now, the Cinephile App should be running on your local machine. You can access it by navigating to http://localhost:8080 in your web browser.
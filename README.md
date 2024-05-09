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
- uuid: for generating unique identifiers

### Optional:

- morgan: for HTTP request logging
- nodemon: for automatic reloading during development

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
const express = require('express');
morgan = require('morgan');

// Initialize Express application
const app = express();

// Apply Morgan logging Middleware
app.use(morgan('common'));
    
// Film data
let films = [
    {
    titleEn: 'The Scent of Pomegranates',
    titleOrig: 'Nran guyne',
    director: 'Teimour Birashvili',
    country: ['Soviet Union', 'Armenia'],
    languages: 'Armenian',
    year: '1969',
    genre: 'Drama',
    },
    {
    titleEn: 'The Witch',
    titleOrig: 'The Witch',
    director: 'Robert Eggers',
    country: 'United States',
    languages: 'English',
    year: '2015',
    genre: 'Horror',
    },
    {
    titleEn: 'Whiplash',
    titleOrig: 'Whiplash',
    director: 'Damien Chazelle',
    country: 'United States',
    languages: 'English',
    year: '2014',
    genre: 'Drama',
    },
    {
    titleEn: 'The Death of Stalin',
    titleOrig: 'The Death of Stalin',
    director: 'Armando Iannucci',
    country: 'United Kingdom',
    languages: 'English',
    year: '2017',
    genre: 'Comedy',
    },
    {
    titleEn: 'The Handmaiden',
    titleOrig: 'Ah-ga-ssi',
    director: 'Park Chan-wook',
    country: 'South Korea',
    languages: 'Korean',
    year: '2016',
    genre: 'Drama',
    },
    {
    titleEn: 'The Great Beauty',
    titleOrig: 'La Grande Bellezza',
    director: 'Paolo Sorrentino',
    country: 'Italy',
    languages: 'Italian',
    year: '2013',
    genre: 'Drama',
    },
    {
    titleEn: 'El Topo',
    titleOrig: 'El topo',
    director: 'Alejandro Jodorowsky',
    country: ['Mexico', 'United States'],
    languages: 'Spanish',
    year: '1970',
    genre: 'Drama',
    },
    {
    titleEn: 'Suspiria',
    titleOrig: 'Suspiria',
    director: 'Dario Argento',
    country: 'Italy',
    languages: ['Italian', 'German', 'Russian', 'English'],
    year: '1977',
    genre: 'Horror',
    },
    {
    titleEn: 'Metropolis',
    titleOrig: 'Metropolis',
    director: 'Fritz Lang',
    country: 'Germany',
    languages: ['Silent','German'],
    year: '1927',
    genre: 'Drama',
    },
    {
    titleEn: 'Black Orpheus',
    titleOrig: 'Orfeau Negro',
    director: 'Marcel Camus',
    country: ['Brazil', 'France', 'Italy'],
    languages: 'Portuguese',
    year: '1959',
    genre: 'Drama',
    },
];

// Serve documentation.html from public directory
app.use('/documentation', express.static('public', {index: 'documentation.html'}));

// Define route for homepage
app.get('/', (req, res) => {
    res.send('Welcome to Cinephile!');
});

// Define route to fetch film data
app.get('/films', (req, res) => {
    res.json(films);
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('An error occurred!');
});

// Start server and Listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});


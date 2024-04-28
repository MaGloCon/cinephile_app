const express = require('express');
const app = express();

let films = [
    {
    titleEn: 'The Scent of Pomegranates',
    titleOrig: 'Nran guyne',
    director: 'Teimour Birashvili',
    country: 'Soviet Union',
    languages: 'Georgian',
    year: '1969',
    duration: '74 min',
    genre: 'Drama',
    },
    {
    titleEn: 'The Witch',
    titleOrig: 'The Witch',
    director: 'Robert Eggers',
    country: 'United States',
    languages: 'English',
    year: '2015',
    duration: '92 min',
    genre: 'Horror',
    },
    {
    titleEn: 'Whiplash',
    titleOrig: 'Whiplash',
    director: 'Damien Chazelle',
    country: 'United States',
    languages: 'English',
    year: '2014',
    duration: '106 min',
    genre: 'Drama',
    },
    {
    titleEn: 'The Death of Stalin',
    titleOrig: 'The Death of Stalin',
    director: 'Armando Iannucci',
    country: 'United Kingdom',
    languages: 'English',
    year: '2017',
    duration: '107 min',
    genre: 'Comedy',
    },
    {
    titleEn: 'The Handmaiden',
    titleOrig: 'Ah-ga-ssi',
    director: 'Park Chan-wook',
    country: 'South Korea',
    languages: 'Korean',
    year: '2016',
    duration: '145 min',
    genre: 'Drama',
    },
    {
    titleEn: 'The Great Beauty',
    titleOrig: 'La Grande Bellezza',
    director: 'Paolo Sorrentino',
    country: 'Italy',
    languages: 'Italian',
    year: '2013',
    duration: '142 min',
    genre: 'Drama',
    },
    {
    titleEn: 'El Topo',
    titleOrig: 'El topo',
    director: 'Alejandro Jodorowsky',
    country: ['Mexico', 'United States'],
    languages: 'Spanish',
    year: '1970',
    duration: '125 min',
    genre: 'Drama',
    },
    {
    titleEn: 'Suspiria',
    titleOrig: 'Suspiria',
    director: 'Dario Argento',
    country: 'Italy',
    languages: ['Italian', 'German', 'Russian', 'English'],
    year: '1977',
    duration: '98 min',
    genre: 'Horror',
    },
    {
    titleEn: 'Metropolis',
    titleOrig: 'Metropolis',
    director: 'Fritz Lang',
    country: 'Germany',
    languages: ['Silent','German'],
    year: '1927',
    duration: '153 min',
    genre: 'Drama',
    },
    {
    titleEn: 'Black Orpheus',
    titleOrig: 'Orfeau Negro',
    director: 'MArcel Camus',
    country: ['Brazil', 'France', 'Italy'],
    languages: 'Portuguese',
    year: '1959',
    duration: '',
    genre: 'Drama',
    },
];

//GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my film site!');
});

app.get('documentation.html', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/films', (req, res) => {
    res.json(films);
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

    
// Initialize Express application
const app = express();

// Apply Morgan logging Middleware
app.use(morgan('common'));

// Apply body-parser Middleware
app.use(bodyParser.json());

// Film data
let movies = [
    {
    id: '1',
    title: 'The Color of Pomegranates',
    title_org: 'Nran guyne',
    imgURL: '#',
    description: 'This avant-garde film by Russian director Sergei Parajanov depicts the life of revered the 18th-century Armenian poet and musician Sayat-Nova (Vilen Galstyan).',
    release: {
        year: '1969',
        month: '9',
        day: '1'
    },
    country: ['Soviet Union', 'Armenia'],
    language: 'Armenian',
    genre: {
      genreName: 'Drama',
      genreDescription: 'The Drama genre in film is a genre that relies on the emotional and relational development of realistic characters. While Drama film relies heavily on this kind of development, dramatic themes play a large role in the plot as well. Often, these dramatic themes are taken from intense, real life issues. Whether heroes or heroines are facing a conflict from the outside or a conflict within themselves, Drama film aims to tell an honest story of human struggles.',
    },
    director: {
        name: 'Sergei Parajanov',
        bio: 'Sergei Iosifovich Parajanov was an Armenian film director and screenwriter. Parajanov is regarded by film critics, film historians and filmmakers to be one of the greatest and most influential filmmakers in cinema history.',
        dob: 'January 9, 1924',
        dod: 'July 20, 1990',
    },
    featured: true,
    },
    {
    id: '2',
    title: 'The Witch',
    title_org: 'The Witch',
    imgURL: '#',
    description: 'A family in 1630s New England is torn apart by the forces of witchcraft, black magic, and possession.',
    release: {
        year: '2015',
        month: '2',
        day: '19',
    },
    country: 'United States',
    language: 'English',
    genre: {
      genreName: 'Horror',
      genreDescription: 'The Horror genre in cinema is characterized by the presence of monsters, ghosts, or other supernatural elements. Horror films often feature scenes that startle the viewer, and the genre is often associated with the macabre and the supernatural. Horror films are designed to elicit fear and terror from the audience, and they often feature scenes that are designed to shock or scare the viewer.',
    },
      director: {
        name: 'Robert Eggers',
        bio: 'Robert Houston Eggers is an American filmmaker and production designer. He is best known for writing and directing the historical horror films The Witch and The Lighthouse, as well as directing and co-writing the historical fiction epic film The Northman. ',
        dob: 'July 7, 1983',
        dod: 'alive',
    },
    featured: false,
    },
    {
    id: '3',
    title: 'Whiplash',
    title_org: 'Whiplash',
    imgURL: '#',
    description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.',
    release: {
        year: '2014',
        month: '10',
        day: '15'
    },
    country: 'United States',
    language: 'English',
    genre: {
      genreName: 'Drama',
      genreDescription: 'The Drama genre in film is a genre that relies on the emotional and relational development of realistic characters. While Drama film relies heavily on this kind of development, dramatic themes play a large role in the plot as well. Often, these dramatic themes are taken from intense, real life issues. Whether heroes or heroines are facing a conflict from the outside or a conflict within themselves, Drama film aims to tell an honest story of human struggles.',
    },
    director: {
        name: 'Damien Chazelle',
        bio: 'Damien Sayre Chazelle is an American film director, producer, and screenwriter. He is best known for his films Whiplash and La La Land, for which he received several accolades, including the Golden Globe Award and the Academy Award for Best Director, making him the youngest person to win either award at the age of 32.',
        dob: 'January 19, 1985',
        dod: 'alive',
    },
    featured: false,
    },
    {
    id: '4',
    title: 'The Death of Stalin',
    title_org: 'The Death of Stalin',
    imgURL: '#',
    description: 'The internal political landscape of 1950\'s Soviet Russia takes on darkly comic form in a new film by Emmy award-winning and Oscar-nominated writer/director Armando Iannucci.',
    release: {
        year: '2017',
        month: '3',
        day: '29'
    },
    country: 'United Kingdom',
    language: 'English',
    genre: {
      genreName: 'Comedy',
      genreDescription: 'The Comedy genre in film is a genre that is designed to make the audience laugh. Comedies are light-hearted dramas, crafted to amuse, entertain, and provoke enjoyment. The comedy genre often exaggerates situations, language, action, and characters. Comedies can be satirical, slapstick, dark, or romantic.',
    },
    director: {
        name: 'Armando Iannucci',
        bio: 'Armando Giovanni Iannucci is a Scottish satirist, writer, director, and radio producer. Born in Glasgow to Italian parents, Iannucci studied at the University of Glasgow followed by the University of Oxford, leaving graduate work on a PhD about John Milton to pursue a career in comedy. ',
        dob: 'November 28, 1963',
        dod: 'alive',
    },
    featured: true,
    },
    {
    id: '5',
    title: 'Oppenheimer',
    title_org: 'Oppenheimer',
    imgURL: '#',
    description: 'A biopic of J. Robert Oppenheimer, the American theoretical physicist who is credited with the invention of the atomic bomb.',
    release: {
        year: '2023',
        month: '7',
        day: '20',
    },
    country: 'United States',
    language: 'English',
    genre: {
      genreName: 'Drama',
      genreDescription: 'The Drama genre in film is a genre that relies on the emotional and relational development of realistic characters. While Drama film relies heavily on this kind of development, dramatic themes play a large role in the plot as well. Often, these dramatic themes are taken from intense, real life issues. Whether heroes or heroines are facing a conflict from the outside or a conflict within themselves, Drama film aims to tell an honest story of human struggles.',
    },
    director: {
        name: 'Christopher Nolan',
        bio: 'Christopher Edward Nolan is a British-American film director, producer, and screenwriter. His films have grossed over $5 billion worldwide, and he is one of the highest-grossing directors in history. Having made his directorial debut with Following, Nolan gained considerable attention for his second feature, Memento, for which he received numerous accolades.',
        dob: 'July 30, 1970',
        dod: 'alive',
    },
    featured: false,
    },
    {
    id: '6',
    title: 'The Great Beauty',
    title_org: 'La Grande Bellezza',
    imgURL: '#',
    description: 'Jep Gambardella has seduced his way through the lavish nightlife of Rome for decades, but after his 65th birthday and a shock from the past, Jep looks past the nightclubs and parties to find a timeless landscape of absurd, exquisite beauty.',
    release: {
        year: '2013',
        month: '5',
        day: '21',
    },
    country: 'Italy',
    language: 'Italian',
    genre: {
        name: 'Drama',
        description: 'Drama',
    },
    director: {
        name: 'Paolo Sorrentino',
        bio: 'Paolo Sorrentino is an Italian film director, screenwriter, and writer. Sorrentino was born in Naples. His first film as screenwriter, The Dust of Naples, was released in 1998. He also began directing short movies, including L\'amore non ha confini in 1998 and La notte lunga in 2001.',
        dob: 'May 31, 1970',
        dod: 'alive',
    },
    featured: false,
    },
    {
    id: '7',
    title: 'El Topo',
    title_org: 'El Topo',
    imgURL: '#',
    description: 'The mysterious figure, El Topo, known as the best gunfighter in the west, plays two rival gunfighters against each other for his own amusement.',
    release: {
        year: '1970',
        month: '28',
        day: '2',
    },
    country: 'Mexico',
    language: 'Spanish',
    genre: 'Western',
    director: {
        name: 'Alejandro Jodorowsky',
        bio: 'Alejandro Jodorowsky Prullansky is a Chilean-French filmmaker. Since 1948, Jodorowsky has worked as a novelist, a storyteller, a poet, a playwright, an essayist, a film director and producer, an actor in cinematic and theatre productions, a theatre director, a screenwriter, a film editor, a comics writer, a musician and composer, a philosopher, a puppeteer, a mime, a psychologist and psychoanalyst, a draughtsman, a painter',
        dob: 'February 17, 1929',
        dod: 'alive',
    },
    featured: false,
    },
    {
    id: '8',
    title: 'Suspiria',
    title_org: 'Suspiria',
    imgURL: '#',
    description: 'A newcomer to a fancy ballet academy gradually comes to realize that the school is a front for something far more sinister and supernatural amidst a series of grisly murders.',
    release: {
        year: '1977',
        month: '2',
        day: '1',
    },
    country: 'Italy',
    language: 'English',
    genre: 'Horror',
    director: {
        name: 'Dario Argento',
        bio: 'Dario Argento is an Italian film director, producer, film critic and screenwriter. He is best known for his work in the horror film genre during the 1970s and 1980s, particularly in the subgenre known as giallo, and for his influence on modern horror films.',
        dob: 'September 7, 1940',
        dod: 'alive',
    },
    featured: true
    },
    {
    id: '9',
    title: 'Metropolis',
    title_org: 'Metropolis',
    imgURL: '#',
    description: 'In a futuristic city sharply divided between the working class and the city planners, the son of the city\'s mastermind falls in love with a working class prophet who predicts the coming of a savior to mediate their differences.',
    release: {
        year: '1927',
        month: '1',
        day: '10',
    },
    country: 'Germany',
    language: 'Silent',
    genre: {
      genreName: 'Drama',
      genreDescription: 'The Drama genre in film is a genre that relies on the emotional and relational development of realistic characters. While Drama film relies heavily on this kind of development, dramatic themes play a large role in the plot as well. Often, these dramatic themes are taken from intense, real life issues. Whether heroes or heroines are facing a conflict from the outside or a conflict within themselves, Drama film aims to tell an honest story of human struggles.',
    },
    director: {
        name: 'Fritz Lang',
        bio: 'Friedrich Christian Anton "Fritz" Lang was an Austrian-German-American filmmaker, screenwriter, and occasional film producer and actor. One of the best-known émigrés from Germany\'s school of Expressionism, he was dubbed the "Master of Darkness" by the British Film Institute.',
        dob: 'December 5, 1890',
        dod: 'August 2, 1976',
    },
    featured: true
    },
    {
    id: '10',
    title: 'Black Orpheus',
    title_org: 'Orfeau Negro',
    imgURL: '#',
    description: 'The romance of Orpheus and Eurydice, a popular mythic legend that has been retold in the beautiful love story of a taxi driver that ends up in a tragedy, during the carnival in Brazil.',
    release: {
        year: '1959',
        month: '6',
        day: '7'
    },
    country: ['Brazil', 'France', 'Italy'],
    language: 'Portuguese',
    genre: {
      genreName: 'Drama',
      genreDescription: 'The Drama genre in film is a genre that relies on the emotional and relational development of realistic characters. While Drama film relies heavily on this kind of development, dramatic themes play a large role in the plot as well. Often, these dramatic themes are taken from intense, real life issues. Whether heroes or heroines are facing a conflict from the outside or a conflict within themselves, Drama film aims to tell an honest story of human struggles.',
    },
    director: {
        name: 'Marcel Camus',
        bio: 'Marcel Camus was a French director who won innoternational acclaim for his second film, Orfeu Negro (Black Orpheus) in 1958. The film was praised for its use of exotic settings and brilliant spectacle and won first prize at both the Cannes and Venice film festivals as well as an Oscar from the Academy of Motion Picture Arts and Sciences.',
        dob: 'April 21, 1912',
        dod: ' January 13, 1982',
    },
    featured: true
    },
];

const users = [
        {
          username: "Tuv",
          Password:  "tkim!123",
          Email:  "tkim@gmail.com",
          dob:  "March 21, 1989",
          favMovies: [""]
        },
        {
          username: "Ronny",
          Password: "Rococo!456",
          Email: "maronny@gmail.com",
          dob: "May 30, 2000",
          favMovies: [""] 
        },
        {
          username: "Joseph",
          Password: "fliX@789",
          Email: "rony@gmail.com",
          dob: "July 12, 1978",
          favMovies: ["Inception"] 
        },
        {
          username: "Chris",
          email: 'chrisholt@gmail.com',
          password: 'password123',
          dob: 'January 13, 1992',
          favMovies: ["The Great Beauty"],
          id: "ea372b34-b7b2-428a-ba9e-d844389fb868"
        },
        {
          username: "Mary", 
          email: 'marynolan@gmail.com',
          password: '$filmGeek',
          dob: 'January 13, 1992',
          favMovies: ['Whiplash'],
          id: "2955f7c6-a185-4e97-9a43-2816841ca28c"
        },
        ];
 
// Serve documentation.html (static)
app.use('/documentation', express.static('public', {index: 'documentation.html'}));

// Get homepage
app.get('/', (req, res) => {
    res.send('Welcome to Cinephile!');
});

// Get movie data
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});


//  Get data about a single movie, by title
  app.get('/movies/:title', (req, res)=>{
    const { title } = req.params;
    const movie = movies.find(movie => movie.title === title); 

    if(movie){
      res.status(200).json(movie);
    }else{
      res.status(400).send('no such movie');
    }
  })

// get genre by movie
  app.get('/movies/genre/:name', (req, res)=>{
    const  {genreName} = req.params;
    const genre = movies.find(movie => movie.genre.name === genreName).genre; 

    if(genre){
      res.status(200).json(genre);
    }else{
      res.status(400).send('no such genre');
    }
  })

  // get director by movie
  app.get('/movies/director/:directorName', (req, res)=>{
    const  {directorName} = req.params;
    const director = movies.find(movie => movie.director.name === directorName).director; 

    if(director){
      res.status(200).json(director);
    }else{
      res.status(400).send('no such director');
    }
  });

//Get all users
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// Get a single user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(user => user.id == id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send('User not found'); 
  }
});

//Create new user (with id)
app.post('/users', (req, res) => {
  let { username, email, password, dob, favMovies } = req.body;

  if (!username || !email || !password || !dob) {
    const message = 'Missing field';
    res.status(400).send(message);
  } else {
    let newUser = {
      username: username,
      email: email,
      password: password,
      dob: dob,
      favMovies: favMovies,
      id: uuid.v4()
    };

    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// Update user info by id
    app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const { username: newUsername } = req.body;
    const user = users.find(user => user.id == id);
  
    if (user) {
      user.username = newUsername;
      res.status(200).send('User updated');
    } else {
      res.status(404).send('User not found');
    }
  });

//add a movie to user favorites list
  app.post('/users/:id/:title', (req, res)=>{
    const {id, title} = req.params;

    let user = users.find(user => user.id == id);
    if (user){
      user.favMovies.push(title);
      res.status(200).send(`${title} has been added to user ${id}'s array.`);
    }else{
      res.status(400).send('no such user');
    }
  })

// Delete a movie from user favorites list
  app.delete('/users/:id/:title', (req, res)=>{
  const {id, title} = req.params;

  let user = users.find(user => user.id == id);
  if (user){
    user.favMovies = user.favMovies.filter(movieTitle => movieTitle !== title);
    res.status(200).send(`${title} has been removed`);
  }else{
    res.status(400).send('no such user');
  }
})

  // delete existing users 
  app.delete('/users/:id', (req, res)=>{
    const {id} = req.params;

    let user = users.find(user => user.id == id);
    if (user){

      users = users.filter(user => user.id != id);
      // res.json(users);
      res.status(200).send(`User ${id} has been deleted.`);
    }else{
      res.status(400).send('no such user');
    }
  })

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('An error occurred!');
});

// Start server and Listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});


//Imports
const express = require('express'),
    app = express(),
    morgan = require('morgan'),
    bodyParser = require('body-parser')
;

const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

//For local testing:
//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//Uses body-parser to read body object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Imports and uses CORS
const cors = require('cors');
app.use(cors());

//Imports authentication
let auth = require('./auth')(app) // HTML Authentication

//Imports Passport
const passport = require('passport'); // JWT Authentication
require('./passport');

//Uses Morgan to log requests in the terminal
app.use(morgan('common'));

//Serves static files from public folder using express.static
app.use(express.static('public'));

//READ textual response at endpoint /
app.get('/', (req, res) => res.status(200).send('Welcome to cotuFlix'));

/*---Movies---------------------**/
//READ all movies as JSON at endpoint /movies with JWT
app.get('/movies', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
});

//READ specific movie by title with JWT
app.get('/movies/:Title', 
  passport.authenticate('jwt', {session: false}), 
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        if (!movie) {
          return res.status(400).send('Error: The movie ' + req.params.Title + ' was not found');
        }
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//READ list of movies with a specific genre with JWT
app.get('/genres/:Genre', 
  passport.authenticate('jwt', {session: false}), 
  async (req, res) => {
    await Movies.find({ 'Genre.Name': req.params.Genre })
          .then((movies) => {
              if (movies.length == 0) {
                  return res.status(404).send('Error: no movies found in the ' + req.params.Genre + ' genre.');
              } else {
                  res.status(200).json(movies);
              }
          })
          .catch((err) => {
              console.error(err);
              res.status(500).send('Error: ' + err);
          });
});

//READ list of movies with a specific director with JWT
app.get('/directors/:Director', 
  passport.authenticate('jwt', {session: false}), 
  async (req, res) => {
    await Movies.find({ 'Director.Name': req.params.Director })
          .then((movies) => {
              if (movies.length == 0) {
                  return res.status(404).send('Error: no directors found with the name ' + req.params.Director);
              } else {
                  res.status(200).json(movies);
              }
          })
          .catch((err) => {
              console.error(err);
              res.status(500).send('Error: ' + err);
          });
});

/*--Users---------------------*/
//CREATE new user
app.post('/users',
[//Validation logic
  check('Username', 'Username is required.').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required.').not().isEmpty(),
  check('Password', 'Password must be at least 8 characters long.').isLength({min: 8}),
  check('Email', 'Email does not appear to be valid.').isEmail()
], async (req, res) => {

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//READ a user by username with JWT
app.get('/users/:Username', 
  passport.authenticate('jwt', {session: false}), 
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});
  
// UPDATE a user's info with JWT
app.put('/users/:Username', 
  passport.authenticate('jwt', {session: false}),

  [//Validation logic
  check('Username', 'Username is required.').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required - must be at least 8 characters long.').isLength({min: 8}),
  check('Email', 'Email does not appear to be valid.').isEmail(),
  check('Birthday', 'Birthday is not a valid date - follow format YYYY-MM-DD').isDate()
], async (req, res) => {

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

    // Condition: Unauthorises users who are not the one being updated
    if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied');
    }
    // Condition ends
    await Users.findOneAndUpdate({ Username: req.params.Username },
    { $set:
      {
        Username: req.body.Username,
        Email: req.body.Email,
        Password: req.body.Password,
        Birthday: req.body.Birthday
      }
    },
    { new: true }
    ).then((updatedUser) => {
        if(!updatedUser) {
          return res.status(404).send('Error: User ' + req.params.Username + ' does not exist.');
        } else {
          res.json(updatedUser);
        }
      })
      .catch(error => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      })
});

//DELETE user by username with JWT
app.delete('/users/:Username', 
  passport.authenticate('jwt', {session: false}), 
  async (req, res) => {
    // Condition: Unauthorises users who are not the one being deleted
    if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied');
    }
    // Condition ends
    await Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send('User ' + req.params.Username + ' was not found');
        } else {
          res.status(200).send('User ' + req.params.Username + ' has been deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

// CREATE favorite movie entry in user list with JWT
app.post('/users/:Username/movies/:MovieID', 
  passport.authenticate('jwt', {session: false}),
  async (req, res) => {
    // Condition: Unauthorises users who are not the list's owner
    if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permission denied');
    }
    // Condition ends
    await Users.findOneAndUpdate({ Username: req.params.Username },
      {$push: { FavoriteMovies: req.params.MovieID }},
      {new: true} // This line makes sure that the updated document is returned
    ).then((updatedUser) => {
        if(!updatedUser) {
          return res.status(404).send('Error: User ' + req.params.Username + ' does not exist.');
        } else {
          res.json(updatedUser);
        }
      })
      .catch(error => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      })
});
  
//DELETE favorite movie entry in user list with JWT
app.delete('/users/:Username/movies/:MovieID', 
  passport.authenticate('jwt', {session: false}), 
  async (req, res) => {
    // Condition: Unauthorises users who are not the list's owner
    if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied');
    }
    // Condition ends
    await Users.findOneAndUpdate({ Username: req.params.Username },
      {$pull: { FavoriteMovies: req.params.MovieID }},
      { new: true }
    ).then((updatedUser) => {
        if(!updatedUser) {
          return res.status(404).send('Error: User ' + req.params.Username + ' does not exist.');
        } else {
          res.json(updatedUser);
        }
      })
      .catch(error => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      })
});


//Logs application-level errors to the terminal
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oops, there\'s been an error!');
});

//Looks for a pre-configured port number in the environment variable. Sets the port to 8080 if nothing is found.
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0.', () => {
  console.log('Listening on port ' + port);
});
//Imports
const express = require('express'),
    app = express(),
    morgan = require('morgan'),
    bodyParser = require('body-parser')
;

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

//Uses body-parser to read body object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Uses Morgan to log requests in the terminal
app.use(morgan('common'));

//Serves static files from public folder using express.static
app.use(express.static('public'));

//READ textual response at endpoint /
app.get('/', (req, res) => res.status(200).send('Welcome to myFlix'));

/*---Movies---*/
//READ all movies as JSON at endpoint /movies
app.get('/movies', (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//READ specific movie by title
app.get('/movies/:Title', (req, res) => {
	Movies.findOne({ Title: req.params.Title })
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

//READ specific genre by name
app.get('/genres/:Genre', (req, res) => {
	Movies.find({ 'Genre.Name': req.params.Genre })
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

//READ specific director by name
app.get('/directors/:Director', (req, res) => {
	Movies.findOne({ 'Director.Name': req.params.Director })
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

/*--Users--*/
//CREATE new user
/* Will expect JSON in this format
{
  _id: Integer,
  username: String,
  email: String,
  password: String,
  birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
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

//READ all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//DELETE user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send('User ' + req.params.Username + ' was not found');
      } else {
        res.status(200).send('User ' + req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
  
// UPDATE a user's info, by username
/* Will expect JSON in this format
{
Username: String,
(required)
Email: String,
(required)
Password: String,
(required)
Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Email: req.body.Email,
      Password: req.body.Password,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

  // CREATE favorite movie entry in user list
  app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });
  
  //DELETE favorite movie entry in user list
  app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $pull: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

//Logs application-level errors to the terminal
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops, there\'s been an error!');
});

//Listens to port 8080
app.listen(8080, () => {
    console.log('Listening to port 8080.');
});
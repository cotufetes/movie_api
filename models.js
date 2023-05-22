const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Birth: Number,
        Death: Number,
        Bio: String
    },
    Title: {type: String, required: true},
    ImageURL: String,
    Year: Number,
    Synopsis: {type: String, required: true},
    Actors: [String],
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Email: {type: String, required: true},
    Password: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
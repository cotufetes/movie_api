//Imports
const express = require('express'),
    app = express(),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid')
;

//Uses body-parser to read body object
app.use(bodyParser.json());
;

//Uses Morgan to log requests in the terminal
app.use(morgan('common'));

//Serves static files from public folder using express.static
app.use(express.static('public'));

//Variable for users object array
let users = [
    {
        id: 1,
        name: 'cotufetes',
        favoriteMovies: ['Jumanji']
    },
    {
        id: 2,
        name: 'cassalla1000',
        favoriteMovies: []
    }
];

//Variable for movies object array
let movies = [
    {
        title: 'Jumanji',
        year: '1995',
        description: 'When two kids find and play a magical board game, they release a man trapped in it for decades - and a host of dangers that can only be stopped by finishing the game.',
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Jumanji_poster.jpg',
        genre: {
            name: 'Adventure',
            description: 'Implies a narrative that is defined by a journey (often including some form of pursuit) and is usually located within a fantasy or exoticized setting. Typically, though not always, such stories include the quest narrative. The predominant emphasis on violence and fighting in action films is the typical difference between the two genres.'
        },
        director: {
            name: 'Joe Johnston',
            birth: '1950',
            death: '',
            bio: 'Joseph Eggleston Johnston II (born May 13, 1950) is an American film director, producer, writer, and visual effects artist. He is best known for directing effects-driven films, including "Honey, I Shrunk the Kids" (1989); "Jumanji" (1995); "Jurassic Park III" (2001); "The Rocketeer" (1991); "The Wolfman" (2010); and "Captain America: The First Avenger" (2011).'
        },
        featured: true
    },
    {
        title: 'Mean Girls',
        year: '2004',
        description: 'Cady Heron is a hit with The Plastics, the A-list girl clique at her new school, until she makes the mistake of falling for Aaron Samuels, the ex-boyfriend of alpha Plastic Regina George.',
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/a/ac/Mean_Girls_film_poster.png',
        genre: {
            name: 'Comedy',
            description: 'Defined by events that are primarily intended to make the audience laugh.'
        },
        director: {
            name: 'Mark Waters',
            birth: '1964',
            death: '',
            bio: 'Mark Stephen Waters (born June 30, 1964) is an American filmmaker. He directed the comedy films "Freaky Friday", "Mean Girls", "Ghosts of Girlfriends Past", "Mr. Popper\'s Penguins" and "Vampire Academy".'
        },
        featured: true
    },
    {
        title: 'La La Land',
        year: '2016',
        description: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png',
        genre: {
            name: 'Musical',
            description: 'A genre in which songs performed by the characters are interwoven into the narrative, sometimes accompanied by dancing. The songs usually advance the plot or develop the film\'s characters or may serve merely as breaks in the storyline, often as elaborate "production numbers".'
        },
        director: {
            name: 'Damien Chazelle',
            birth: '1985',
            death: '',
            bio: 'Damien Sayre Chazelle (born January 19, 1985) is a French-American film director, screenwriter, and producer. He is known for directing the films "Whiplash" (2014), "La La Land" (2016), "First Man" (2018), and "Babylon" (2022).'
        },
        featured: true
    },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        year: '2001',
        description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/8/8a/The_Lord_of_the_Rings_The_Fellowship_of_the_Ring_%282001%29.jpg',
        genre: {
            name: 'Fantasy',
            description: 'Films defined by situations that transcend natural laws and/or by settings inside a fictional universe, with narratives that are often inspired by or involve human myths.'
        },
        director: {
            name: 'Peter Jackson',
            birth: '1961',
            death: '',
            bio: 'Sir Peter Robert Jackson ONZ KNZM (born 31 October 1961) is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the "Lord of the Rings" trilogy (2001-2003) and the "Hobbit" trilogy (2012-2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien.'
        },
        featured: true
    },
    {
        title: 'Hocus Pocus',
        year: '1993',
        description: 'A teenage boy named Max and his little sister move to Salem, where he struggles to fit in before awakening a trio of diabolical witches that were executed in the 17th century.',
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/c/c9/Hocuspocusposter.jpg',
        genre: {
            name: 'Comedy',
            description: 'Defined by events that are primarily intended to make the audience laugh.'
        },
        director: {
            name: 'Kenny Ortega',
            birth: '1950',
            death: '',
            bio: 'Kenneth John Ortega (born April 18, 1950) is an American filmmaker, touring manager, and choreographer. He is known for directing the films "Newsies", "Hocus Pocus", "The Cheetah Girls 2", "High School Musical", "Michael Jackson\'s This Is It", "Descendants", and "Julie and the Phantoms".'
        },
        featured: true
    },
    {
        title: 'Die Hard',
        year: '1988',
        description: 'A New York City police officer tries to save his estranged wife and several others taken hostage by terrorists during a Christmas party at the Nakatomi Plaza in Los Angeles.',
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/1/1e/Everything_Everywhere_All_at_Once.jpg',
        genre: {
            name: 'Action',
            description: 'Associated with particular types of spectacle (e.g., explosions, chases, combat).'
        },
        director: {
            name: 'John McTiernan',
            birth: '1951',
            death: '',
            bio: 'John Campbell McTiernan Jr. (born January 8, 1951) is an American filmmaker. He is best known for his action films, including "Predator" (1987), "Die Hard" (1988), and "The Hunt for Red October" (1990).'
        },
        featured: true
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        year: '2003',
        description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/b/be/The_Lord_of_the_Rings_-_The_Return_of_the_King_%282003%29.jpg',
        genre: {
            name: 'Fantasy',
            description: 'Films defined by situations that transcend natural laws and/or by settings inside a fictional universe, with narratives that are often inspired by or involve human myths.'
        },
        director: {
            name: 'Peter Jackson',
            birth: '1961',
            death: '',
            bio: 'Sir Peter Robert Jackson ONZ KNZM (born 31 October 1961) is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the "Lord of the Rings" trilogy (2001-2003) and the "Hobbit" trilogy (2012-2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien.'
        },
        featured: true
    },
    {
        title: 'My Neighbor Totoro',
        year: '1988',
        description: 'When two girls move to the country to be near their ailing mother, they have adventures with the wondrous forest spirits who live nearby.',
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
        genre: {
            name: 'Animation',
            description: 'A film medium in which the film\'s images are primarily created by computer or hand and the characters are voiced by actors. Animation can incorporate any genre and subgenre.'
        },
        director: {
            name: 'Hayao Miyazaki',
            birth: '1941',
            death: '',
            bio: 'Hayao Miyazaki (born January 5, 1941) is a Japanese animator, director, producer, screenwriter, author, and manga artist. A co-founder of Studio Ghibli, he has attained international acclaim as a masterful storyteller and creator of Japanese animated feature films, and is widely regarded as one of the most accomplished filmmakers in the history of animation.'
        },
        featured: true
    },
    {
        title: 'The Lord of the Rings: The Two Towers',
        year: '2002',
        description: 'While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron\'s new ally, Saruman, and his hordes of Isengard.',
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/d/d0/Lord_of_the_Rings_-_The_Two_Towers_%282002%29.jpg',
        genre: {
            name: 'Fantasy',
            description: 'Films defined by situations that transcend natural laws and/or by settings inside a fictional universe, with narratives that are often inspired by or involve human myths.'
        },
        director: {
            name: 'Peter Jackson',
            birth: '1961',
            death: '',
            bio: 'Sir Peter Robert Jackson ONZ KNZM (born 31 October 1961) is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the "Lord of the Rings" trilogy (2001-2003) and the "Hobbit" trilogy (2012-2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien.'
        },
        featured: true
    },
    {
        title: 'Inception',
        year: '2010',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg',
        genre: {
            name: 'Science fiction',
            description: 'Defined by a combination of imaginative speculation and a scientific or technological premise, making use of the changes and trajectory of technology and science.'
        },
        director: {
            name: 'Christopher Nolan',
            birth: '1970',
            death: '',
            bio: 'Christopher Edward Nolan CBE (born 30 July 1970) is a British-American filmmaker. Known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century. His films have grossed $5 billion worldwide. '
        },
        featured: true
    },
];

//READ textual response at endpoint /
app.get('/', (req, res) => res.status(200).send('Welcome to myFlix'));

//READ all movies as JSON at endpoint /movies
app.get('/movies', (req, res) => res.status(200).json(movies));

//Logs application-level errors to the terminal
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops, there has been an error!');
});

//Listens to port 8080
app.listen(8080, () => {
    console.log('Listening to port 8080.');
});
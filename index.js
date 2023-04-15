//Import Express
const express = require('express'),
    app = express()
;


//Listens to port 8080
app.listen(8080, () => {
    console.log('Your app is listening to port 8080.');
});
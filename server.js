//Imports in-built modules through const variables
const http = require('http'),
  fs = require('fs'),
  url = require('url');

//Creates server
http.createServer((request, response) => {
  let addr = request.url,
    q = url.parse(addr, true),
    filePath = '';

  //Updates log file if no errors detected
  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

  //Parses the requested URL and returns documentation file if the word is found
  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

  //Reads file and terminates program if an error is detected
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();

  });

  //Listens for requests on port 8080
}).listen(8080);

console.log('My test server is running on Port 8080.');

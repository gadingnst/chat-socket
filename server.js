const
  express = require('express'),
  app = express(),
  http = require('http').Server(app),
  socket = require('socket.io')(http);


app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));

http.listen(3300, () => {
  console.log('Server listening on port 3300');
});

const
  express = require('express'),
  session = require('express-session'),
  parser = require('body-parser'),
  app = express(),
  http = require('http').Server(app),
  socket = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.use(parser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'login-username',
  resave: true,
  saveUninitialized: false,
}));

app.get('/', (request, response) => {
  if (request.session.name) {
    response.sendFile(__dirname + '/src/views/index.html');
    return;
  }
  response.sendFile(__dirname + '/src/views/login.html');
});

app.get('/login', (request, response) => {
  let login = {
    'name': request.session.name
  }
  response.json(login);
});

app.get('/logout', (request, response) => {
  request.session.destroy();
  response.redirect('/');
});

app.post('/login', (request, response) => {
  request.session.name = request.body.name;
  response.redirect('/');
});

http.listen(3300, () => {
  console.log('Server listening on port 3300');
});

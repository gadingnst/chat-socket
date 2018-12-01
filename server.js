const
  express = require('express'),
  session = require('express-session'),
  parser = require('body-parser'),
  app = express(),
  http = require('http').Server(app),
  socketio = require('socket.io')(http),
  io = require('socket.io-client')('http://localhost:3300');

let login = {self: {}, users: []};

app.use(express.static(__dirname + '/public'));

app.use(parser.urlencoded({
  extended: true
}));

socketio.on('connection', (socket) => {
  socket.on('login', (name) => {
    socketio.emit('login', name);
    login.users.push({name: name});
    console.log(name+' telah login.');
  });

  socket.on('logout', (name) => {
    socketio.emit('logout', name);
    login.users.forEach((el, i) => {
      if (login.users[i].name === name) {
        login.users.splice(i, 1);
      }
    });
    console.log(name+' telah logout');
  });

  socket.on('messages', (data) => {
    socketio.emit('messages', data);
  });
});

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
  login.self = {name: request.session.name}
  response.json(login);
});

app.get('/logout', (request, response) => {
  io.emit('logout', request.session.name);
  request.session.destroy();
  response.redirect('/');
});

app.post('/login', (request, response) => {
  if (request.body.name.trim() !== "") {
    request.session.name = request.body.name;
    io.emit('login', request.session.name);
  }
  response.redirect('/');
});

http.listen(3300, "0.0.0.0", () => {
  console.log('Server listening on port 3300');
});

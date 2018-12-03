const
  express = require('express'),
  session = require('express-session'),
  parser = require('body-parser'),
  md5 = require('md5'),
  app = express(),
  http = require('http').Server(app),
  socketio = require('socket.io')(http),
  io = require('socket.io-client')(`http://localhost:${process.env.PORT}`);

let username, login = {self: {}, users: []};

let gravatar = email => `https://www.gravatar.com/avatar/${md5(email)+'?d=robohash'}`;

app.use(express.static(__dirname + '/public'));

app.use(parser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'login-username',
  resave: true,
  saveUninitialized: false,
}));

socketio.on('connection', socket => {

  socket.on('messages', data => {
    socketio.emit('messages', data);
  });

  socket.on('login', data => {
    socketio.emit('login', {
      name: data.name,
      ava: data.ava
    });
    login.users.push({
      name: data.name,
      ava: data.ava
    });
    console.log(data.name+' telah login.');
  });

  socket.on('logout', name => {
    socketio.emit('logout', name);
    login.users.map((el, i) => {
      if (login.users[i].name === name) {
        login.users.splice(i, 1);
        console.log(name+' telah logout');
        return;
      }
    });

    socket.on('disconnect', () => {
      socketio.emit('io-disconnect', {msg: `Socket ${socket.id} disconne=ct`});
    });
  });
});

// app.use((request, response, next) => {
//   response.redirect('https://'+request.headers.host+request.url);
// });

app.get('/', (request, response) => {
  if (request.session.name) {
    response.sendFile(__dirname + '/src/views/index.html');
    return;
  }
  response.sendFile(__dirname + '/src/views/login.html');
});

app.get('/login', (request, response) => {
  if (request.session.name) {
    login.self = {
      name: request.session.name,
      ava: gravatar(request.session.name+'@email.example')
    }
    response.json(login);
    return;
  }
  response.redirect('/');
});

app.get('/logout', (request, response) => {
  io.emit('logout', request.session.name);
  request.session.destroy();
  response.redirect('/');
});

app.post('/login', (request, response) => {
  if (request.body.name.trim() !== "") {
    request.session.name = request.body.name;
    username = request.session.name;
    io.emit('login', {
      name: request.session.name,
      ava: gravatar(request.session.name+'@email.example')
    });
  }
  response.redirect('/');
});

http.listen(process.env.PORT || 3300, () => {
  console.log('Server listening on port 3300');
});

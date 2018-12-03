const
  express = require('express'),
  session = require('express-session'),
  parser = require('body-parser'),
  hex = require('randomcolor'),
  md5 = require('md5'),
  uuid = require('uuid/v4'),
  app = express(),
  http = require('http').Server(app),
  socketio = require('socket.io')(http),
  port = process.env.PORT ? process.env.PORT : 3300,
  io = require('socket.io-client')('http://localhost:'+port);

let
  login = {self: {}, users: []},
  gravatar = email => `https://www.gravatar.com/avatar/${md5(email)+'?d=robohash'}`;

app.use(express.static(__dirname+'/public'));

app.use(parser.urlencoded({
  extended: true
}));

app.use(session({
  secret: uuid(),
  resave: true,
  saveUninitialized: false,
}));

socketio.on('connection', socket => {

  socket.on('messages', data => {
    socketio.emit('messages', data);
  });

  socket.on('login', data => {
    socketio.emit('login', {
      id: data.id,
      name: data.name,
      ava: data.ava,
      bubble: data.bubble
    });
    login.users.push({
      id: data.id,
      name: data.name,
      ava: data.ava,
      bubble: data.bubble
    });
    console.log(data.name+' telah login.');
  });

  socket.on('logout', data => {
    socketio.emit('logout', data);
    login.users.map((el, i) => {
      if (login.users[i].id === data.id) {
        login.users.splice(i, 1);
        console.log(data.name+' telah logout');
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
  if (request.session.userid) {
    response.sendFile(__dirname+'/src/views/index.html');
    return;
  }
  response.sendFile(__dirname+'/src/views/login.html');
});

app.get('/login', (request, response) => {
  if (request.session.userid) {
    login.self = {
      id: request.session.userid,
      name: request.session.name,
      ava: request.session.ava,
      bubble: request.session.bubble,
    }
    response.json(login);
    return;
  }
  response.redirect('/');
});

app.get('/logout', (request, response) => {
  io.emit('logout', {
    id: request.session.userid,
    name: request.session.name
  });
  request.session.destroy();
  response.redirect('/');
});

app.post('/login', (request, response) => {
  if (request.body.name.trim() !== "") {
    request.session.name = request.body.name;
    request.session.userid = uuid();
    request.session.ava = gravatar(request.session.name+hex().replace('#', '')+'@sutanlab.js.org');
    request.session.bubble = hex({luminosity: 'light', format: 'hex'});
    io.emit('login', {
      id: request.session.userid,
      name: request.session.name,
      ava: request.session.ava,
      bubble: request.session.bubble,
    });
  }
  response.redirect('/');
});

http.listen(port, () => {
  console.log('Server run on http://localhost:'+port);
  console.log();
});

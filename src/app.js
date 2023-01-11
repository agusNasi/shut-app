const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const { Server } = require('socket.io');
const viewsRoutes = require('./routes/views.routes');

const PORT = process.env.PORT || 8080;
const app = express();

// Template Engine
app.engine('handlebars', handlebars.engine());
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../public')));

// Routes
app.use(viewsRoutes);

// Listen
const httpServer = app.listen(PORT, () => {
  console.log("Server is up an running on port ", PORT);
});

// Sockets
const messages = [];
const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log("New client connected!");

  socket.on('login', (user) => {
    socket.emit('messages-logs', messages);
    socket.emit('welcome', user)
    socket.broadcast.emit('new-user', user);
  });

  socket.on('messages', (data) => {
    messages.push(data);
    io.emit('messages-logs', messages);
  });
});
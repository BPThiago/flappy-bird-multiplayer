import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
const io = new Server(server);

import createGame from './public/lobby.js'

const game = createGame();

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

let activeUsers = 0;
const minUsers = 2;
io.on('connection', (socket) => {
    activeUsers++;
    io.emit('active users', activeUsers);
    io.emit('new player', game.getPlayersNumber());
    

    socket.on('disconnect', () => {
        activeUsers--;
        socket.broadcast.emit('active users', activeUsers);

        if (game.isUserMultiplayer(socket.id)) {
            socket.broadcast.emit('new player', game.getPlayersNumber())
            if (game.observers.length < minUsers) {
                game.toggleStartCount(io, false)
            } 
        };

    });

    socket.on('new player', () => {
        if (!game.isUserMultiplayer(socket.id)) {
            socket.join('multiplayer')
            game.addObserver(socket.id)
            
            game.count(io);

            io.emit('new player', game.getPlayersNumber())
        } else {
            game.removeMultiplayerUser(socket.id)

            if (game.observers.length < minUsers) {
                game.toggleStartCount(io, false)
            }

            socket.leave('multiplayer')
            io.emit('new player', game.getPlayersNumber())
        }
    });

    socket.on('jump', () => {
        const player = game.players[socket.id]
        if (player) {
           player.speed = -4.6;
           player.y += player.speed;
        }
    });

    socket.on('lose', () => {
        socket.leave('multiplayer')
    })

});

server.listen(3000, () => {
    console.log('Flappy Bird is listening on port 3000!')
})

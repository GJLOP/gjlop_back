const {env} = require("../shared/env")
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {Game} = require('../game/Game');

class ServerController {
    frontUrl = env === "dev" ? "http://77.196.65.4" : "https://glop.legeay.dev";
    io;
    server;
    app;
    game;
    statusEmitInterval;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIO(this.server, {
            cors: {
                origin: this.frontUrl,
                methods: ["GET", "POST"]
            }
        });
        this.game = new Game();
        this.init();
    }

    init = () => {
        if (typeof(PhusionPassenger) !== 'undefined') {
            console.log('listening... passenger')
            PhusionPassenger.configure({ autoInstall: false });
            this.server.listen('passenger');

        } else {
            console.log('listening... 3000');
            this.server.listen(3000);
        }
        this.app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        this.initUserConnections();
    }

    start = () => {
        this.game.startGame();

        this.statusEmitInterval = setInterval(() => {
            if(!this.game.isGameStarted) {
                clearInterval(this.statusEmitInterval);
                setTimeout(this.start, 30000);
            }
            this.io.emit('status', this.game.getGameStatus());
        }, 50); // 8
    }

    initUserConnections = () => {
        this.io.on('connection', (socket) => {

            const playerId = socket.id;

            console.log(`new player : ${playerId}`);
            if(this.game.playerList.length === 0) {
                this.start();
            }
            this.game.addPlayer(playerId);

            socket.on('disconnect', () => {
                this.game.removePlayer(playerId);
                console.log(`A user has disconnected : ${playerId}`);
            })

            socket.on('whois', () => {
                const player = this.game.getPlayer(playerId);
                socket.emit('whois', player);
            })

            socket.on('event', event => {
                this.game.playEvent(playerId, event);
            })

            socket.on('position', position => {
                this.game.updatePlayerPosition(playerId, position);
            })
        });
    }



}

module.exports = {
    ServerController
};
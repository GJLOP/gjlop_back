const {env} = require("./shared/env")
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {Game} = require('./game/Game');

class ServerController {
    frontUrl = env === "dev" ? "*" : "https://glop.legeay.dev";
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
                methods: ["GET", "POST"],
                allowedHeaders: ["*"],
                credentials: false
            }
        });
        this.game = new Game();
        this.init();

        console.log(this.frontUrl);
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

    gameStatusUpdate = () => {
        const startTime = new Date().getTime();

        this.io.emit('status', this.game.getGameStatus());
        if(!this.game.isGameStarted) {
            setTimeout(() => this.start(), 30000);
            return;
        }

        const endTime = new Date().getTime();
        setTimeout(this.gameStatusUpdate, 12 - (endTime - startTime));
    }

    start = () => {
        this.game.startGame();
        this.gameStatusUpdate();
    }

    initUserConnections = () => {
        this.io.on('connection', (socket) => {

            const playerId = socket.id;

            console.log(`new player : ${playerId}`);
            if(this.game.playerList.length === 0) {
                this.start();
            }

            const player = this.game.addPlayer(playerId);
            socket.emit('whois', player);

            socket.on('disconnect', () => {
                this.game.removePlayer(playerId);
                console.log(`A user has disconnected : ${playerId}`);
                this.io.emit('status', this.game.getGameStatus());
            })

            socket.on('event', event => {
                this.game.playEvent(playerId, event);
            })

            socket.on('playerState', playerState => {
                this.game.updatePlayerState(playerId, playerState);
            })
        });
    }



}

module.exports = {
    ServerController
};
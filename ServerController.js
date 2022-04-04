const {env} = require("./shared/env")
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {Game} = require('./game/Game');

class ServerController {
    // frontUrl = env === "dev" ? ["*"] : ["https://glop.legeay.dev"];
    io;
    server;
    app;
    game;
    isInterludePhase = false;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIO(this.server, {
            cors: {
                origin: ["https://glop.legeay.dev"],
                credentials: true
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

    gameStatusUpdate = () => {
        if(this.isNoUserConnected()) {
            console.log("gameStatusUpdate stopped")
            this.game.stopGame();
            return;
        }

        const startTime = new Date().getTime();

        this.io.emit('status', this.game.getGameStatus());

        if(!this.game.isGameStarted && !this.isInterludePhase) {
            this.isInterludePhase = true;

            console.log("Game as Ended");

            setTimeout(() => {
                console.log("New Game starting")
                this.game.startGame();
            }, 12000);

        }
        if(this.game.isGameStarted){
            this.isInterludePhase = false;
        }

        const runtime = new Date().getTime() - startTime;

        setTimeout(this.gameStatusUpdate, 9 - (runtime <= 9 ? runtime : 9));
    }

    initUserConnections = () => {
        this.io.on('connection', (socket) => {

            const playerId = socket.id;
            const player = this.game.addPlayer(playerId);

            console.log(`new player : ${playerId} - ${player.name}`);
            if(this.isOneUserConnected()) {
                this.game.startGame();
                console.log("New Game starting")
                this.gameStatusUpdate();
                console.log("gameStatusUpdate started");
            }

            console.log(`there is ${this.game.playerList.length} players`)
            socket.emit('whois', player);

            socket.on('disconnect', () => {
                this.game.removePlayer(playerId);
                console.log(`A user has disconnected : ${playerId}`);
                console.log(`there is ${this.game.playerList.length} players`);
            })

            socket.on('event', event => {
                this.game.playEvent(playerId, event);
            })

            socket.on('playerState', playerState => {
                this.game.updatePlayerState(playerId, playerState);
            })
        });
    }

    isOneUserConnected = () => this.game.playerList.length === 1;
    isNoUserConnected = () => this.game.playerList.length === 0;

}

module.exports = {
    ServerController
};

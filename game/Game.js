
const {Player} = require('../player/Player');
const {Hit, Shoot, Infest} = require("./Event");
const {Vector} = require("../shared/utils");

class Game {
    static width = 64;
    static height = 36;
    isGameStarted;
    playerList = [];
    eventList = [];

    constructor() {
        this.isGameStarted = false;

    }

    startGame = () => {
        this.isGameStarted = true;
        this.playerList.forEach(p => p.init());
    }

    addPlayer = (id) => {
        const player = new Player(id);
        do { player.position = this.getRandomPos(); }
        while(this.playerList?.filter(p => !p.id === player.id)?.some(p => p.position?.isMostlyEqual(player.position)))

        this.playerList = [...this.playerList, player];

        return player;
    }

    getRandomPos = () => {
        const vector = Vector.getRandomVector(50, 20);
        vector.x += Game.width / 2;
        vector.y += Game.height / 2;
        return vector;
    }

    removePlayer = (id) => {
        this.playerList = this.playerList.filter(p => p.id !== id);
    }

    updatePlayerState = (id, playerState) => {
        this.getPlayer(id).updateState(playerState);
    }

    playEvent = (id, newEvent) => {
        switch (newEvent.eventType) {
            case "hit":
                const hit = new Hit(id, newEvent);
                this.eventList.push(hit);
                this.getPlayer(hit.victimId).isZombie = true;
                this.playerList.filter(p => !p.isZombie)
                    .map(p => p.addToScore(1));
                const shooter = this.getPlayer(id);
                if(shooter.isZombie) {
                    shooter.addToScore(1);
                }
                break;
            case "infest":
                const infest = new Infest(id, newEvent);
                this.eventList.push(infest);
                this.playerList.filter(p => !p.isZombie)
                    .map(p => p.addToScore(1));
                const zombie = this.getPlayer(id);
                if(zombie.isZombie) {
                    zombie.addToScore(1);
                }
                break;
            default:
                this.eventList.push(new Shoot(newEvent));
                break
        }

    }

    updateGame = () => {
        if(this.playerList.length === 0 || this.playerList.every(p => p.isZombie)) {
            this.isGameStarted = false;
            this.eventList = [];
        }
    }

    getGameStatus = () => {
        const status = {
            isGameStarted: this.isGameStarted,
            playerList : [...this.playerList],
            eventList : [...this.eventList]
        };
        this.updateGame();
        this.eventList = [];
        return status;
    }

    getPlayer = (id) => {
        return this.playerList.find(p => p.id === id);
    }

}

module.exports = {
    Game
};
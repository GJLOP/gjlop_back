
const {Player} = require('../player/Player');
const {Hit, Shoot} = require("./Event");
const {Vector} = require("../shared/utils");

class Game {
    static width = 1000;
    static height = 1000;
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
    }

    getRandomPos = () => Vector.getRandomVector(Game.width, Game.height);

    removePlayer = (id) => {
        this.playerList = this.playerList.filter(p => p.id !== id);
    }

    updatePlayerPosition = (id, position) => {
        this.getPlayer(id).updatePosition(position);
    }

    playEvent = (id, newEvent) => {
        switch (newEvent.type) {
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
            playerDict : {},
            eventList : [...this.eventList]
        };
        this.updateGame();
        for (const player of this.playerList) {
            status.playerDict[player.id] = player;
        }
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
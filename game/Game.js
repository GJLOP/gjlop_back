
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
        this.eventList = [];
        this.isGameStarted = true;
        this.playerList.forEach(p => {
            p.init();
        });
    }

    stopGame = () => {
        this.isGameStarted = false;
        this.playerList.forEach(p => p.isZombie = false);
    }

    addPlayer = (id) => {
        const player = new Player(id);
        this.setUserPosition(player);
        this.playerList = [...this.playerList, player];
        return player;
    }

    setUserPosition = (player) => {
        do { player.position = this.getRandomPos(); }
        while(this.playerList?.filter(p => !p.id === player.id)
            ?.some(p => p.position?.isMostlyEqual(player.position)));
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
        console.log(newEvent.eventType)
        const player = this.getPlayer(id);

        switch (newEvent.eventType) {
            case "hit":
                const hit = new Hit(id, newEvent);
                const victim = this.getPlayer(hit.victimId);
                this.eventList.push(hit);

                if(victim?.isZombie !== undefined && !victim.isZombie) {
                    victim.isZombie = true;
                    this.playerList.filter(p => !p.isZombie)
                        .map(p => p.addToScore(1));
                    const shooter = player;
                    if(shooter.isZombie) {
                        shooter.addToScore(1);
                    }
                }
                break;
            case "infest":
                const infest = new Infest(id, newEvent);
                if(this.getPlayer(infest.victimId).isZombie) {
                    break;
                }

                this.eventList.push(infest);
                this.getPlayer(infest.victimId).isZombie = true;
                this.playerList.filter(p => !p.isZombie)
                    .map(p => p.addToScore(1));

                if(player.isZombie) {
                    console.log("isZombie");
                    player.addToScore(1);
                }
                break;
            case "shoot":
                this.eventList.push(new Shoot(id, newEvent));
                break
            default:
                break
        }
    }

    updateGame = () => {
        if(this.playerList.length === 0
            || this.playerList.every(p => p.isZombie)
            || (this.playerList.every(p => p.ammunitionsLeft === 0) && !this.playerList.some(p => p.isZombie))) {
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

const {Player} = require('../player/Player');
const {Hit, Shoot, Infest} = require("./Event");
const {Vector} = require("../shared/utils");

class Game {
    static radius = 90/2;

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
        player.position = this.getRandomPos();
    }

    getRandomPos = () => {
        const randomAngleRad = Math.random() * (Math.PI * 2);
        const randomDistanceFromCentre = Math.random() * Game.radius * 0.9;

        return {
            x: Math.cos(randomAngleRad) * randomDistanceFromCentre,
            y: Math.sin(randomAngleRad) * randomDistanceFromCentre
        }
    }

    removePlayer = (id) => {
        this.playerList = this.playerList.filter(p => p.id !== id);
    }

    updatePlayerState = (id, playerState) => {
        this.getPlayer(id).updateState(playerState);
    }

    playEvent = (id, newEvent) => {
        const player = this.getPlayer(id);

        switch (newEvent.eventType) {
            case "hit":
                const hit = new Hit(id, newEvent);
                const victim = this.getPlayer(hit.victimId);

                if(victim?.isZombie !== undefined && !victim.isZombie) {
                    victim.isZombie = true;
                    hit.newZombie = true;
                    this.playerList.filter(p => !p.isZombie)
                        .map(p => p.addToScore(1));
                    const shooter = player;
                    if(shooter.isZombie) {
                        shooter.addToScore(1);
                    }
                }

                this.eventList.push(hit);

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

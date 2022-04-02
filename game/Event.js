const {Vector} = require('../shared/utils');
const {Player} = require('../player/Player');

class Event {
    type ;
    playerId;

    constructor(playerId=null, type= null) {
        this.type = type;
        this.playerId = playerId;
    }
}

class Shoot extends Event {
    origin;
    direction;

    constructor(playerId, {type= "shoot", origin= new Vector(), direction= new Vector()}={}) {
        super(playerId, type);
        this.origin = origin;
        this.direction = direction;
    }
}

class Hit extends Event {
    victimId;
    direction;
    impactCoord;

    constructor(playerId, {type= "hit", victimId = null, direction = new Vector(), impactCoord = new Vector()}) {
        super(playerId, type);
        this.victimId = victimId;
        this.direction = direction;
        this.impactCoord = impactCoord;
    }
}

module.exports = {
    Shoot,
    Hit
};

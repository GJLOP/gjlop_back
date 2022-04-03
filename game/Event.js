const {Vector} = require('../shared/utils');

class Event {
    eventType ;
    playerId;

    constructor(playerId=null, eventType= null) {
        this.eventType = eventType;
        this.playerId = playerId;
    }
}

class Shoot extends Event {
    origin;
    direction;
    effectiveRange;

    constructor(playerId, {type= "shoot", origin= new Vector(), direction= new Vector(), effectiveRange}={}) {
        super(playerId, type);
        this.origin = origin;
        this.direction = direction;
        this.effectiveRange = effectiveRange;
    }
}

class Hit extends Event {
    victimId;
    direction;
    impactCoord;

    constructor(playerId, {type= "hit", victimId = null, direction = new Vector(), impactCoord = new Vector()}={}) {
        super(playerId, type);
        this.victimId = victimId;
        this.direction = direction;
        this.impactCoord = impactCoord;
    }
}

class Infest extends Event {
    victimId;

    constructor(playerId, {type= "infest", victimId = null}={}) {
        super(playerId, type);
        this.victimId = victimId;
    }
}

module.exports = {
    Shoot,
    Hit,
    Infest
};

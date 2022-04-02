const {Vector} = require('./utils');
const {Player} = require('./player');

class Event {
}

class Shoot extends Event {
    constructor() {
        super();
    }
    playerId;
    origin = new Vector();
    direction = new Vector();

}

class Hit extends Event {
    constructor() {
        super();
    }
    shooterId;
    victimId;
    direction;
    impactCoord;
}

module.exports = {
    Shoot,
    Hit
};

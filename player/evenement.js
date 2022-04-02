const Vector = require('./utils');
const Player = require('./player');

class Evenement {
}

class Shoot extends Evenement {
    constructor() {
        super();
    }
    playerId;
    origin = new Vector();
    direction = new Vector();

}

class Hit extends Evenement {
    constructor() {
        super();
    }
    shooterId;
    victimId;
    direction;
    impactCoord;
}

export {Shoot, Hit};
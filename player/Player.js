const {Vector} = require('../shared/utils');
const {nameList} = require('../shared/names');

class Player {
    static SAFE_DISTANCE = 5;
    id;
    name;
    color;
    position = new Vector();
    score;
    isZombie;
    aimingAngleRad = 0;

    constructor(id) {
        this.id = id;
        this.setRandomName();
        this.setRandomColor();
        this.init();
    }

    init = () => {
        this.score = 0;
        this.isZombie = false;
    }

    addToScore = (nb) => this.score += nb ;

    updatePosition = ({position, aimingAngleRad}) => {
        this.position = new Vector(position);
        this.aimingAngleRad = aimingAngleRad;
    }

    setRandomColor = () => {
        const color = Math.floor(Math.random()*16777215).toString(16);
        this.color = `${color}#`;
    }

    setRandomName = () => this.name = nameList[Math.floor(Math.random() * nameList.length)];



}


module.exports = {
    Player: Player
};





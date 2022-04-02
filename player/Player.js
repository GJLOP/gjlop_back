const {Vector, Vector3} = require('../shared/utils');
const {nameList} = require('../shared/names');

class Player {
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

    updateState = ({position, aimingAngleRad}) => {
        this.position = new Vector(position);
        this.aimingAngleRad = aimingAngleRad;
    }

    setRandomColor = () => {
        const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
        this.color = new Vector3(rand(50,255), rand(50,255), rand(50,255));
    }

    setRandomName = () => this.name = nameList[Math.floor(Math.random() * nameList.length)];



}


module.exports = {
    Player: Player
};





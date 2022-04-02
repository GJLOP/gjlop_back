const {Player} = require('../player/Player');

class Vector {
    x;
    y;

    constructor({x = 0, y = 0} = {}) {
        this.x = x;
        this.y = y;
    }

    static getRandomVector(width, height) {
        const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
        const x = rand(-1*width/2, width/2);
        const y = rand(-1*height/2, height/2);
        return new Vector({x, y});
    }

    isMostlyEqual = (vector) =>
        this.x >= vector.x - Player.SAFE_DISTANCE
        && this.x <= vector.x + Player.SAFE_DISTANCE
        && this.y >= vector.y - Player.SAFE_DISTANCE
        && this.y <= vector.y + Player.SAFE_DISTANCE
}



module.exports = {
    Vector
};

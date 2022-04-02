const safe = 5;

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
        this.x >= vector.x - safe
        && this.x <= vector.x + safe
        && this.y >= vector.y - safe
        && this.y <= vector.y + safe
}

class Vector3 {
    x;
    y;
    z;

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}



module.exports = {
    Vector,
    Vector3
};

const { v4: uuidv4 } = require('uuid');
const {Vector} = require('./utils');

class Player {
    id;
    name;
    color;
    position = new Vector();
    // orientation = new Vector(0,0);

    constructor() {
        this.init();
    }

    init = () => {
        this.id = uuidv4();
    }

}


module.exports = {
    Player
};





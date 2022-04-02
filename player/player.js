import {v4 as uuidv4} from 'uuid';

const Vector = require('./utils');

export default class Player {
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





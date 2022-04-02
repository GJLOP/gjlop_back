const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const {Player} = require('./player/player');


if (typeof(PhusionPassenger) !== 'undefined') {
    console.log('listening... passenger')
    PhusionPassenger.configure({ autoInstall: false });
    http.listen('passenger');

} else {
    console.log('listening... 3000');
    http.listen(3000);
}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.get('/test', (req, res) => {
    res.send(new Player());
});


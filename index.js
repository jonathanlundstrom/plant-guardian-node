'use strict';

const express_port = 1337;
const serial_port = '/dev/ttyUSB0';

const express = require('express');
const nunjucks = require('nunjucks');
const SerialPort = require('serialport');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


const serial = new SerialPort(serial_port, {
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    baudrate: 9600,
    flowControl: false,
    parser: SerialPort.parsers.readline('\n')
});

serial.on('open', (error) => {
   console.log('Serial port has been opened.');
   
   if (error) {
       console.log(`Error opening port: ${error.message}`);
   } else {
       serial.on('data', data => {
           try {
               const values = JSON.parse(data.toString());
               console.log('Got Arduino response', values);
               io.emit('update', values);
           } catch (e) {
               console.log('Bad JSON, waiting for next pulse.');
           }
       });
   }
});

nunjucks.configure('views', {
    watch: true,
    express: app,
    noCache: true,
    autoescape: false
});

app.use('/node_modules', express.static('node_modules', {
    fallthrough: false
}));

app.use('/include', express.static('include', {
    fallthrough: false
}));

app.use(function(error, req, res, next) {
    if (error && error.status !== 404) {
        return res.status(error.status).send(`The server returned with status ${error.status} and code "${error.code}".`);
    }
    next();
});

app.get('/', (req, res) => {
    res.render('app.html');
});

http.listen(express_port, () => {
    console.log(`Plant Guardian is now running, and listening on port ${express_port}.`);
});
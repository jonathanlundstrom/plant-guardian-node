'use strict';

// Email properties:
const email = 'test@test.com';
const subject = 'Give me water!';
const sender = 'Plant Guardian <plantguardian@conrad.se>';

const plants = {
    sensorOne: {
        name: 'Cactus',
        email : false,
        threshold: 50
    },
    sensorTwo: {
        name: 'Citrus Tree',
        email: false,
        threshold: 50
    }
};

const express_port = 1337;
const serial_port = '/dev/ttyUSB0';

const express = require('express');
const nunjucks = require('nunjucks');
const sendmail = require('sendmail')();
const SerialPort = require('serialport');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


nunjucks.configure('views', {
    watch: true,
    express: app,
    noCache: true,
    autoescape: false
});

const sendMail = (sensor, value) => {
    sendmail({
        from: sender,
        to: email,
        subject: subject,
        html: nunjucks.render('email.html', {
            name: sensor,
            moisture: value
        }),
        silent: false
    }, function(err, reply) {
        console.log('Error occurred, could not send email...', reply);
    });
};

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
               //console.log('Got Arduino response', values);
    
               Object.keys(values).forEach(function(key) {
                   if (values[key] <= plants[key].threshold) {
                       if (!plants[key].email) {
                           sendMail(plants[key].name, values[key]);
                           plants[key].email = true;
                       }
                   } else {
                       plants[key].email = false;
                   }
               });
               
               io.emit('update', values);
           } catch (e) {
               console.log('Bad JSON, waiting for next pulse.');
           }
       });
   }
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
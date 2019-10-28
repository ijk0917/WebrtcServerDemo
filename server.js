'use strict'

var http = require('http');
var https = require('https');
var fs = require('fs');

var express = require('express');
var serveIndex = require('serve-index');

//socket.io
var socketIo = require('socket.io');

//log
var log4js = require('log4js');


log4js.configure({
    appenders: {
        file: {
            type: 'file',
            filename: 'app.log',
            layout: {
                type: 'pattern',
                pattern: '%r %p - %m',
            }
        }
    },
    categories: {
        default: {
            appenders: ['file'],
            level: 'debug'
        }
    }
});

var logger = log4js.getLogger();
var app = express();
app.use(serveIndex('./public'));
app.use(express.static('./public'));

//http server
var http_server = http.createServer(app);
http_server.listen(80, '0.0.0.0');


var options = {
    key: fs.readFileSync('./cert/luluteam.key'),
    cert: fs.readFileSync('./cert/luluteam.crt')
}

//https server
var https_server = https.createServer(options, app);

//bind socket.io with https_server
var io = socketIo.listen(https_server);

//connection
io.sockets.on('connection', (socket) => {


    socket.on('join', (room) => {
        socket.join(room);
        var myRoom = io.sockets.adapter.rooms[room];
        var users = Object.keys(myRoom.sockets).length;
        logger.log('the number of user in room is: ' + users);
        socket.emit('joined', room, socket.id);//给自己回复
        // socket.to(room).emit('joined', room, socket.id);//给房间中除了自己的所有人回复
        // io.in(room).emit('joined', room, socket.id);//给房间中所有人回复
        // socket.broadcast.emit('joined', room, socket.id);//给站点中除了自己的所有人回复
    })

    socket.on('leave', (room) => {
        var myRoom = io.sockets.adapter.rooms[room];
        var users = Object.keys(myRoom.sockets).length;

        logger.log('the number of user in room is: ' + users - 1);
        socket.leave(room);
        //socket.emit('joined', room, socket.id);//给自己回复
        //socket.to(room).emit('joined', room, socket.id);//给房间中除了自己的所有人回复
        //io.in(room).emit('joined', room, socket.id);//给房间中所有人回复
        socket.broadcast.emit('joined', room, socket.id);//给站点中除了自己的所有人回复
    })
});

https_server.listen(443, '0.0.0.0');

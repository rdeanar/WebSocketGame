var io = require('socket.io').listen(8000);

io.set('log level', 1);

var settings = {};


var store = {
    set: function(){
        var socket_id = socket.id;
        console.log('set to ' + socket_id);
    },
    get: function(){
        var socket_id = socket.id;
        console.log('get from ' + socket_id);
    }
};


var wsg = {};


wsg.games = {};
wsg.game_id = null; // unused

wsg.oneClientEmit = function(socket_id,event,data){
    io.sockets.sockets[socket_id].emit(event, data);
}

wsg.deleteSessionFromGame = function(socket_id){
    console.log('delete client with socket_id: ' + socket_id);
    //var client_id = socket.id;
    console.log('before delete', wsg.games);
    if(wsg.games.length > 0){
        for(i in wsg.games){
            if(wsg.games[i].display == socket_id){

                // оповещаем всех участников
                if (wsg.games[i].gamepads.length > 0) {
                    for (j in wsg.games[i].gamepads) {
                        wsg.oneClientEmit(wsg.games[i].gamepads[j], 'gameDestroy', 'Display shutdown');
                    }
                }

                // убиваем игру целиком
                delete wsg.games[i];
                console.log('delete display');
            }else{
                for(j in wsg.games[i].gamepads){
                    if(j == socket_id){
                        // Оповещаем сервак

                        if(wsg.games[i].gamepads.length <= 1)
                                wsg.oneClientEmit(wsg.games[i].display, 'gameDestroy', 'All gamepads disconnected');

                        // убиваем клиента из игры
                        delete wsg.games[i].gamepads[j];
                        console.log('delete gamepad');
                    }
                }
            }

        }
    }
    console.log('after delete',wsg.games);
}

// Навешиваем обработчик на подключение нового клиента
io.sockets.on('connection', function (socket) {

    var socket_id = socket.id;

    socket.on('displayConnect',function(data){
        var game_id = (socket.id).toString().substr(0, 5);
        // удаляем предыдущую сессию перед созданием игры
        wsg.deleteSessionFromGame(socket.id);
        wsg.games[game_id] = { display: socket.id, gamepads: {} }
        socket.emit('gameCreated', game_id);
        console.log(wsg.games);
    });

    socket.on('gamepadJoin',function(game_id){
        if(wsg.games[game_id]){
            // выходим из игры перед входом в новую
            wsg.deleteSessionFromGame(socket.id);
            var gpCount = wsg.games[game_id]['gamepads'];
            wsg.games[game_id]['gamepads'][socket.id] = socket.id;
            socket.emit('gamepadJoined', game_id);

            var display_id = wsg.games[game_id]['display'];
            wsg.oneClientEmit(display_id,'gamepadJoined',socket.id)
        }else{
            socket.emit('gamepadJoinFail', game_id);
        }
        console.log(wsg.games);
        socket.emit('gameCreated', game_id);
    });

    socket.on('gamepadTilt',function(coords){
            socket.broadcast.json.emit('gamepadTiltReaction', coords);
    });

    var time = (new Date).toLocaleTimeString();


    // Навешиваем обработчик на входящее сообщение
    socket.on('message', function (msg) {
        // Уведомляем клиента, что его сообщение успешно дошло до сервера
        socket.json.send({'event': 'messageSent', 'name': socket_id, 'text': msg, 'time': time});
        // Отсылаем сообщение остальным участникам чата
        socket.broadcast.json.send({'event': 'messageReceived', 'name': socket_id, 'text': msg, 'time': time})
    });


    // При отключении клиента - уведомляем остальных
    socket.on('disconnect', function() {
        console.log('DISCONNECT');

        wsg.deleteSessionFromGame(socket_id);

        //var time = (new Date).toLocaleTimeString();
        //io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
    });

});

window.wsg = window.wsg || {};

wsg.init = function () {
    // Создаем соединение с сервером; websockets почему-то в Хроме не работают, используем xhr
    if (navigator.userAgent.toLowerCase().indexOf('chrome') != -1 && false) {
        //socket = io.connect(config.ws, {'transports': ['xhr-polling']});
    } else {
        //socket = io.connect('http://localhost:8080');
        socket = io.connect(config.ws);
    }
    socket.on('connect', function () {
        socket.on('message', function (msg) {
            wsg.processMessage(msg);
        });

        socket.on('alert', function (msg) {
            alert(msg);
        });

    });

    wsg.bind();

    wsg.setupWorld();

    wsg.xArrowCss = new Arrow.init($('#slider2 > .square'), {mode: 'css'});
    wsg.xArrow = new Arrow.init(wsg.world.objects.arrow, {mode: 'canvans'});


};

wsg.world = {
    stage: null,
    layer: null,

    objects: {},

    dummy: null
};

wsg.setupWorld = function () {
    var stage = new Kinetic.Stage({
        container: 'canvans',
        width: 740,
        height: 200
    });

    wsg.world.stage = stage;

    var layer = new Kinetic.Layer();

    wsg.world.layer = layer;


    var poly = new Kinetic.Polygon({
        points: [10, 10, 0, -20, -10, 10],
        fill: Kinetic.Util.getRandomColor(),
        stroke: Kinetic.Util.getRandomColor(),
        strokeWidth: 1,
        x: 100,
        y: 100,

        draggable: false,
        id: 'canArrow'
    });
    wsg.world.objects.arrow = poly;

    wsg.world.layer.add(wsg.world.objects.arrow);
    wsg.world.stage.add(wsg.world.layer);
}

wsg.processMessage = function (msg) {
    if (msg.event && msg.event == 'messageSent' && false) {
        document.querySelector('#log').innerHTML += '<div class="message">' + msg.name + ': ' + msg.text + '</div>';
    } else {

        // Добавляем в лог сообщение, заменив время, имя и текст на полученные
        document.querySelector('#log').innerHTML += '<div class="message">' + (msg.name || '') + ': ' + (msg.text || msg) + '</div>';
    }
    // Прокручиваем лог в конец
    document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
}


wsg.tilt = function (coord) {
    //console.log(coord);

    $('#console').text(coord.join(', '));
    //wsg.processMessage( coord.join(', ') );

    socket.emit('gamepadTilt', coord);

    if (wsg.xArrow) wsg.xArrow.inputDegrees(coord[1]);
    if (wsg.xArrowCss) wsg.xArrowCss.inputDegrees(coord[1]);
}

wsg.bind = function () {

    if (wsg.env == 'display') {
        $('#createGame').click(function () {
            socket.emit('displayConnect');
            socket.on('gameCreated', function (game_id) {
                wsg.processMessage('game created with ID: ' + game_id);
            });


        });
        socket.on('gamepadJoined', function (client_id) {
            wsg.processMessage('Gamepad joined successful, ID: ' + client_id);
        });

        socket.on('gamepadTiltReaction', function (coord) {
            //socket.emit('gamepadTilt', coord);
            $('#console').html(coord.join('<br>'));
            if (wsg.xArrow) wsg.xArrow.inputDegrees(coord[1]);
            if (wsg.xArrowCss) wsg.xArrowCss.inputDegrees(coord[1]);
        });


    }
    if (wsg.env == 'gamepad') {


        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", function (event) {
                // macbook pro + android chrome
                //console.log(event);
                wsg.tilt([event.alpha, event.beta, event.gamma]);
            }, true);
        } else if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', function () {
                alert('window.DeviceMotionEvent');
                wsg.tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
            }, true);
        } else {
            window.addEventListener("MozOrientation", function () {
                alert('MozOrientation or other');
                wsg.tilt([orientation.x * 50, orientation.y * 50]);
            }, true);
        }


        $('#joinGame').click(function () {
            var game_id = $('#game_id').val();
            if (game_id.length > 0) {
                socket.emit('gamepadJoin', game_id);
                socket.on('gamepadJoined', function (game_id) {
                    wsg.processMessage('join successful to game: ' + game_id);
                });
                socket.on('gamepadJoinFail', function (game_id) {
                    wsg.processMessage('join failed to game: ' + game_id);
                });
            }


        });

    } // end GAMEPAD section


    socket.on('gameDestroy', function (message) {
        wsg.processMessage('GAME DESTROY. Possible reason: ' + message);
    });


    // При нажатии <Enter> или кнопки отправляем текст
    document.querySelector('#input').onkeypress = function (e) {
        if (e.which == '13') {
            // Отправляем содержимое input'а, закодированное в escape-последовательность
            socket.send(escape(document.querySelector('#input').value));
            // Очищаем input
            document.querySelector('#input').value = '';
        }
    };

    document.querySelector('#send').onclick = function () {
        socket.send(escape(document.querySelector('#input').value));
        document.querySelector('#input').value = '';
    };

}


$(document).on('ready', wsg.init);

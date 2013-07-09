window.wsg = window.wsg || {};


// Создаем текст сообщений для событий
strings = {
    'connected': '[sys][time]%time%[/time]: Вы успешно соединились к сервером как [user]%name%[/user].[/sys]',
    'userJoined': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] присоединился к чату.[/sys]',
    'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
    'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
    'userSplit': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] покинул чат.[/sys]'
};


wsg.init = function(){
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

};

wsg.processMessage = function(msg){
    if(msg.event && msg.event == 'messageSent' && false){
        document.querySelector('#log').innerHTML += '<div class="message">' + msg.name + ': ' + msg.text + '</div>';
    }else{

    // Добавляем в лог сообщение, заменив время, имя и текст на полученные
    document.querySelector('#log').innerHTML += '<div class="message">' + (msg.name || '') + ': ' + (msg.text || msg) + '</div>';
    }
    // Прокручиваем лог в конец
    document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
}

wsg.updateSlider = function(object, value){
    $(object).css('left',value + 180).data('tilt',value).attr('data-tilt',value);
}

wsg.tilt = function(coord){
    //console.log(coord);

    $('#console').text( coord.join(', ') );
    //wsg.processMessage( coord.join(', ') );

    socket.emit('gamepadTilt',coord);

    wsg.updateSlider($('#slider1 > .square'),coord[0]);
    wsg.updateSlider($('#slider2 > .square'),coord[1]);
    wsg.updateSlider($('#slider3 > .square'),coord[2]);
}

wsg.bind = function(){

    if(wsg.env == 'display'){
        $('#createGame').click(function(){
            socket.emit('displayConnect');
            socket.on('gameCreated', function (game_id) {
                wsg.processMessage('game created with ID: ' + game_id);
            });


        });
        socket.on('gamepadJoined', function (client_id) {
            wsg.processMessage('Gamepad joined successful, ID: ' + client_id);
        });


        var tilt_last = 0;
        var tilt_interval = setInterval(function(){
            var $el = $('#slider2 > .square');
            var tilt_now = $el.data('tilt');
            var $className = '';

            if(tilt_last < tilt_now){
                $className = 'right';
            }else{
                $className = 'left';
            }

            var $dx = Math.abs(tilt_last - tilt_now);

            if($dx <= 25){
                $className = '';
            }else if($dx > 40){
                $className += '2';
            }else if($dx > 25){
                $className += '1';
            }

            if(tilt_last != 0){
                console.log('BINGO!!');
            }

            $el.removeClass('left1').removeClass('left2').removeClass('right1').removeClass('right2');
            if($className != ''){
                $el.addClass($className);

                console.log($className);
            }

        },200);

        socket.on('gamepadTiltReaction',function(coord){
            //socket.emit('gamepadTilt', coord);
//            console.log(coord);
            $('#console').html( coord.join('<br>') );

            //wsg.updateSlider($('#slider1 > .square'),coord[0]);
            wsg.updateSlider($('#slider2 > .square'),coord[1]);
            //wsg.updateSlider($('#slider3 > .square'),coord[2]);
        });


    }
    if(wsg.env == 'gamepad'){


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



        $('#joinGame').click(function(){
            var game_id = $('#game_id').val();
            if(game_id.length > 0){
                socket.emit('gamepadJoin',game_id);
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
    document.querySelector('#input').onkeypress = function(e) {
        if (e.which == '13') {
            // Отправляем содержимое input'а, закодированное в escape-последовательность
            socket.send(escape(document.querySelector('#input').value));
            // Очищаем input
            document.querySelector('#input').value = '';
        }
    };

    document.querySelector('#send').onclick = function() {
        socket.send(escape(document.querySelector('#input').value));
        document.querySelector('#input').value = '';
    };

}


$(document).on('ready', wsg.init);

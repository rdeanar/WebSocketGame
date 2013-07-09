<?
include "config.php";

if($_SERVER['HTTP_HOST'] == 'localhost'){
    header('location: http://'.$config['ip'].'/display.php');
}

?>
<!doctype html>
    <html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <link href="style.css" rel="stylesheet">

        <script type="text/javascript">
            var wsg = { env : 'display' };
            var config = <?=json_encode($config)?>
        </script>

        <script type="text/javascript" src="vendor/frameworks/jquery/jquery.js"></script>
        <script type="text/javascript" src="vendor/jQueryRotate.2.2.js"></script>
        <script type="text/javascript" src="vendor/jquery.transit.min.js"></script>

        <script type="text/javascript" src="<?=$config['ws']?>/socket.io/socket.io.js"></script>
        <script src="client_model_arrow.js?<?=rand(111,999)?>"></script>
        <script src="client.js"></script>

    </head>
    <body>
    <div>
        <a href="<?='http://'.$config['ip'].'/display.php'?>">Display</a>,
        <a href="<?='http://'.$config['ip'].'/gamepad.php'?>">Gamepad</a>
    </div>
    <div id="log"></div>
    <input type="text" id="input" autofocus><input type="submit" id="send" value="Send">



    <button id="createGame">Create Game</button>

    <div id="console" style="border: 1px solid gray; height: 50px;">
        CONSOLE EMPTY
    </div>


    <div class="sliders">
        <div class="slider" id="slider1">
            <div class="square"></div>
        </div>
        <div class="slider" id="slider2">
            <div class="square"></div>
        </div>
        <div class="slider" id="slider3">
            <div class="square"></div>
        </div>
    </div>


    </body>
    </html>
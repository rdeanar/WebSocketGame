"use strict";

window.Arrow = window.Arrow ||
{

    element: null,

    start: false,
    position: 0,
    currentDegrees: 0,
    lastDegrees: 0,

    options: {
        move: true,
        speed: 0.5,
        shift: 180,
        scale: 1,
        updateMoveRate: 70,
        updateTiltRate: 200
    },

    init: function ($element, $options) {

        this.element = $element;

        if ($options != undefined)
            this.options = $options;


        this.calculatMove();
    },

    // maybe useless
    setObject: function ($object) {
        var object = $object;
    },

    inputDegrees: function (degrees) {
        this.currentDegrees = degrees;
        this.start = true;
    },

    calculatMove: function(){
        var model = this;
        var $el = this.element;
        var moveInterval = setInterval(function(){
            if(model.start && $el != null){


                var positionDx = parseInt( (model.options.speed * model.currentDegrees) );
                var positionAbsolute = model.position + positionDx + model.options.shift;
                var currentTilt = parseInt(model.currentDegrees); // *1.5

                // position correction
                if(positionAbsolute <= 0){
                    positionAbsolute = 0;
                    currentTilt  = 0;
                }else if(positionAbsolute >= 360){
                    positionAbsolute = 360;
                    currentTilt  = 0;
                }else{
                    model.position += positionDx;

                    if(currentTilt >= 90) currentTilt = 90;
                    if(currentTilt <= -90) currentTilt = -90;
                }

                //$el.css('left', positionAbsolute).rotate(currentTilt);
                $el.css('left', positionAbsolute).rotate(currentTilt);

                this.lastDegrees = this.currentDegrees;
            }
        },model.options.updateMoveRate);


    },

    startTilt: function () {
        var tilt_interval = setInterval(function () {
            var $el = $('#slider2 > .square');
            var tilt_now = $el.data('tilt');
            var $className = '';

            if (lastDegrees < tilt_now) {
                $className = 'right';
            } else {
                $className = 'left';
            }

            var $dx = Math.abs(lastDegrees - tilt_now);

            if ($dx <= 25) {
                $className = '';
            } else if ($dx > 40) {
                $className += '2';
            } else if ($dx > 25) {
                $className += '1';
            }

            if (lastDegrees != 0) {
                console.log('BINGO!!');
            }

            $el.removeClass('left1').removeClass('left2').removeClass('right1').removeClass('right2');
            if ($className != '') {
                $el.addClass($className);

                console.log($className);
            }

        }, 200);

    }

};






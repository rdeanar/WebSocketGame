"use strict";

var Arrow = function ($element, $options) {
    // private static
    var element = null;

    var start = false;
    var position = 0;
    var currentDegrees = 0;
    var lastDegrees = 0;

    var moveInterval = null;

    var options = {
        move: true,
        speed: 0.5,
        shift: 360,
        scale: 1,
        updateMoveRate: 20,
        updateTiltRate: 200,
        mode: 'canvans' // for back compatible
    };


    element = $element;
    $.extend(options, $options);
    this.calculateMove();


    this.inputDegrees = function (degrees) {
        console.log(options.mode, element);

        currentDegrees = degrees;
        start = true;
    };

    this.moveArrowCss = function (x) {
        element.css('left', x);
    };

    this.rotateArrowCss = function (deg) {
        element.rotate(deg);
    };

    this.calculateMove = function () {


        var self = this;
        moveInterval = setInterval(function () {
            if (start && element != null) {

                var positionDx = parseInt((options.speed * currentDegrees));
                var positionAbsolute = position + positionDx + options.shift;
                var currentTilt = parseInt(currentDegrees);
                var degreesDx = currentDegrees - lastDegrees;
                //var degreesDxToBeZero = currentDegrees - lastDegrees; // hack


                // position correction
                if (positionAbsolute <= 0) {
                    positionAbsolute = 0;
                    currentTilt = 0;
                } else if (positionAbsolute >= 720) {
                    positionAbsolute = 720;
                    currentTilt = 0;
                } else {
                    position += positionDx;

                    if (currentTilt >= 90) currentTilt = 90;
                    if (currentTilt <= -90) currentTilt = -90;
                }


                if (options.mode == 'css') {

                    self.moveArrowCss(positionAbsolute);
                    self.rotateArrowCss(currentTilt);
                } else {
                    element.setX(positionAbsolute);
                    element.rotateDeg(degreesDx);

                    var layer = element.getLayer();
                    layer.draw();
                }

                // setting up current degrees
                lastDegrees = currentDegrees;
            }
        }, options.updateMoveRate);

    } // end of this.calculateMove();


}




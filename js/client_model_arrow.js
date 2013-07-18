"use strict";

var Arrow = {};
(function () {
    Arrow.element = null;

    Arrow.start = false;
    Arrow.position = 0;
    Arrow.currentDegrees = 0;
    Arrow.lastDegrees = 0;

    Arrow.moveInterval = null;

    Arrow.options = {
        move: true,
        speed: 0.5,
        shift: 360,
        scale: 1,
        updateMoveRate: 20,
        updateTiltRate: 200,
        mode: 'canvans' // for back compatible
    };
    Arrow.init = function ($element, $options) {
        Arrow.element = $element;
        $.extend(Arrow.options, $options);
        Arrow.calculateMove();

        this.inputDegrees = function (degrees) {
            Arrow.currentDegrees = degrees;
            Arrow.start = true;
        };
    };

    /*
     Arrow.inputDegrees = function (degrees) {
     Arrow.currentDegrees = degrees;
     Arrow.start = true;
     };
     */

    Arrow.moveArrowCss = function (x) {
        var $el = Arrow.element;
        $el.css('left', x);
    };

    Arrow.rotateArrowCss = function (deg) {
        var $el = Arrow.element;
        $el.rotate(deg);
    };

    Arrow.calculateMove = function () {
        var model = Arrow;
        var $el = model.element;
        var moveInterval = setInterval(function () {
            if (model.start && $el != null) {

                var positionDx = parseInt((model.options.speed * model.currentDegrees));
                var positionAbsolute = model.position + positionDx + model.options.shift;
                var currentTilt = parseInt(model.currentDegrees);

                // position correction
                if (positionAbsolute <= 0) {
                    positionAbsolute = 0;
                    currentTilt = 0;
                } else if (positionAbsolute >= 720) {
                    positionAbsolute = 720;
                    currentTilt = 0;
                } else {
                    model.position += positionDx;

                    if (currentTilt >= 90) currentTilt = 90;
                    if (currentTilt <= -90) currentTilt = -90;
                }
                var degreesDx = model.currentDegrees - model.lastDegrees;

                //$el.css('left', positionAbsolute).rotate(currentTilt);
                //$el.css('left', positionAbsolute).rotate(currentTilt);
                if (model.options.mode == 'css') {
                    model.moveArrowCss(positionAbsolute);
                    model.rotateArrowCss(currentTilt);
                } else {
                    model.element.setX(positionAbsolute);
                    model.element.rotateDeg(degreesDx);
                    var layer = model.element.getLayer();
                    layer.draw();
                }

                // setting up current degrees
                model.lastDegrees = model.currentDegrees;
            }
        }, model.options.updateMoveRate);
    };


})();
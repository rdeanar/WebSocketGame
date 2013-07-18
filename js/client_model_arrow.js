"use strict";

var Arrow = {};
(function () {
    Arrow.init = function ($element, $options) {

        this.element = $element;

        this.start = false;
        this.position = 0;
        this.currentDegrees = 0;
        this.lastDegrees = 0;

        this.moveInterval = null;

        this.options = {
            move: true,
            speed: 0.5,
            shift: 360,
            scale: 1,
            updateMoveRate: 20,
            updateTiltRate: 200,
            mode: 'canvans' // for back compatible
        };


        $.extend(this.options, $options);

        this.inputDegrees = function (degrees) {
            this.currentDegrees = degrees;
            this.start = true;
        };

        this.moveArrowCss = function (x) {
            var $el = this.element;
            $el.css('left', x);
        };

        this.rotateArrowCss = function (deg) {
            var $el = this.element;
            $el.rotate(deg);
        };


        var model = this;
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

//                    if (model.options.mode == 'css') {

                if (model.element instanceof jQuery) {
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

//        this.calculateMove();

})();
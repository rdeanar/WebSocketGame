"use strict";

var Arrow = (function () {
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

    // constructor
    var cls = function ($element, $options) {
        // private
        element = $element;
        $.extend(options, $options);

        // public (this instance only)
        this.get_id = function () {
            return 'ID';
        }; // for documentation

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

        this.calculateMove();
    };

    // public static


    // public (shared across instances)
    cls.prototype = {
        announce: function () {
            alert('Hi there! My id is ' + this.get_id() + ' and my name is "' + this.get_name() + '"!\r\n' +
                'The next fellow\'s id will be ' + MyClass.get_nextId() + '!');
        }
    };


    return cls;
})();


/*
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
 shift: 360,
 scale: 1,
 updateMoveRate: 20,
 updateTiltRate: 200,
 mode:'canvans'
 },

 init: function ($element, $options) {
 this.element = $element;
 $.extend(this.options, $options);
 this.calculateMove();
 },

 // maybe useless
 setObject: function ($object) {
 var object = $object;
 },

 inputDegrees: function (degrees) {
 this.currentDegrees = degrees;
 this.start = true;
 },
 al: function(m){
 alert(m);
 },
 moveArrowCss: function(x){
 var $el = this.element;
 $el.css('left', x);
 },

 rotateArrowCss: function(deg){
 var $el = this.element;
 $el.rotate(deg);
 },

 calculateMove: function(){
 var model = this;
 var $el = this.element;
 var moveInterval = setInterval(function(){
 if(model.start && $el != null){


 var positionDx = parseInt( (model.options.speed * model.currentDegrees) );
 var positionAbsolute = model.position + positionDx + model.options.shift;
 var currentTilt = parseInt(model.currentDegrees);

 // position correction
 if(positionAbsolute <= 0){
 positionAbsolute = 0;
 currentTilt  = 0;
 }else if(positionAbsolute >= 720){
 positionAbsolute = 720;
 currentTilt  = 0;
 }else{
 model.position += positionDx;

 if(currentTilt >= 90) currentTilt = 90;
 if(currentTilt <= -90) currentTilt = -90;
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
 },model.options.updateMoveRate);


 }

 };
 */
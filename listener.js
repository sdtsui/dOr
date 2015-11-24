/**
 * [add_DeviceOrientation_listenerTo description]
 * @param {[type]} DOM_document [default window]
 * @param {[type]} debounceWait [default 250ms]
 */
var add_DeviceOrientation_listenerTo = function(DOM_document, debounceWait) {
    DOM_document = DOM_document || window;
    debounceWait = debounceWait || 250;
    var _currentVector = {
        x: 0,
        y: 0
    };
    var _window = [];

    if (DOM_document.DeviceOrientationEvent) {
        DOM_document.addEventListener("deviceorientation", function(event) {
            // alpha: rotation around z-axis
            // gamma: left to right
            // beta: front back motion
            var reading = {
                alpha: event.alpha,
                gamma: event.gamma,
                beta: event.beta
            };
            addReading(reading);
        }, true);
    };
    var db_calcVector = _.debounce(calcVector, debounceWait);

    return {
        getCurrentVector : calcVector
    };

    function calcVector() {
        var gammaAvg =  _window.reduce(function(prevVal, currentVal, currentIdx, arr) {
            return prevVal + currentVal.gamma;
        }, 0) / _window.length;
        var betaAvg =  _window.reduce(function(prevVal, currentVal, currentIdx, arr) {
            return prevVal + currentVal.beta;
        }, 0) / _window.length;
        //gamma X
        _currentVector.x = gammaAvg / 90;
        //Beta y
        _currentVector.y = (betaAvg / 90);
        if (Math.abs(_currentVector.y) > 1) {
            _currentVector.y = (_currentVector.y < 1) ? -1 : 1;
        };
        return _currentVector;
    };

    function addReading(reading) {
        if (_window.length > 5) {
            _window.shift();
        }
        _window.push(reading);
    };
}

module.exports = add_DeviceOrientation_listenerTo;
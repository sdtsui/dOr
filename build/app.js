(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var dOr = function dOr(windowSize, DOM_document, throttleInterval) {
  if (windowSize === undefined) windowSize = 5;
  if (DOM_document === undefined) DOM_document = window;

  var _windowSize = undefined,
      _document = undefined,
      _throttleInterval = undefined,
      __obj__ = undefined;
  var _window = [];
  var _dOr_data = {
    event: undefined,
    x: undefined,
    y: undefined
  };
  var _callbacks = [];

  /**
   * Root Constructor
   * @param {[type]} windowSize   [description]
   * @param {[type]} DOM_document [description]
   */
  function D(windowSize, DOM_document, throttleInterval) {
    _windowSize = windowSize;
    _document = DOM_document;
    _throttleInterval = throttleInterval || 250;
    var rootListener = function rootListener(event) {
      // alpha: rotation around z-axis
      // gamma: left to right
      // beta: front back motion
      var reading = {
        alpha: event.alpha,
        gamma: event.gamma,
        beta: event.beta
      };
      addReading(reading);
      this.updateData(event);
      _callbacks.forEach(function (cb) {
        cb(_dOr_data);
      });
    };
    rootListener = _throttle(rootListener, _throttleInterval);

    if (_document.DeviceOrientationEvent) {
      _document.addEventListener("deviceorientation", rootListener, true);
    };

    /**
     * Adds a reading to the _window array.
     * @param {[type]} reading [description]
     */
    function addReading(reading) {
      if (_window.length > _windowSize) {
        _window.shift();
      }
      _window.push(reading);
    }
  }

  /**
   * 
   * @return {[type]} [description]
   */
  D.prototype.updateData = function () {
    _dOr_data.event = event;
    var gammaAvg = _window.reduce(readingReducer('gamma'), 0) / _window.length;
    var betaAvg = _window.reduce(readingReducer('beta'), 0) / _window.length;

    //gamma X
    _dOr_data.x = gammaAvg / 90;
    //Beta y
    _dOr_data.y = betaAvg / 90;
    if (Math.abs(_dOr_data.y) > 1) {
      _dOr_data.y = _dOr_data.y < 1 ? -1 : 1;
    };

    return _dOr_data;

    function readingReducer(propName) {
      return function (prevVal, currentVal, currentIdx, arr) {
        return prevVal + currentVal[propName];
      };
    }
  };

  /**
   * returns current dOr_data
   * @return {[type]} [description]
   */
  D.prototype.getMostRecentEvent = function () {
    return _dOr_data;
  };

  /**
   * accepts a callback to invoke with dOr_data,
   * and an interval to throttle that callback by
   * @return {[type]} [description]
   */
  D.prototype.onTilt = function (cb, throttleInterval) {
    var newCB = _throttle(cb, throttleInterval || 250);
    _callbacks.push(newCB);
  };

  __obj__ = new D(windowSize, DOM_document, throttleInterval);
  __obj__.constructor = D;
  return __obj__;;

  //Credit to: underscore library, annotated source.
  function _throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function later() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function () {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };
};
console.log('before exports');

module.exports = dOr;

},{}],2:[function(require,module,exports){
'use strict';

var dOr = require('./dOr.js');
console.log('dor', dOr);

var listener = new dOr(5, window, 300);

listener.onTilt(function (data) {
  console.log(Date.now());
  console.log('ON TILT :', data);
}, 500);

},{"./dOr.js":1}]},{},[2])


//# sourceMappingURL=app.js.map

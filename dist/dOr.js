'use strict';

//Could rewrite throttle.
var _ = require('underscore');

var dOr = function dOr() {
  var windowSize = arguments.length <= 0 || arguments[0] === undefined ? 5 : arguments[0];
  var DOM_document = arguments.length <= 1 || arguments[1] === undefined ? window : arguments[1];
  var throttleInterval = arguments[2];

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
    rootListener = _.throttle(rootListener, _throttleInterval);

    if (_document.DeviceOrientationEvent) {
      _document.addEventListener("deviceorientation", rootListener.bind(this), true);
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
    var newCB = _.throttle(cb, throttleInterval || 250);
    _callbacks.push(newCB);
  };

  __obj__ = new D(windowSize, DOM_document, throttleInterval);
  __obj__.constructor = D;
  return __obj__;;
};

module.exports = dOr;
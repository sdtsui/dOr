let dOr = (function(
  windowSize = 5,
  DOM_document = window,
  throttleInterval
  ){
  let _windowSize, _document, _throttleInterval, __obj__;
  let _window = [];
  let _dOr_data = {
    event: undefined,
    x: undefined,
    y: undefined,
  };
  let _callbacks = [];
  
  /**
   * Root Constructor
   * @param {[type]} windowSize   [description]
   * @param {[type]} DOM_document [description]
   */
  function D(windowSize, DOM_document, throttleInterval) {
    _windowSize = windowSize;
    _document = DOM_document;
    _throttleInterval = throttleInterval || 250;
    let rootListener = function(event) {
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
      _callbacks.forEach((cb) => {
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
  D.prototype.updateData = () => {
    _dOr_data.event = event
    var gammaAvg = _window.reduce(readingReducer('gamma'), 0) / _window.length;
    var betaAvg = _window.reduce(readingReducer('beta'), 0) / _window.length;

    //gamma X
    _dOr_data.x = gammaAvg / 90;
    //Beta y
    _dOr_data.y = (betaAvg / 90);
    if (Math.abs(_dOr_data.y) > 1) {
        _dOr_data.y = (_dOr_data.y < 1) ? -1 : 1;
    };

    return _dOr_data;

    function readingReducer(propName) {
      return function(prevVal, currentVal, currentIdx, arr) {
        return prevVal + currentVal[propName];
      }
    }
  }

  /**
   * returns current dOr_data
   * @return {[type]} [description]
   */
  D.prototype.getMostRecentEvent = () => {
    return _dOr_data;
  }

  /**
   * accepts a callback to invoke with dOr_data,
   * and an interval to throttle that callback by
   * @return {[type]} [description]
   */
  D.prototype.onTilt = (cb, throttleInterval) => {
    let newCB = _throttle(cb, throttleInterval || 250);
    this._callbacks.push(newCB);
  }

  __obj__ = new D(windowSize, DOM_document, throttleInterval);
  __obj__.constructor = D;
  return __obj__;;

  //Credit to: underscore library, annotated source.
  function _throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
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
});


module.exports = dOr;
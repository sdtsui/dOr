let dOr = (function(
  windowSize = 5,
  DOM_document = window,
  ){
  let _windowSize, _document, __obj__;
  let _window = [];
  let _dOr_data = {
    event: undefined,
    x: undefined,
    y: undefined,
  };
  
  /**
   * Root Constructor
   * @param {[type]} windowSize   [description]
   * @param {[type]} DOM_document [description]
   */
  function D(windowSize, DOM_document) {
    _windowSize = windowSize;
    _document = DOM_document;
  }


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

  /**
   * Incomplete, needs a refactor
   * -calcVector or UpdateVector
   * -must change state of d_or data. may need to be debounced.
   * @return {[type]} [description]
   */
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
  D.prototype.onTilt = () => {

  }

  __obj__ = new D(windowSize, DOM_document);
  __obj__.constructor = D;
  return __obj__;;
});

//used for performant updating of vector
function _debounce() {

}

//used for .on functions
function _throttle() {

}
module.exports = dOr;
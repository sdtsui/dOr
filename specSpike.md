Internal Spec


Press release:
  - cleans up noise in rapid readings
  - updates reading at a constant rate
  - can subscribe impure functions
  - can have multiple listeners with different parameters
    - see open issues / roadmap, which I will never implement


Requirements:
-Apply ES6 Default Parameters
-Apply getify pattern

Constructor inputs:
  - throttleInterval || 250
  - averagingWindowSize || 5
  - DomBody || window

Interface:
  function getCurrentReading () {
    //return //currentAveragedReading
  }

  //Tip from Jacky: throttle should be in addNewReading/CalculateNewReading..
  //not exposed to external API.

  function throttledCurrentReading() {
  
  }
  function register (truthTest, callback) {
  //if truthTest(reading);
    //invoke callback(reading);
  }


____________
Roadmap: 

-Cache, store all readings somehow. (Redux Reducer, or LRU Cache?)
-Able to analyze internally, trigger events for gestures.



____________

tiltData Specification:
  tiltData, the object passed to all callbacks, has the following properties:

  `event` : this object is the original `deviceOrientation` event, with alpha, beta, and gamma properties
  `x` : a number from [-1, 1] mapping a degree of tilt to a gamma reading from [-90, 90]. x corresponds to the x-axis of a cartesian plane.
  `y` : same as x, but for the y-axis. [-1, 1] is mapped to beta values of [-90, 90]. Note that beta values are in [-180, 180]: in this case dOr will assume anything above a 90-degree tilt is 'maximum tilt', and will return a value


Roadmap (II):

`z` property, mapping alpha to tilt on the z axis. 
Tracking large numbers of readings over time in order to define custom gestures and trigger events when the are detected. Consider using a state storage solution like Redux, or an LRU Cache.


____________

Draft:

# dOr: 

`dOr` is a usability wrapper for the HTML5 deviceOrientation API. Its main features are as follows:
  - `dOr` Cleans up noise from imprecise readings, by taking the average of a 'window' of readings
  - `dOr` Provides a convenient interface for:
    - Accessing device orientation data, with readings stored in private data members hidden from the rest of your application
    - Throttling potentially expensive callback functions, that are frequently invoked on `deviceOrientation` events
    - Customizing the above functionaly. namely, average 'window' size, and throttle intervals

### Usage

Use npm and browserify. (to be completed)

  Instantiate dOr as follows:
```
  //instantiates a handler object, 10 will be the 'window' size, instead of a default of 5
  let dOr_handler = dOr(10); 

  //attaches a listener, with no throttling. this callback will respond to all deviceOrientation events
  dOr_handler.onTilt(function(dOr_data){…});

  //attaches a listener, throttling the callback at 500ms
  dOr_handler.onTilt(function(dOr_data){…}, 500);
```

The dOr object will add a `deviceOrientation` listener to `DOM_document`. If the corresponding optional paramater was passed, the callback function will be throttled.

### `dOr_data` Specification:  
  `dOr_data`, the object passed to all callbacks, has the following properties:

  > `event` : this object is the original `deviceOrientation` event, with alpha, beta, and gamma properties.   
  `x` : a number from [-1, 1] mapping a degree of tilt to a gamma reading from [-90, 90]. x corresponds to the x-axis of a cartesian plane.  
  `y` : same as x, but for the y-axis. [-1, 1] is mapped to beta values of [-90, 90]. Note that beta values are in [-180, 180]: in this case dOr will assume anything above a 90-degree tilt is 'maximum tilt', and will return a value of `-1` or `1`.
  
### Browser Differences:

dOr is tested in Chrome xxx. 

Note that `event.alpha` (or `dOr_data.alpha`) behaves differently in Mobile Safari, as explained in this HTML5Rocks [article](http://www.html5rocks.com/en/tutorials/device/orientation/).

> As mentioned earlier, alpha, beta and gamma are determined based on the position the device is with the local earth frame. For most browsers, alpha returns the compass heading, so when the device is pointed north, alpha is zero. With Mobile Safari, alpha is based on the direction the device was pointing when device orientation was first requested. The compass heading is available in the webkitCompassHeading parameter.

### Projects using dOr:  
1. [ThePullUpGame](http://lhr0909.github.io/ThePullUpGame/) (an early version of dOr)



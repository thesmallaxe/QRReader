(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
/* eslint-env browser */
'use strict';

var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);var _jquery2 = _interopRequireDefault(_jquery);
var _animation = require('modules/animation.js');var _animation2 = _interopRequireDefault(_animation);
var _takePhoto = require('modules/takePhoto.js');var _takePhoto2 = _interopRequireDefault(_takePhoto);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

(function ($) {
  $(document).ready(function () {
    ready();

    // Styleguide event when an element is rendered
    $(window).bind("styleguide:onRendered", function (e) {
      ready();
    });
  });

  // Initalizing all modules
  function ready() {
    (0, _animation2.default)();
    (0, _takePhoto2.default)();
  }
})(_jquery2.default);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"modules/animation.js":2,"modules/takePhoto.js":3}],2:[function(require,module,exports){
'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default =



function () {

  var width,height,largeHeader,canvas,ctx,points,target,animateHeader = true;

  // Main
  if ($('.landing').length) {
    initHeader();
    initAnimation();
    addListeners();
  }

  function initHeader() {
    width = window.innerWidth;
    height = window.innerHeight;
    target = { x: width / 2, y: height / 2 };

    largeHeader = document.getElementById('header');
    largeHeader.style.height = height + 'px';

    canvas = document.getElementById('animation-canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');

    // create points
    points = [];
    for (var x = 0; x < width; x = x + width / 20) {
      for (var y = 0; y < height; y = y + height / 20) {
        var px = x + Math.random() * width / 20;
        var py = y + Math.random() * height / 20;
        var p = { x: px, originX: px, y: py, originY: py };
        points.push(p);
      }
    }

    // for each point find the 5 closest points
    for (var i = 0; i < points.length; i++) {
      var closest = [];
      var p1 = points[i];
      for (var j = 0; j < points.length; j++) {
        var p2 = points[j];
        if (!(p1 == p2)) {
          var placed = false;
          for (var k = 0; k < 5; k++) {
            if (!placed) {
              if (closest[k] == undefined) {
                closest[k] = p2;
                placed = true;
              }
            }
          }

          for (var k = 0; k < 5; k++) {
            if (!placed) {
              if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                closest[k] = p2;
                placed = true;
              }
            }
          }
        }
      }
      p1.closest = closest;
    }

    // assign a circle to each point
    for (var i in points) {
      var c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
      points[i].circle = c;
    }
  }

  // Event handling
  function addListeners() {
    if (!('ontouchstart' in window)) {
      window.addEventListener('mousemove', mouseMove);
    }
    window.addEventListener('scroll', scrollCheck);
    window.addEventListener('resize', resize);
  }

  function mouseMove(e) {
    var posx = 0;
    var posy = 0;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else
    if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    target.x = posx;
    target.y = posy;
  }

  function scrollCheck() {
    if (document.body.scrollTop > height) animateHeader = false;else
    animateHeader = true;
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    largeHeader.style.height = height + 'px';
    canvas.width = width;
    canvas.height = height;
  }

  // animation
  function initAnimation() {
    animate();
    for (var i in points) {
      shiftPoint(points[i]);
    }
  }

  function animate() {
    if (animateHeader) {
      ctx.clearRect(0, 0, width, height);
      for (var i in points) {
        // detect points in range
        if (Math.abs(getDistance(target, points[i])) < 4000) {
          points[i].active = 0.3;
          points[i].circle.active = 0.6;
        } else if (Math.abs(getDistance(target, points[i])) < 20000) {
          points[i].active = 0.1;
          points[i].circle.active = 0.3;
        } else if (Math.abs(getDistance(target, points[i])) < 40000) {
          points[i].active = 0.02;
          points[i].circle.active = 0.1;
        } else {
          points[i].active = 0;
          points[i].circle.active = 0;
        }

        drawLines(points[i]);
        points[i].circle.draw();
      }
    }
    requestAnimationFrame(animate);
  }

  function shiftPoint(p) {
    TweenLite.to(p, 1 + 1 * Math.random(), {
      x: p.originX - 50 + Math.random() * 100,
      y: p.originY - 50 + Math.random() * 100, ease: Circ.easeInOut,
      onComplete: function onComplete() {
        shiftPoint(p);
      } });

  }

  // Canvas manipulation
  function drawLines(p) {
    if (!p.active) return;
    for (var i in p.closest) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.closest[i].x, p.closest[i].y);
      ctx.strokeStyle = 'rgba(243,100,36,' + p.active + ')';
      ctx.stroke();
    }
  }

  function Circle(pos, rad, color) {
    var _this = this;

    // constructor
    (function () {
      _this.pos = pos || null;
      _this.radius = rad || null;
      _this.color = color || null;
    })();

    this.draw = function () {
      if (!_this.active) return;
      ctx.beginPath();
      ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(243,100,36,' + _this.active + ')';
      ctx.fill();
    };
  }

  // Util
  function getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }
};

},{}],3:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default =



function () {
  // Database Setup
  var firebaseConfig = {
    apiKey: "AIzaSyAX0g-faZYiULDy_QiLMBxaigNBB85VAPI",
    authDomain: "reception-management.firebaseapp.com",
    databaseURL: "https://reception-management.firebaseio.com",
    projectId: "reception-management",
    storageBucket: "reception-management.appspot.com",
    messagingSenderId: "192413503859",
    appId: "1:192413503859:web:c8f9e78f7000d4ea" };


  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  // let filesRef = storageRef.child('photos/' + this.ID + '.jpg');

  // Grab elements, create settings, etc.
  var photoCanvas = document.getElementById('canvas');
  var context = photoCanvas.getContext('2d');
  var video = document.getElementById('video');
  var mediaConfig = { video: true };
  var errBack = function errBack(e) {
    console.log('An error has occurred!', e);
  };
  var videoWidth = 640;
  var videoHeight = 480;

  // Retrieve Data
  var ref = database.ref('visitors');
  ref.on('value', gotData, errData);

  function gotData(data) {
    console.log(data.val());
  }

  function errData(err) {
    console.log('Error!');
    console.log(err);
  }

  // Put video listeners into place
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(mediaConfig).then(function (stream) {
      // video.src = window.URL.createObjectURL(stream);
      video.srcObject = stream;
      video.play();
    });
  }

  /* Legacy code below! */else
    if (navigator.getUserMedia) {// Standard
      navigator.getUserMedia(mediaConfig, function (stream) {
        video.src = stream;
        video.play();
      }, errBack);
    } else if (navigator.webkitGetUserMedia) {// WebKit-prefixed
      navigator.webkitGetUserMedia(mediaConfig, function (stream) {
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
      }, errBack);
    } else if (navigator.mozGetUserMedia) {// Mozilla-prefixed
      navigator.mozGetUserMedia(mediaConfig, function (stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
      }, errBack);
    }

  // Has class function
  function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  // Trigger photo take
  document.getElementById('snap').addEventListener('click', function () {
    var video = document.getElementById('video');
    var photoCanvas = document.getElementById('canvas');
    var snapButton = document.getElementById('snap');

    context.drawImage(video, 0, 0, videoWidth, videoHeight);
    var image = photoCanvas.toDataURL('image/jpeg', 0.65);

    if (!snapButton.classList.contains('active')) {
      video.className = 'fadeOut';
      photoCanvas.className = 'fadeIn';
      snapButton.classList = 'btn-submit btn--small active';
      snapButton.textContent = "Retake Photo";
    } else {
      video.className = 'fadeIn';
      photoCanvas.className = 'fadeOut';
      snapButton.classList = 'btn-submit btn--small';
      snapButton.textContent = "Take Photo";
    }
  });

  document.getElementById('proceed').addEventListener('click', function () {
    // Write or Update Data
    var visitorID = sessionStorage.getItem("visitorID");
    var photoCanvas = document.getElementById('canvas');
    var image = photoCanvas.toDataURL('image/jpeg', 0.65);

    firebase.database().ref('/visitors/' + visitorID).once('value').then(function (snapshot) {

      var visitorData = snapshot.val();

      console.log(visitorData);

      visitorData.profilePicture = image;

      firebase.database().ref("visitors/" + visitorID).set(visitorData, function (error) {
        if (error) {
          console.log('Not done');
        } else {
          console.log('done');
          var current_url = window.location.href;
          window.location.href = current_url.replace("photo", "visitor");
        }
      });
    });
  });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2R1bGVzL2FuaW1hdGlvbi5qcyIsInNyYy9qcy9tb2R1bGVzL3Rha2VQaG90by5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBOztBQUVBLGdDO0FBQ0EsaUQ7QUFDQSxpRDs7QUFFQSxDQUFDLFVBQVUsQ0FBVixFQUFhO0FBQ1osSUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFZO0FBQzVCOztBQUVBO0FBQ0EsTUFBRSxNQUFGLEVBQVUsSUFBVixDQUFlLHVCQUFmLEVBQXdDLFVBQVUsQ0FBVixFQUFhO0FBQ25EO0FBQ0QsS0FGRDtBQUdELEdBUEQ7O0FBU0E7QUFDQSxXQUFTLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0Q7QUFDRixDQWZELEVBZUcsZ0JBZkg7Ozs7Ozs7OztBQ0hlLFlBQVk7O0FBRXpCLE1BQUksS0FBSixDQUFXLE1BQVgsQ0FBbUIsV0FBbkIsQ0FBZ0MsTUFBaEMsQ0FBd0MsR0FBeEMsQ0FBNkMsTUFBN0MsQ0FBcUQsTUFBckQsQ0FBNkQsZ0JBQWdCLElBQTdFOztBQUVBO0FBQ0EsTUFBSSxFQUFFLFVBQUYsRUFBYyxNQUFsQixFQUEwQjtBQUN4QjtBQUNBO0FBQ0E7QUFDRDs7QUFFRCxXQUFTLFVBQVQsR0FBc0I7QUFDcEIsWUFBUSxPQUFPLFVBQWY7QUFDQSxhQUFTLE9BQU8sV0FBaEI7QUFDQSxhQUFTLEVBQUUsR0FBRyxRQUFRLENBQWIsRUFBZ0IsR0FBRyxTQUFTLENBQTVCLEVBQVQ7O0FBRUEsa0JBQWMsU0FBUyxjQUFULENBQXdCLFFBQXhCLENBQWQ7QUFDQSxnQkFBWSxLQUFaLENBQWtCLE1BQWxCLEdBQTJCLFNBQVMsSUFBcEM7O0FBRUEsYUFBUyxTQUFTLGNBQVQsQ0FBd0Isa0JBQXhCLENBQVQ7QUFDQSxXQUFPLEtBQVAsR0FBZSxLQUFmO0FBQ0EsV0FBTyxNQUFQLEdBQWdCLE1BQWhCO0FBQ0EsVUFBTSxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBTjs7QUFFQTtBQUNBLGFBQVMsRUFBVDtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFwQixFQUEyQixJQUFJLElBQUksUUFBUSxFQUEzQyxFQUErQztBQUM3QyxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBcEIsRUFBNEIsSUFBSSxJQUFJLFNBQVMsRUFBN0MsRUFBaUQ7QUFDL0MsWUFBSSxLQUFLLElBQUksS0FBSyxNQUFMLEtBQWdCLEtBQWhCLEdBQXdCLEVBQXJDO0FBQ0EsWUFBSSxLQUFLLElBQUksS0FBSyxNQUFMLEtBQWdCLE1BQWhCLEdBQXlCLEVBQXRDO0FBQ0EsWUFBSSxJQUFJLEVBQUUsR0FBRyxFQUFMLEVBQVMsU0FBUyxFQUFsQixFQUFzQixHQUFHLEVBQXpCLEVBQTZCLFNBQVMsRUFBdEMsRUFBUjtBQUNBLGVBQU8sSUFBUCxDQUFZLENBQVo7QUFDRDtBQUNGOztBQUVEO0FBQ0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE9BQU8sTUFBM0IsRUFBbUMsR0FBbkMsRUFBd0M7QUFDdEMsVUFBSSxVQUFVLEVBQWQ7QUFDQSxVQUFJLEtBQUssT0FBTyxDQUFQLENBQVQ7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksT0FBTyxNQUEzQixFQUFtQyxHQUFuQyxFQUF3QztBQUN0QyxZQUFJLEtBQUssT0FBTyxDQUFQLENBQVQ7QUFDQSxZQUFJLEVBQUUsTUFBTSxFQUFSLENBQUosRUFBaUI7QUFDZixjQUFJLFNBQVMsS0FBYjtBQUNBLGVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUE0QjtBQUMxQixnQkFBSSxDQUFDLE1BQUwsRUFBYTtBQUNYLGtCQUFJLFFBQVEsQ0FBUixLQUFjLFNBQWxCLEVBQTZCO0FBQzNCLHdCQUFRLENBQVIsSUFBYSxFQUFiO0FBQ0EseUJBQVMsSUFBVDtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxlQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksQ0FBcEIsRUFBdUIsR0FBdkIsRUFBNEI7QUFDMUIsZ0JBQUksQ0FBQyxNQUFMLEVBQWE7QUFDWCxrQkFBSSxZQUFZLEVBQVosRUFBZ0IsRUFBaEIsSUFBc0IsWUFBWSxFQUFaLEVBQWdCLFFBQVEsQ0FBUixDQUFoQixDQUExQixFQUF1RDtBQUNyRCx3QkFBUSxDQUFSLElBQWEsRUFBYjtBQUNBLHlCQUFTLElBQVQ7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQUNGO0FBQ0QsU0FBRyxPQUFILEdBQWEsT0FBYjtBQUNEOztBQUVEO0FBQ0EsU0FBSyxJQUFJLENBQVQsSUFBYyxNQUFkLEVBQXNCO0FBQ3BCLFVBQUksSUFBSSxJQUFJLE1BQUosQ0FBVyxPQUFPLENBQVAsQ0FBWCxFQUFzQixJQUFJLEtBQUssTUFBTCxLQUFnQixDQUExQyxFQUE2Qyx1QkFBN0MsQ0FBUjtBQUNBLGFBQU8sQ0FBUCxFQUFVLE1BQVYsR0FBbUIsQ0FBbkI7QUFDRDtBQUNGOztBQUVEO0FBQ0EsV0FBUyxZQUFULEdBQXdCO0FBQ3RCLFFBQUksRUFBRSxrQkFBa0IsTUFBcEIsQ0FBSixFQUFpQztBQUMvQixhQUFPLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDLFNBQXJDO0FBQ0Q7QUFDRCxXQUFPLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLFdBQWxDO0FBQ0EsV0FBTyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxNQUFsQztBQUNEOztBQUVELFdBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQjtBQUNwQixRQUFJLE9BQU8sQ0FBWDtBQUNBLFFBQUksT0FBTyxDQUFYO0FBQ0EsUUFBSSxFQUFFLEtBQUYsSUFBVyxFQUFFLEtBQWpCLEVBQXdCO0FBQ3RCLGFBQU8sRUFBRSxLQUFUO0FBQ0EsYUFBTyxFQUFFLEtBQVQ7QUFDRCxLQUhEO0FBSUssUUFBSSxFQUFFLE9BQUYsSUFBYSxFQUFFLE9BQW5CLEVBQTRCO0FBQy9CLGFBQU8sRUFBRSxPQUFGLEdBQVksU0FBUyxJQUFULENBQWMsVUFBMUIsR0FBdUMsU0FBUyxlQUFULENBQXlCLFVBQXZFO0FBQ0EsYUFBTyxFQUFFLE9BQUYsR0FBWSxTQUFTLElBQVQsQ0FBYyxTQUExQixHQUFzQyxTQUFTLGVBQVQsQ0FBeUIsU0FBdEU7QUFDRDtBQUNELFdBQU8sQ0FBUCxHQUFXLElBQVg7QUFDQSxXQUFPLENBQVAsR0FBVyxJQUFYO0FBQ0Q7O0FBRUQsV0FBUyxXQUFULEdBQXVCO0FBQ3JCLFFBQUksU0FBUyxJQUFULENBQWMsU0FBZCxHQUEwQixNQUE5QixFQUFzQyxnQkFBZ0IsS0FBaEIsQ0FBdEM7QUFDSyxvQkFBZ0IsSUFBaEI7QUFDTjs7QUFFRCxXQUFTLE1BQVQsR0FBa0I7QUFDaEIsWUFBUSxPQUFPLFVBQWY7QUFDQSxhQUFTLE9BQU8sV0FBaEI7QUFDQSxnQkFBWSxLQUFaLENBQWtCLE1BQWxCLEdBQTJCLFNBQVMsSUFBcEM7QUFDQSxXQUFPLEtBQVAsR0FBZSxLQUFmO0FBQ0EsV0FBTyxNQUFQLEdBQWdCLE1BQWhCO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLGFBQVQsR0FBeUI7QUFDdkI7QUFDQSxTQUFLLElBQUksQ0FBVCxJQUFjLE1BQWQsRUFBc0I7QUFDcEIsaUJBQVcsT0FBTyxDQUFQLENBQVg7QUFDRDtBQUNGOztBQUVELFdBQVMsT0FBVCxHQUFtQjtBQUNqQixRQUFJLGFBQUosRUFBbUI7QUFDakIsVUFBSSxTQUFKLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixLQUFwQixFQUEyQixNQUEzQjtBQUNBLFdBQUssSUFBSSxDQUFULElBQWMsTUFBZCxFQUFzQjtBQUNwQjtBQUNBLFlBQUksS0FBSyxHQUFMLENBQVMsWUFBWSxNQUFaLEVBQW9CLE9BQU8sQ0FBUCxDQUFwQixDQUFULElBQTJDLElBQS9DLEVBQXFEO0FBQ25ELGlCQUFPLENBQVAsRUFBVSxNQUFWLEdBQW1CLEdBQW5CO0FBQ0EsaUJBQU8sQ0FBUCxFQUFVLE1BQVYsQ0FBaUIsTUFBakIsR0FBMEIsR0FBMUI7QUFDRCxTQUhELE1BR08sSUFBSSxLQUFLLEdBQUwsQ0FBUyxZQUFZLE1BQVosRUFBb0IsT0FBTyxDQUFQLENBQXBCLENBQVQsSUFBMkMsS0FBL0MsRUFBc0Q7QUFDM0QsaUJBQU8sQ0FBUCxFQUFVLE1BQVYsR0FBbUIsR0FBbkI7QUFDQSxpQkFBTyxDQUFQLEVBQVUsTUFBVixDQUFpQixNQUFqQixHQUEwQixHQUExQjtBQUNELFNBSE0sTUFHQSxJQUFJLEtBQUssR0FBTCxDQUFTLFlBQVksTUFBWixFQUFvQixPQUFPLENBQVAsQ0FBcEIsQ0FBVCxJQUEyQyxLQUEvQyxFQUFzRDtBQUMzRCxpQkFBTyxDQUFQLEVBQVUsTUFBVixHQUFtQixJQUFuQjtBQUNBLGlCQUFPLENBQVAsRUFBVSxNQUFWLENBQWlCLE1BQWpCLEdBQTBCLEdBQTFCO0FBQ0QsU0FITSxNQUdBO0FBQ0wsaUJBQU8sQ0FBUCxFQUFVLE1BQVYsR0FBbUIsQ0FBbkI7QUFDQSxpQkFBTyxDQUFQLEVBQVUsTUFBVixDQUFpQixNQUFqQixHQUEwQixDQUExQjtBQUNEOztBQUVELGtCQUFVLE9BQU8sQ0FBUCxDQUFWO0FBQ0EsZUFBTyxDQUFQLEVBQVUsTUFBVixDQUFpQixJQUFqQjtBQUNEO0FBQ0Y7QUFDRCwwQkFBc0IsT0FBdEI7QUFDRDs7QUFFRCxXQUFTLFVBQVQsQ0FBb0IsQ0FBcEIsRUFBdUI7QUFDckIsY0FBVSxFQUFWLENBQWEsQ0FBYixFQUFnQixJQUFJLElBQUksS0FBSyxNQUFMLEVBQXhCLEVBQXVDO0FBQ3JDLFNBQUcsRUFBRSxPQUFGLEdBQVksRUFBWixHQUFpQixLQUFLLE1BQUwsS0FBZ0IsR0FEQztBQUVyQyxTQUFHLEVBQUUsT0FBRixHQUFZLEVBQVosR0FBaUIsS0FBSyxNQUFMLEtBQWdCLEdBRkMsRUFFSSxNQUFNLEtBQUssU0FGZjtBQUdyQyxrQkFBWSxzQkFBWTtBQUN0QixtQkFBVyxDQUFYO0FBQ0QsT0FMb0MsRUFBdkM7O0FBT0Q7O0FBRUQ7QUFDQSxXQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0I7QUFDcEIsUUFBSSxDQUFDLEVBQUUsTUFBUCxFQUFlO0FBQ2YsU0FBSyxJQUFJLENBQVQsSUFBYyxFQUFFLE9BQWhCLEVBQXlCO0FBQ3ZCLFVBQUksU0FBSjtBQUNBLFVBQUksTUFBSixDQUFXLEVBQUUsQ0FBYixFQUFnQixFQUFFLENBQWxCO0FBQ0EsVUFBSSxNQUFKLENBQVcsRUFBRSxPQUFGLENBQVUsQ0FBVixFQUFhLENBQXhCLEVBQTJCLEVBQUUsT0FBRixDQUFVLENBQVYsRUFBYSxDQUF4QztBQUNBLFVBQUksV0FBSixHQUFrQixxQkFBcUIsRUFBRSxNQUF2QixHQUFnQyxHQUFsRDtBQUNBLFVBQUksTUFBSjtBQUNEO0FBQ0Y7O0FBRUQsV0FBUyxNQUFULENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLEtBQTFCLEVBQWlDO0FBQy9CLFFBQUksUUFBUSxJQUFaOztBQUVBO0FBQ0EsS0FBQyxZQUFZO0FBQ1gsWUFBTSxHQUFOLEdBQVksT0FBTyxJQUFuQjtBQUNBLFlBQU0sTUFBTixHQUFlLE9BQU8sSUFBdEI7QUFDQSxZQUFNLEtBQU4sR0FBYyxTQUFTLElBQXZCO0FBQ0QsS0FKRDs7QUFNQSxTQUFLLElBQUwsR0FBWSxZQUFZO0FBQ3RCLFVBQUksQ0FBQyxNQUFNLE1BQVgsRUFBbUI7QUFDbkIsVUFBSSxTQUFKO0FBQ0EsVUFBSSxHQUFKLENBQVEsTUFBTSxHQUFOLENBQVUsQ0FBbEIsRUFBcUIsTUFBTSxHQUFOLENBQVUsQ0FBL0IsRUFBa0MsTUFBTSxNQUF4QyxFQUFnRCxDQUFoRCxFQUFtRCxJQUFJLEtBQUssRUFBNUQsRUFBZ0UsS0FBaEU7QUFDQSxVQUFJLFNBQUosR0FBZ0IscUJBQXFCLE1BQU0sTUFBM0IsR0FBb0MsR0FBcEQ7QUFDQSxVQUFJLElBQUo7QUFDRCxLQU5EO0FBT0Q7O0FBRUQ7QUFDQSxXQUFTLFdBQVQsQ0FBcUIsRUFBckIsRUFBeUIsRUFBekIsRUFBNkI7QUFDM0IsV0FBTyxLQUFLLEdBQUwsQ0FBUyxHQUFHLENBQUgsR0FBTyxHQUFHLENBQW5CLEVBQXNCLENBQXRCLElBQTJCLEtBQUssR0FBTCxDQUFTLEdBQUcsQ0FBSCxHQUFPLEdBQUcsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBbEM7QUFDRDtBQUNGLEM7Ozs7Ozs7QUM1TGMsWUFBWTtBQUN6QjtBQUNBLE1BQUksaUJBQWlCO0FBQ25CLFlBQVEseUNBRFc7QUFFbkIsZ0JBQVksc0NBRk87QUFHbkIsaUJBQWEsNkNBSE07QUFJbkIsZUFBVyxzQkFKUTtBQUtuQixtQkFBZSxrQ0FMSTtBQU1uQix1QkFBbUIsY0FOQTtBQU9uQixXQUFPLHFDQVBZLEVBQXJCOzs7QUFVQTtBQUNBLFdBQVMsYUFBVCxDQUF1QixjQUF2QjtBQUNBLE1BQUksV0FBVyxTQUFTLFFBQVQsRUFBZjtBQUNBOztBQUVBO0FBQ0EsTUFBSSxjQUFjLFNBQVMsY0FBVCxDQUF3QixRQUF4QixDQUFsQjtBQUNBLE1BQUksVUFBVSxZQUFZLFVBQVosQ0FBdUIsSUFBdkIsQ0FBZDtBQUNBLE1BQUksUUFBUSxTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBWjtBQUNBLE1BQUksY0FBYyxFQUFFLE9BQU8sSUFBVCxFQUFsQjtBQUNBLE1BQUksVUFBVSxTQUFWLE9BQVUsQ0FBVSxDQUFWLEVBQWE7QUFDekIsWUFBUSxHQUFSLENBQVksd0JBQVosRUFBc0MsQ0FBdEM7QUFDRCxHQUZEO0FBR0EsTUFBSSxhQUFhLEdBQWpCO0FBQ0EsTUFBSSxjQUFjLEdBQWxCOztBQUVBO0FBQ0EsTUFBSSxNQUFNLFNBQVMsR0FBVCxDQUFhLFVBQWIsQ0FBVjtBQUNBLE1BQUksRUFBSixDQUFPLE9BQVAsRUFBZ0IsT0FBaEIsRUFBeUIsT0FBekI7O0FBRUEsV0FBUyxPQUFULENBQWlCLElBQWpCLEVBQXVCO0FBQ3JCLFlBQVEsR0FBUixDQUFZLEtBQUssR0FBTCxFQUFaO0FBQ0Q7O0FBRUQsV0FBUyxPQUFULENBQWlCLEdBQWpCLEVBQXNCO0FBQ3BCLFlBQVEsR0FBUixDQUFZLFFBQVo7QUFDQSxZQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJLFVBQVUsWUFBVixJQUEwQixVQUFVLFlBQVYsQ0FBdUIsWUFBckQsRUFBbUU7QUFDakUsY0FBVSxZQUFWLENBQXVCLFlBQXZCLENBQW9DLFdBQXBDLEVBQWlELElBQWpELENBQXNELFVBQVUsTUFBVixFQUFrQjtBQUN0RTtBQUNBLFlBQU0sU0FBTixHQUFrQixNQUFsQjtBQUNBLFlBQU0sSUFBTjtBQUNELEtBSkQ7QUFLRDs7QUFFRCwwQkFSQTtBQVNLLFFBQUksVUFBVSxZQUFkLEVBQTRCLENBQUU7QUFDakMsZ0JBQVUsWUFBVixDQUF1QixXQUF2QixFQUFvQyxVQUFVLE1BQVYsRUFBa0I7QUFDcEQsY0FBTSxHQUFOLEdBQVksTUFBWjtBQUNBLGNBQU0sSUFBTjtBQUNELE9BSEQsRUFHRyxPQUhIO0FBSUQsS0FMSSxNQUtFLElBQUksVUFBVSxrQkFBZCxFQUFrQyxDQUFFO0FBQ3pDLGdCQUFVLGtCQUFWLENBQTZCLFdBQTdCLEVBQTBDLFVBQVUsTUFBVixFQUFrQjtBQUMxRCxjQUFNLEdBQU4sR0FBWSxPQUFPLFNBQVAsQ0FBaUIsZUFBakIsQ0FBaUMsTUFBakMsQ0FBWjtBQUNBLGNBQU0sSUFBTjtBQUNELE9BSEQsRUFHRyxPQUhIO0FBSUQsS0FMTSxNQUtBLElBQUksVUFBVSxlQUFkLEVBQStCLENBQUU7QUFDdEMsZ0JBQVUsZUFBVixDQUEwQixXQUExQixFQUF1QyxVQUFVLE1BQVYsRUFBa0I7QUFDdkQsY0FBTSxHQUFOLEdBQVksT0FBTyxHQUFQLENBQVcsZUFBWCxDQUEyQixNQUEzQixDQUFaO0FBQ0EsY0FBTSxJQUFOO0FBQ0QsT0FIRCxFQUdHLE9BSEg7QUFJRDs7QUFFRDtBQUNBLFdBQVMsUUFBVCxDQUFrQixPQUFsQixFQUEyQixHQUEzQixFQUFnQztBQUM5QixXQUFPLENBQUMsTUFBTSxRQUFRLFNBQWQsR0FBMEIsR0FBM0IsRUFBZ0MsT0FBaEMsQ0FBd0MsTUFBTSxHQUFOLEdBQVksR0FBcEQsSUFBMkQsQ0FBQyxDQUFuRTtBQUNEOztBQUVEO0FBQ0EsV0FBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLGdCQUFoQyxDQUFpRCxPQUFqRCxFQUEwRCxZQUFZO0FBQ3BFLFFBQUksUUFBUSxTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBWjtBQUNBLFFBQUksY0FBYyxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBbEI7QUFDQSxRQUFJLGFBQWEsU0FBUyxjQUFULENBQXdCLE1BQXhCLENBQWpCOztBQUVBLFlBQVEsU0FBUixDQUFrQixLQUFsQixFQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixVQUEvQixFQUEyQyxXQUEzQztBQUNBLFFBQUksUUFBUSxZQUFZLFNBQVosQ0FBc0IsWUFBdEIsRUFBb0MsSUFBcEMsQ0FBWjs7QUFFQSxRQUFJLENBQUMsV0FBVyxTQUFYLENBQXFCLFFBQXJCLENBQThCLFFBQTlCLENBQUwsRUFBOEM7QUFDNUMsWUFBTSxTQUFOLEdBQWtCLFNBQWxCO0FBQ0Esa0JBQVksU0FBWixHQUF3QixRQUF4QjtBQUNBLGlCQUFXLFNBQVgsR0FBdUIsOEJBQXZCO0FBQ0EsaUJBQVcsV0FBWCxHQUF5QixjQUF6QjtBQUNELEtBTEQsTUFLTztBQUNMLFlBQU0sU0FBTixHQUFrQixRQUFsQjtBQUNBLGtCQUFZLFNBQVosR0FBd0IsU0FBeEI7QUFDQSxpQkFBVyxTQUFYLEdBQXVCLHVCQUF2QjtBQUNBLGlCQUFXLFdBQVgsR0FBeUIsWUFBekI7QUFDRDtBQUNGLEdBbkJEOztBQXFCQSxXQUFTLGNBQVQsQ0FBd0IsU0FBeEIsRUFBbUMsZ0JBQW5DLENBQW9ELE9BQXBELEVBQTZELFlBQVk7QUFDdkU7QUFDQSxRQUFJLFlBQVksZUFBZSxPQUFmLENBQXVCLFdBQXZCLENBQWhCO0FBQ0EsUUFBSSxjQUFjLFNBQVMsY0FBVCxDQUF3QixRQUF4QixDQUFsQjtBQUNBLFFBQUksUUFBUSxZQUFZLFNBQVosQ0FBc0IsWUFBdEIsRUFBb0MsSUFBcEMsQ0FBWjs7QUFFQSxhQUFTLFFBQVQsR0FBb0IsR0FBcEIsQ0FBd0IsZUFBZSxTQUF2QyxFQUFrRCxJQUFsRCxDQUF1RCxPQUF2RCxFQUFnRSxJQUFoRSxDQUFxRSxVQUFVLFFBQVYsRUFBb0I7O0FBRXZGLFVBQUksY0FBYyxTQUFTLEdBQVQsRUFBbEI7O0FBRUEsY0FBUSxHQUFSLENBQVksV0FBWjs7QUFFQSxrQkFBWSxjQUFaLEdBQTZCLEtBQTdCOztBQUVBLGVBQVMsUUFBVCxHQUFvQixHQUFwQixDQUF3QixjQUFjLFNBQXRDLEVBQWlELEdBQWpELENBQXFELFdBQXJELEVBQWtFLFVBQVUsS0FBVixFQUFpQjtBQUNqRixZQUFJLEtBQUosRUFBVztBQUNULGtCQUFRLEdBQVIsQ0FBWSxVQUFaO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsa0JBQVEsR0FBUixDQUFZLE1BQVo7QUFDQSxjQUFJLGNBQWMsT0FBTyxRQUFQLENBQWdCLElBQWxDO0FBQ0EsaUJBQU8sUUFBUCxDQUFnQixJQUFoQixHQUFzQixZQUFZLE9BQVosQ0FBb0IsT0FBcEIsRUFBNkIsU0FBN0IsQ0FBdEI7QUFDRDtBQUNGLE9BUkQ7QUFTRCxLQWpCRDtBQWtCRCxHQXhCRDtBQXlCRCxDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyogZXNsaW50LWVudiBicm93c2VyICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBqcXVlcnkgZnJvbSAnanF1ZXJ5JztcclxuaW1wb3J0IGFuaW1hdGlvbiBmcm9tICdtb2R1bGVzL2FuaW1hdGlvbi5qcyc7XHJcbmltcG9ydCB0YWtlUGhvdG8gZnJvbSAnbW9kdWxlcy90YWtlUGhvdG8uanMnO1xyXG5cclxuKGZ1bmN0aW9uICgkKSB7XHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgcmVhZHkoKTtcclxuXHJcbiAgICAvLyBTdHlsZWd1aWRlIGV2ZW50IHdoZW4gYW4gZWxlbWVudCBpcyByZW5kZXJlZFxyXG4gICAgJCh3aW5kb3cpLmJpbmQoXCJzdHlsZWd1aWRlOm9uUmVuZGVyZWRcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgcmVhZHkoKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAvLyBJbml0YWxpemluZyBhbGwgbW9kdWxlc1xyXG4gIGZ1bmN0aW9uIHJlYWR5KCkge1xyXG4gICAgYW5pbWF0aW9uKCk7XHJcbiAgICB0YWtlUGhvdG8oKTtcclxuICB9XHJcbn0pKGpxdWVyeSk7XHJcbiIsIi8qKlxyXG4gKiBBbmltYXRpb25cclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gIHZhciB3aWR0aCwgaGVpZ2h0LCBsYXJnZUhlYWRlciwgY2FudmFzLCBjdHgsIHBvaW50cywgdGFyZ2V0LCBhbmltYXRlSGVhZGVyID0gdHJ1ZTtcclxuXHJcbiAgLy8gTWFpblxyXG4gIGlmICgkKCcubGFuZGluZycpLmxlbmd0aCkge1xyXG4gICAgaW5pdEhlYWRlcigpO1xyXG4gICAgaW5pdEFuaW1hdGlvbigpO1xyXG4gICAgYWRkTGlzdGVuZXJzKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0SGVhZGVyKCkge1xyXG4gICAgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgIHRhcmdldCA9IHsgeDogd2lkdGggLyAyLCB5OiBoZWlnaHQgLyAyIH07XHJcblxyXG4gICAgbGFyZ2VIZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyJyk7XHJcbiAgICBsYXJnZUhlYWRlci5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xyXG5cclxuICAgIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbmltYXRpb24tY2FudmFzJyk7XHJcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgcG9pbnRzXHJcbiAgICBwb2ludHMgPSBbXTtcclxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgd2lkdGg7IHggPSB4ICsgd2lkdGggLyAyMCkge1xyXG4gICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGhlaWdodDsgeSA9IHkgKyBoZWlnaHQgLyAyMCkge1xyXG4gICAgICAgIHZhciBweCA9IHggKyBNYXRoLnJhbmRvbSgpICogd2lkdGggLyAyMDtcclxuICAgICAgICB2YXIgcHkgPSB5ICsgTWF0aC5yYW5kb20oKSAqIGhlaWdodCAvIDIwO1xyXG4gICAgICAgIHZhciBwID0geyB4OiBweCwgb3JpZ2luWDogcHgsIHk6IHB5LCBvcmlnaW5ZOiBweSB9O1xyXG4gICAgICAgIHBvaW50cy5wdXNoKHApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZm9yIGVhY2ggcG9pbnQgZmluZCB0aGUgNSBjbG9zZXN0IHBvaW50c1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNsb3Nlc3QgPSBbXTtcclxuICAgICAgdmFyIHAxID0gcG9pbnRzW2ldO1xyXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBvaW50cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIHZhciBwMiA9IHBvaW50c1tqXVxyXG4gICAgICAgIGlmICghKHAxID09IHAyKSkge1xyXG4gICAgICAgICAgdmFyIHBsYWNlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCA1OyBrKyspIHtcclxuICAgICAgICAgICAgaWYgKCFwbGFjZWQpIHtcclxuICAgICAgICAgICAgICBpZiAoY2xvc2VzdFtrXSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNsb3Nlc3Rba10gPSBwMjtcclxuICAgICAgICAgICAgICAgIHBsYWNlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCA1OyBrKyspIHtcclxuICAgICAgICAgICAgaWYgKCFwbGFjZWQpIHtcclxuICAgICAgICAgICAgICBpZiAoZ2V0RGlzdGFuY2UocDEsIHAyKSA8IGdldERpc3RhbmNlKHAxLCBjbG9zZXN0W2tdKSkge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VzdFtrXSA9IHAyO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcDEuY2xvc2VzdCA9IGNsb3Nlc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYXNzaWduIGEgY2lyY2xlIHRvIGVhY2ggcG9pbnRcclxuICAgIGZvciAodmFyIGkgaW4gcG9pbnRzKSB7XHJcbiAgICAgIHZhciBjID0gbmV3IENpcmNsZShwb2ludHNbaV0sIDIgKyBNYXRoLnJhbmRvbSgpICogMiwgJ3JnYmEoMjU1LDI1NSwyNTUsMC4zKScpO1xyXG4gICAgICBwb2ludHNbaV0uY2lyY2xlID0gYztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEV2ZW50IGhhbmRsaW5nXHJcbiAgZnVuY3Rpb24gYWRkTGlzdGVuZXJzKCkge1xyXG4gICAgaWYgKCEoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSkge1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlKTtcclxuICAgIH1cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzY3JvbGxDaGVjayk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1vdXNlTW92ZShlKSB7XHJcbiAgICB2YXIgcG9zeCA9IDA7XHJcbiAgICB2YXIgcG9zeSA9IDA7XHJcbiAgICBpZiAoZS5wYWdlWCB8fCBlLnBhZ2VZKSB7XHJcbiAgICAgIHBvc3ggPSBlLnBhZ2VYO1xyXG4gICAgICBwb3N5ID0gZS5wYWdlWTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGUuY2xpZW50WCB8fCBlLmNsaWVudFkpIHtcclxuICAgICAgcG9zeCA9IGUuY2xpZW50WCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xyXG4gICAgICBwb3N5ID0gZS5jbGllbnRZICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xyXG4gICAgfVxyXG4gICAgdGFyZ2V0LnggPSBwb3N4O1xyXG4gICAgdGFyZ2V0LnkgPSBwb3N5O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2Nyb2xsQ2hlY2soKSB7XHJcbiAgICBpZiAoZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPiBoZWlnaHQpIGFuaW1hdGVIZWFkZXIgPSBmYWxzZTtcclxuICAgIGVsc2UgYW5pbWF0ZUhlYWRlciA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZXNpemUoKSB7XHJcbiAgICB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgbGFyZ2VIZWFkZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcclxuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICB9XHJcblxyXG4gIC8vIGFuaW1hdGlvblxyXG4gIGZ1bmN0aW9uIGluaXRBbmltYXRpb24oKSB7XHJcbiAgICBhbmltYXRlKCk7XHJcbiAgICBmb3IgKHZhciBpIGluIHBvaW50cykge1xyXG4gICAgICBzaGlmdFBvaW50KHBvaW50c1tpXSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gICAgaWYgKGFuaW1hdGVIZWFkZXIpIHtcclxuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgZm9yICh2YXIgaSBpbiBwb2ludHMpIHtcclxuICAgICAgICAvLyBkZXRlY3QgcG9pbnRzIGluIHJhbmdlXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKGdldERpc3RhbmNlKHRhcmdldCwgcG9pbnRzW2ldKSkgPCA0MDAwKSB7XHJcbiAgICAgICAgICBwb2ludHNbaV0uYWN0aXZlID0gMC4zO1xyXG4gICAgICAgICAgcG9pbnRzW2ldLmNpcmNsZS5hY3RpdmUgPSAwLjY7XHJcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhnZXREaXN0YW5jZSh0YXJnZXQsIHBvaW50c1tpXSkpIDwgMjAwMDApIHtcclxuICAgICAgICAgIHBvaW50c1tpXS5hY3RpdmUgPSAwLjE7XHJcbiAgICAgICAgICBwb2ludHNbaV0uY2lyY2xlLmFjdGl2ZSA9IDAuMztcclxuICAgICAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGdldERpc3RhbmNlKHRhcmdldCwgcG9pbnRzW2ldKSkgPCA0MDAwMCkge1xyXG4gICAgICAgICAgcG9pbnRzW2ldLmFjdGl2ZSA9IDAuMDI7XHJcbiAgICAgICAgICBwb2ludHNbaV0uY2lyY2xlLmFjdGl2ZSA9IDAuMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcG9pbnRzW2ldLmFjdGl2ZSA9IDA7XHJcbiAgICAgICAgICBwb2ludHNbaV0uY2lyY2xlLmFjdGl2ZSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkcmF3TGluZXMocG9pbnRzW2ldKTtcclxuICAgICAgICBwb2ludHNbaV0uY2lyY2xlLmRyYXcoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2hpZnRQb2ludChwKSB7XHJcbiAgICBUd2VlbkxpdGUudG8ocCwgMSArIDEgKiBNYXRoLnJhbmRvbSgpLCB7XHJcbiAgICAgIHg6IHAub3JpZ2luWCAtIDUwICsgTWF0aC5yYW5kb20oKSAqIDEwMCxcclxuICAgICAgeTogcC5vcmlnaW5ZIC0gNTAgKyBNYXRoLnJhbmRvbSgpICogMTAwLCBlYXNlOiBDaXJjLmVhc2VJbk91dCxcclxuICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNoaWZ0UG9pbnQocCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gQ2FudmFzIG1hbmlwdWxhdGlvblxyXG4gIGZ1bmN0aW9uIGRyYXdMaW5lcyhwKSB7XHJcbiAgICBpZiAoIXAuYWN0aXZlKSByZXR1cm47XHJcbiAgICBmb3IgKHZhciBpIGluIHAuY2xvc2VzdCkge1xyXG4gICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgIGN0eC5tb3ZlVG8ocC54LCBwLnkpO1xyXG4gICAgICBjdHgubGluZVRvKHAuY2xvc2VzdFtpXS54LCBwLmNsb3Nlc3RbaV0ueSk7XHJcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI0MywxMDAsMzYsJyArIHAuYWN0aXZlICsgJyknO1xyXG4gICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBDaXJjbGUocG9zLCByYWQsIGNvbG9yKSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgIC8vIGNvbnN0cnVjdG9yXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICBfdGhpcy5wb3MgPSBwb3MgfHwgbnVsbDtcclxuICAgICAgX3RoaXMucmFkaXVzID0gcmFkIHx8IG51bGw7XHJcbiAgICAgIF90aGlzLmNvbG9yID0gY29sb3IgfHwgbnVsbDtcclxuICAgIH0pKCk7XHJcblxyXG4gICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIV90aGlzLmFjdGl2ZSkgcmV0dXJuO1xyXG4gICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgIGN0eC5hcmMoX3RoaXMucG9zLngsIF90aGlzLnBvcy55LCBfdGhpcy5yYWRpdXMsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgyNDMsMTAwLDM2LCcgKyBfdGhpcy5hY3RpdmUgKyAnKSc7XHJcbiAgICAgIGN0eC5maWxsKCk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gVXRpbFxyXG4gIGZ1bmN0aW9uIGdldERpc3RhbmNlKHAxLCBwMikge1xyXG4gICAgcmV0dXJuIE1hdGgucG93KHAxLnggLSBwMi54LCAyKSArIE1hdGgucG93KHAxLnkgLSBwMi55LCAyKTtcclxuICB9XHJcbn0iLCIvKipcclxuICogVGFrZSBwaG90b3MgZnJvbSB0aGUgQ2FtZXJhXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gIC8vIERhdGFiYXNlIFNldHVwXHJcbiAgbGV0IGZpcmViYXNlQ29uZmlnID0ge1xyXG4gICAgYXBpS2V5OiBcIkFJemFTeUFYMGctZmFaWWlVTER5X1FpTE1CeGFpZ05CQjg1VkFQSVwiLFxyXG4gICAgYXV0aERvbWFpbjogXCJyZWNlcHRpb24tbWFuYWdlbWVudC5maXJlYmFzZWFwcC5jb21cIixcclxuICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vcmVjZXB0aW9uLW1hbmFnZW1lbnQuZmlyZWJhc2Vpby5jb21cIixcclxuICAgIHByb2plY3RJZDogXCJyZWNlcHRpb24tbWFuYWdlbWVudFwiLFxyXG4gICAgc3RvcmFnZUJ1Y2tldDogXCJyZWNlcHRpb24tbWFuYWdlbWVudC5hcHBzcG90LmNvbVwiLFxyXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMTkyNDEzNTAzODU5XCIsXHJcbiAgICBhcHBJZDogXCIxOjE5MjQxMzUwMzg1OTp3ZWI6YzhmOWU3OGY3MDAwZDRlYVwiXHJcbiAgfTtcclxuXHJcbiAgLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZVxyXG4gIGZpcmViYXNlLmluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xyXG4gIGxldCBkYXRhYmFzZSA9IGZpcmViYXNlLmRhdGFiYXNlKCk7XHJcbiAgLy8gbGV0IGZpbGVzUmVmID0gc3RvcmFnZVJlZi5jaGlsZCgncGhvdG9zLycgKyB0aGlzLklEICsgJy5qcGcnKTtcclxuXHJcbiAgLy8gR3JhYiBlbGVtZW50cywgY3JlYXRlIHNldHRpbmdzLCBldGMuXHJcbiAgbGV0IHBob3RvQ2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xyXG4gIGxldCBjb250ZXh0ID0gcGhvdG9DYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICBsZXQgdmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW8nKTtcclxuICBsZXQgbWVkaWFDb25maWcgPSB7IHZpZGVvOiB0cnVlIH07XHJcbiAgbGV0IGVyckJhY2sgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgY29uc29sZS5sb2coJ0FuIGVycm9yIGhhcyBvY2N1cnJlZCEnLCBlKVxyXG4gIH07XHJcbiAgbGV0IHZpZGVvV2lkdGggPSA2NDA7XHJcbiAgbGV0IHZpZGVvSGVpZ2h0ID0gNDgwO1xyXG5cclxuICAvLyBSZXRyaWV2ZSBEYXRhXHJcbiAgdmFyIHJlZiA9IGRhdGFiYXNlLnJlZigndmlzaXRvcnMnKTtcclxuICByZWYub24oJ3ZhbHVlJywgZ290RGF0YSwgZXJyRGF0YSk7XHJcblxyXG4gIGZ1bmN0aW9uIGdvdERhdGEoZGF0YSkge1xyXG4gICAgY29uc29sZS5sb2coZGF0YS52YWwoKSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBlcnJEYXRhKGVycikge1xyXG4gICAgY29uc29sZS5sb2coJ0Vycm9yIScpO1xyXG4gICAgY29uc29sZS5sb2coZXJyKTtcclxuICB9XHJcblxyXG4gIC8vIFB1dCB2aWRlbyBsaXN0ZW5lcnMgaW50byBwbGFjZVxyXG4gIGlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzICYmIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XHJcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShtZWRpYUNvbmZpZykudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XHJcbiAgICAgIC8vIHZpZGVvLnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSk7XHJcbiAgICAgIHZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcclxuICAgICAgdmlkZW8ucGxheSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKiBMZWdhY3kgY29kZSBiZWxvdyEgKi9cclxuICBlbHNlIGlmIChuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKSB7IC8vIFN0YW5kYXJkXHJcbiAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKG1lZGlhQ29uZmlnLCBmdW5jdGlvbiAoc3RyZWFtKSB7XHJcbiAgICAgIHZpZGVvLnNyYyA9IHN0cmVhbTtcclxuICAgICAgdmlkZW8ucGxheSgpO1xyXG4gICAgfSwgZXJyQmFjayk7XHJcbiAgfSBlbHNlIGlmIChuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhKSB7IC8vIFdlYktpdC1wcmVmaXhlZFxyXG4gICAgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYShtZWRpYUNvbmZpZywgZnVuY3Rpb24gKHN0cmVhbSkge1xyXG4gICAgICB2aWRlby5zcmMgPSB3aW5kb3cud2Via2l0VVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pO1xyXG4gICAgICB2aWRlby5wbGF5KCk7XHJcbiAgICB9LCBlcnJCYWNrKTtcclxuICB9IGVsc2UgaWYgKG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEpIHsgLy8gTW96aWxsYS1wcmVmaXhlZFxyXG4gICAgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYShtZWRpYUNvbmZpZywgZnVuY3Rpb24gKHN0cmVhbSkge1xyXG4gICAgICB2aWRlby5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pO1xyXG4gICAgICB2aWRlby5wbGF5KCk7XHJcbiAgICB9LCBlcnJCYWNrKTtcclxuICB9XHJcblxyXG4gIC8vIEhhcyBjbGFzcyBmdW5jdGlvblxyXG4gIGZ1bmN0aW9uIGhhc0NsYXNzKGVsZW1lbnQsIGNscykge1xyXG4gICAgcmV0dXJuICgnICcgKyBlbGVtZW50LmNsYXNzTmFtZSArICcgJykuaW5kZXhPZignICcgKyBjbHMgKyAnICcpID4gLTE7XHJcbiAgfVxyXG5cclxuICAvLyBUcmlnZ2VyIHBob3RvIHRha2VcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc25hcCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvJyk7XHJcbiAgICBsZXQgcGhvdG9DYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XHJcbiAgICBsZXQgc25hcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzbmFwJyk7XHJcblxyXG4gICAgY29udGV4dC5kcmF3SW1hZ2UodmlkZW8sIDAsIDAsIHZpZGVvV2lkdGgsIHZpZGVvSGVpZ2h0KTtcclxuICAgIGxldCBpbWFnZSA9IHBob3RvQ2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvanBlZycsIDAuNjUpO1xyXG5cclxuICAgIGlmICghc25hcEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgIHZpZGVvLmNsYXNzTmFtZSA9ICdmYWRlT3V0JztcclxuICAgICAgcGhvdG9DYW52YXMuY2xhc3NOYW1lID0gJ2ZhZGVJbic7XHJcbiAgICAgIHNuYXBCdXR0b24uY2xhc3NMaXN0ID0gJ2J0bi1zdWJtaXQgYnRuLS1zbWFsbCBhY3RpdmUnO1xyXG4gICAgICBzbmFwQnV0dG9uLnRleHRDb250ZW50ID0gXCJSZXRha2UgUGhvdG9cIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZpZGVvLmNsYXNzTmFtZSA9ICdmYWRlSW4nO1xyXG4gICAgICBwaG90b0NhbnZhcy5jbGFzc05hbWUgPSAnZmFkZU91dCc7XHJcbiAgICAgIHNuYXBCdXR0b24uY2xhc3NMaXN0ID0gJ2J0bi1zdWJtaXQgYnRuLS1zbWFsbCc7XHJcbiAgICAgIHNuYXBCdXR0b24udGV4dENvbnRlbnQgPSBcIlRha2UgUGhvdG9cIjtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2NlZWQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIFdyaXRlIG9yIFVwZGF0ZSBEYXRhXHJcbiAgICBsZXQgdmlzaXRvcklEID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInZpc2l0b3JJRFwiKTtcclxuICAgIGxldCBwaG90b0NhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcclxuICAgIGxldCBpbWFnZSA9IHBob3RvQ2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvanBlZycsIDAuNjUpO1xyXG5cclxuICAgIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKCcvdmlzaXRvcnMvJyArIHZpc2l0b3JJRCkub25jZSgndmFsdWUnKS50aGVuKGZ1bmN0aW9uIChzbmFwc2hvdCkge1xyXG5cclxuICAgICAgbGV0IHZpc2l0b3JEYXRhID0gc25hcHNob3QudmFsKCk7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZyh2aXNpdG9yRGF0YSk7XHJcblxyXG4gICAgICB2aXNpdG9yRGF0YS5wcm9maWxlUGljdHVyZSA9IGltYWdlO1xyXG5cclxuICAgICAgZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoXCJ2aXNpdG9ycy9cIiArIHZpc2l0b3JJRCkuc2V0KHZpc2l0b3JEYXRhLCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3QgZG9uZScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZG9uZScpO1xyXG4gICAgICAgICAgbGV0IGN1cnJlbnRfdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9Y3VycmVudF91cmwucmVwbGFjZShcInBob3RvXCIsIFwidmlzaXRvclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0iXX0=

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
/* eslint-env browser */
'use strict';

var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);var _jquery2 = _interopRequireDefault(_jquery);
var _qrGenerator = require('modules/qrGenerator.js');var _qrGenerator2 = _interopRequireDefault(_qrGenerator);
var _animation = require('modules/animation.js');var _animation2 = _interopRequireDefault(_animation);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

(function ($) {
  $(document).ready(function () {
    ready();
  });

  // Initalizing all modules
  function ready() {
    (0, _qrGenerator2.default)();
    (0, _animation2.default)();
  }
})(_jquery2.default);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"modules/animation.js":2,"modules/qrGenerator.js":3}],2:[function(require,module,exports){
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

  var codeWriter = new ZXing.BrowserQRCodeSvgWriter();
  var svgElement = void 0;

  // Sending data to Firebase Database
  function writeUserData(visitorID, name, contact, nic, email, vehicleNo) {
    firebase.database().ref("visitors/" + visitorID).set({
      ID: visitorID,
      Name: name,
      Contact: contact,
      NIC: nic,
      Email: email,
      Vehicle: vehicleNo,
      Visited: "No" });

  }

  // Filling background colour of Canvas
  function fillCanvasBackgroundWithColor(canvas, color) {
    var context = canvas.getContext('2d');
    context.save();
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }

  // Function write QR
  function generateQR(visitorID, name, contact, nic, email, vehicleNo) {
    // Calling Firebase Write
    writeUserData(visitorID, name, contact, nic, email, vehicleNo);
    // Write QR
    svgElement = codeWriter.writeToDom(
    '#result',
    visitorID,
    250,
    250);

  }

  /* Form validation */
  // Focus Input
  $('.data-form__form input').each(function () {
    $(this).on('blur', function () {
      if ($(this).val().trim() != "") {
        $(this).addClass('has-val');
      } else
      {
        $(this).removeClass('has-val');
      }
    });
  });

  // Validate
  var input = $('.validate-input input');

  $('.data-form__form').submit(function (e) {
    e.preventDefault();

    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    return check;
  });


  $('.data-form__form input').each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
      if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        return false;
      }
    } else
    {
      if ($(input).val().trim() == '') {
        return false;
      }
    }
  }

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
  }

  // Download QR function
  function downloadQR(filename) {
    canvg(document.getElementById("canvas"), $("#result").html());

    var canvas = document.getElementById("canvas");
    fillCanvasBackgroundWithColor(canvas, '#fff');
    var img = canvas.toDataURL("image/png");

    // Download function as an image
    var element = document.createElement('a');
    element.setAttribute('href', img);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // Defining form button element
  var submitBtn = $('#submitBtn');

  // Validate
  var input = $('.validate-input input');

  $('.data-form__form').submit(function (e) {
    e.preventDefault();

    //Defining form elements
    var visitorID = 'v' + Math.random().toString(36).substr(2, 6);
    var name = $('#name').val();
    var contact = $('#contact').val();
    var nic = $('#nic').val();
    var email = $('#email').val();
    var vehicleNo = $('#vehicle-no').val();

    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    if (check) {
      generateQR(visitorID, name, contact, nic, email, vehicleNo);
      downloadQR(name);
    }

    return check;
  });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2R1bGVzL2FuaW1hdGlvbi5qcyIsInNyYy9qcy9tb2R1bGVzL3FyR2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7O0FBRUEsZ0M7QUFDQSxxRDtBQUNBLGlEOztBQUVBLENBQUMsVUFBVSxDQUFWLEVBQWE7QUFDWixJQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVk7QUFDNUI7QUFDRCxHQUZEOztBQUlBO0FBQ0EsV0FBUyxLQUFULEdBQWlCO0FBQ2Y7QUFDQTtBQUNEO0FBQ0YsQ0FWRCxFQVVHLGdCQVZIOzs7Ozs7Ozs7QUNIZSxZQUFZOztBQUV6QixNQUFJLEtBQUosQ0FBVyxNQUFYLENBQW1CLFdBQW5CLENBQWdDLE1BQWhDLENBQXdDLEdBQXhDLENBQTZDLE1BQTdDLENBQXFELE1BQXJELENBQTZELGdCQUFnQixJQUE3RTs7QUFFQTtBQUNBLE1BQUksRUFBRSxVQUFGLEVBQWMsTUFBbEIsRUFBMEI7QUFDeEI7QUFDQTtBQUNBO0FBQ0Q7O0FBRUQsV0FBUyxVQUFULEdBQXNCO0FBQ3BCLFlBQVEsT0FBTyxVQUFmO0FBQ0EsYUFBUyxPQUFPLFdBQWhCO0FBQ0EsYUFBUyxFQUFFLEdBQUcsUUFBUSxDQUFiLEVBQWdCLEdBQUcsU0FBUyxDQUE1QixFQUFUOztBQUVBLGtCQUFjLFNBQVMsY0FBVCxDQUF3QixRQUF4QixDQUFkO0FBQ0EsZ0JBQVksS0FBWixDQUFrQixNQUFsQixHQUEyQixTQUFTLElBQXBDOztBQUVBLGFBQVMsU0FBUyxjQUFULENBQXdCLGtCQUF4QixDQUFUO0FBQ0EsV0FBTyxLQUFQLEdBQWUsS0FBZjtBQUNBLFdBQU8sTUFBUCxHQUFnQixNQUFoQjtBQUNBLFVBQU0sT0FBTyxVQUFQLENBQWtCLElBQWxCLENBQU47O0FBRUE7QUFDQSxhQUFTLEVBQVQ7QUFDQSxTQUFL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LFdBQU8sS0FBUDtBQUNELEdBMUJEO0FBMkJELEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGpxdWVyeSBmcm9tICdqcXVlcnknO1xuaW1wb3J0IHFyR2VuZXJhdG9yIGZyb20gJ21vZHVsZXMvcXJHZW5lcmF0b3IuanMnO1xuaW1wb3J0IGFuaW1hdGlvbiBmcm9tICdtb2R1bGVzL2FuaW1hdGlvbi5qcyc7XG5cbihmdW5jdGlvbiAoJCkge1xuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgcmVhZHkoKTtcbiAgfSk7XG5cbiAgLy8gSW5pdGFsaXppbmcgYWxsIG1vZHVsZXNcbiAgZnVuY3Rpb24gcmVhZHkoKSB7XG4gICAgcXJHZW5lcmF0b3IoKTtcbiAgICBhbmltYXRpb24oKTtcbiAgfVxufSkoanF1ZXJ5KTtcbiIsIi8qKlxuICogQW5pbWF0aW9uXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xuXG4gIHZhciB3aWR0aCwgaGVpZ2h0LCBsYXJnZUhlYWRlciwgY2FudmFzLCBjdHgsIHBvaW50cywgdGFyZ2V0LCBhbmltYXRlSGVhZGVyID0gdHJ1ZTtcblxuICAvLyBNYWluXG4gIGlmICgkKCcubGFuZGluZycpLmxlbmd0aCkge1xuICAgIGluaXRIZWFkZXIoKTtcbiAgICBpbml0QW5pbWF0aW9uKCk7XG4gICAgYWRkTGlzdGVuZXJzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0SGVhZGVyKCkge1xuICAgIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRhcmdldCA9IHsgeDogd2lkdGggLyAyLCB5OiBoZWlnaHQgLyAyIH07XG5cbiAgICBsYXJnZUhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXInKTtcbiAgICBsYXJnZUhlYWRlci5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG4gICAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FuaW1hdGlvbi1jYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgLy8gY3JlYXRlIHBvaW50c1xuICAgIHBvaW50cyA9IFtdO1xuICAgIGZvciAodmFyIHggPSAwOyB4IDwgd2lkdGg7IHggPSB4ICsgd2lkdGggLyAyMCkge1xuICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBoZWlnaHQ7IHkgPSB5ICsgaGVpZ2h0IC8gMjApIHtcbiAgICAgICAgdmFyIHB4ID0geCArIE1hdGgucmFuZG9tKCkgKiB3aWR0aCAvIDIwO1xuICAgICAgICB2YXIgcHkgPSB5ICsgTWF0aC5yYW5kb20oKSAqIGhlaWdodCAvIDIwO1xuICAgICAgICB2YXIgcCA9IHsgeDogcHgsIG9yaWdpblg6IHB4LCB5OiBweSwgb3JpZ2luWTogcHkgfTtcbiAgICAgICAgcG9pbnRzLnB1c2gocCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZm9yIGVhY2ggcG9pbnQgZmluZCB0aGUgNSBjbG9zZXN0IHBvaW50c1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2xvc2VzdCA9IFtdO1xuICAgICAgdmFyIHAxID0gcG9pbnRzW2ldO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwb2ludHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdmFyIHAyID0gcG9pbnRzW2pdXG4gICAgICAgIGlmICghKHAxID09IHAyKSkge1xuICAgICAgICAgIHZhciBwbGFjZWQgPSBmYWxzZTtcbiAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IDU7IGsrKykge1xuICAgICAgICAgICAgaWYgKCFwbGFjZWQpIHtcbiAgICAgICAgICAgICAgaWYgKGNsb3Nlc3Rba10gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY2xvc2VzdFtrXSA9IHAyO1xuICAgICAgICAgICAgICAgIHBsYWNlZCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IDU7IGsrKykge1xuICAgICAgICAgICAgaWYgKCFwbGFjZWQpIHtcbiAgICAgICAgICAgICAgaWYgKGdldERpc3RhbmNlKHAxLCBwMikgPCBnZXREaXN0YW5jZShwMSwgY2xvc2VzdFtrXSkpIHtcbiAgICAgICAgICAgICAgICBjbG9zZXN0W2tdID0gcDI7XG4gICAgICAgICAgICAgICAgcGxhY2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcDEuY2xvc2VzdCA9IGNsb3Nlc3Q7XG4gICAgfVxuXG4gICAgLy8gYXNzaWduIGEgY2lyY2xlIHRvIGVhY2ggcG9pbnRcbiAgICBmb3IgKHZhciBpIGluIHBvaW50cykge1xuICAgICAgdmFyIGMgPSBuZXcgQ2lyY2xlKHBvaW50c1tpXSwgMiArIE1hdGgucmFuZG9tKCkgKiAyLCAncmdiYSgyNTUsMjU1LDI1NSwwLjMpJyk7XG4gICAgICBwb2ludHNbaV0uY2lyY2xlID0gYztcbiAgICB9XG4gIH1cblxuICAvLyBFdmVudCBoYW5kbGluZ1xuICBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKCEoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlTW92ZSk7XG4gICAgfVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzY3JvbGxDaGVjayk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZU1vdmUoZSkge1xuICAgIHZhciBwb3N4ID0gMDtcbiAgICB2YXIgcG9zeSA9IDA7XG4gICAgaWYgKGUucGFnZVggfHwgZS5wYWdlWSkge1xuICAgICAgcG9zeCA9IGUucGFnZVg7XG4gICAgICBwb3N5ID0gZS5wYWdlWTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZS5jbGllbnRYIHx8IGUuY2xpZW50WSkge1xuICAgICAgcG9zeCA9IGUuY2xpZW50WCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgcG9zeSA9IGUuY2xpZW50WSArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICB9XG4gICAgdGFyZ2V0LnggPSBwb3N4O1xuICAgIHRhcmdldC55ID0gcG9zeTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjcm9sbENoZWNrKCkge1xuICAgIGlmIChkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA+IGhlaWdodCkgYW5pbWF0ZUhlYWRlciA9IGZhbHNlO1xuICAgIGVsc2UgYW5pbWF0ZUhlYWRlciA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiByZXNpemUoKSB7XG4gICAgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbGFyZ2VIZWFkZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgLy8gYW5pbWF0aW9uXG4gIGZ1bmN0aW9uIGluaXRBbmltYXRpb24oKSB7XG4gICAgYW5pbWF0ZSgpO1xuICAgIGZvciAodmFyIGkgaW4gcG9pbnRzKSB7XG4gICAgICBzaGlmdFBvaW50KHBvaW50c1tpXSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICBpZiAoYW5pbWF0ZUhlYWRlcikge1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIGZvciAodmFyIGkgaW4gcG9pbnRzKSB7XG4gICAgICAgIC8vIGRldGVjdCBwb2ludHMgaW4gcmFuZ2VcbiAgICAgICAgaWYgKE1hdGguYWJzKGdldERpc3RhbmNlKHRhcmdldCwgcG9pbnRzW2ldKSkgPCA0MDAwKSB7XG4gICAgICAgICAgcG9pbnRzW2ldLmFjdGl2ZSA9IDAuMztcbiAgICAgICAgICBwb2ludHNbaV0uY2lyY2xlLmFjdGl2ZSA9IDAuNjtcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhnZXREaXN0YW5jZSh0YXJnZXQsIHBvaW50c1tpXSkpIDwgMjAwMDApIHtcbiAgICAgICAgICBwb2ludHNbaV0uYWN0aXZlID0gMC4xO1xuICAgICAgICAgIHBvaW50c1tpXS5jaXJjbGUuYWN0aXZlID0gMC4zO1xuICAgICAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGdldERpc3RhbmNlKHRhcmdldCwgcG9pbnRzW2ldKSkgPCA0MDAwMCkge1xuICAgICAgICAgIHBvaW50c1tpXS5hY3RpdmUgPSAwLjAyO1xuICAgICAgICAgIHBvaW50c1tpXS5jaXJjbGUuYWN0aXZlID0gMC4xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBvaW50c1tpXS5hY3RpdmUgPSAwO1xuICAgICAgICAgIHBvaW50c1tpXS5jaXJjbGUuYWN0aXZlID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYXdMaW5lcyhwb2ludHNbaV0pO1xuICAgICAgICBwb2ludHNbaV0uY2lyY2xlLmRyYXcoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hpZnRQb2ludChwKSB7XG4gICAgVHdlZW5MaXRlLnRvKHAsIDEgKyAxICogTWF0aC5yYW5kb20oKSwge1xuICAgICAgeDogcC5vcmlnaW5YIC0gNTAgKyBNYXRoLnJhbmRvbSgpICogMTAwLFxuICAgICAgeTogcC5vcmlnaW5ZIC0gNTAgKyBNYXRoLnJhbmRvbSgpICogMTAwLCBlYXNlOiBDaXJjLmVhc2VJbk91dCxcbiAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2hpZnRQb2ludChwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIENhbnZhcyBtYW5pcHVsYXRpb25cbiAgZnVuY3Rpb24gZHJhd0xpbmVzKHApIHtcbiAgICBpZiAoIXAuYWN0aXZlKSByZXR1cm47XG4gICAgZm9yICh2YXIgaSBpbiBwLmNsb3Nlc3QpIHtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8ocC54LCBwLnkpO1xuICAgICAgY3R4LmxpbmVUbyhwLmNsb3Nlc3RbaV0ueCwgcC5jbG9zZXN0W2ldLnkpO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjQzLDEwMCwzNiwnICsgcC5hY3RpdmUgKyAnKSc7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gQ2lyY2xlKHBvcywgcmFkLCBjb2xvcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5wb3MgPSBwb3MgfHwgbnVsbDtcbiAgICAgIF90aGlzLnJhZGl1cyA9IHJhZCB8fCBudWxsO1xuICAgICAgX3RoaXMuY29sb3IgPSBjb2xvciB8fCBudWxsO1xuICAgIH0pKCk7XG5cbiAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIV90aGlzLmFjdGl2ZSkgcmV0dXJuO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4LmFyYyhfdGhpcy5wb3MueCwgX3RoaXMucG9zLnksIF90aGlzLnJhZGl1cywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgyNDMsMTAwLDM2LCcgKyBfdGhpcy5hY3RpdmUgKyAnKSc7XG4gICAgICBjdHguZmlsbCgpO1xuICAgIH07XG4gIH1cblxuICAvLyBVdGlsXG4gIGZ1bmN0aW9uIGdldERpc3RhbmNlKHAxLCBwMikge1xuICAgIHJldHVybiBNYXRoLnBvdyhwMS54IC0gcDIueCwgMikgKyBNYXRoLnBvdyhwMS55IC0gcDIueSwgMik7XG4gIH1cbn0iLCIvKipcbiAqIFFSIEdlbmVyYXRvclxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcbiAgbGV0IGZpcmViYXNlQ29uZmlnID0ge1xuICAgIGFwaUtleTogXCJBSXphU3lBWDBnLWZhWllpVUxEeV9RaUxNQnhhaWdOQkI4NVZBUElcIixcbiAgICBhdXRoRG9tYWluOiBcInJlY2VwdGlvbi1tYW5hZ2VtZW50LmZpcmViYXNlYXBwLmNvbVwiLFxuICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vcmVjZXB0aW9uLW1hbmFnZW1lbnQuZmlyZWJhc2Vpby5jb21cIixcbiAgICBwcm9qZWN0SWQ6IFwicmVjZXB0aW9uLW1hbmFnZW1lbnRcIixcbiAgICBzdG9yYWdlQnVja2V0OiBcInJlY2VwdGlvbi1tYW5hZ2VtZW50LmFwcHNwb3QuY29tXCIsXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMTkyNDEzNTAzODU5XCIsXG4gICAgYXBwSWQ6IFwiMToxOTI0MTM1MDM4NTk6d2ViOmM4ZjllNzhmNzAwMGQ0ZWFcIlxuICB9O1xuXG4gIC8vIEluaXRpYWxpemUgRmlyZWJhc2VcbiAgZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XG4gIHZhciBkYXRhYmFzZSA9IGZpcmViYXNlLmRhdGFiYXNlKCk7XG5cbiAgY29uc3QgY29kZVdyaXRlciA9IG5ldyBaWGluZy5Ccm93c2VyUVJDb2RlU3ZnV3JpdGVyKCk7XG4gIGxldCBzdmdFbGVtZW50O1xuXG4gIC8vIFNlbmRpbmcgZGF0YSB0byBGaXJlYmFzZSBEYXRhYmFzZVxuICBmdW5jdGlvbiB3cml0ZVVzZXJEYXRhKHZpc2l0b3JJRCwgbmFtZSwgY29udGFjdCwgbmljLCBlbWFpbCwgdmVoaWNsZU5vKSB7XG4gICAgZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoXCJ2aXNpdG9ycy9cIiArIHZpc2l0b3JJRCkuc2V0KHtcbiAgICAgIElEOiB2aXNpdG9ySUQsXG4gICAgICBOYW1lOiBuYW1lLFxuICAgICAgQ29udGFjdDogY29udGFjdCxcbiAgICAgIE5JQzogbmljLFxuICAgICAgRW1haWw6IGVtYWlsLFxuICAgICAgVmVoaWNsZTogdmVoaWNsZU5vLFxuICAgICAgVmlzaXRlZDogXCJOb1wiXG4gICAgfSk7XG4gIH1cblxuICAvLyBGaWxsaW5nIGJhY2tncm91bmQgY29sb3VyIG9mIENhbnZhc1xuICBmdW5jdGlvbiBmaWxsQ2FudmFzQmFja2dyb3VuZFdpdGhDb2xvcihjYW52YXMsIGNvbG9yKSB7XG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnRleHQuc2F2ZSgpO1xuICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLW92ZXInO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgIGNvbnRleHQucmVzdG9yZSgpO1xuICB9XG5cbiAgLy8gRnVuY3Rpb24gd3JpdGUgUVJcbiAgZnVuY3Rpb24gZ2VuZXJhdGVRUih2aXNpdG9ySUQsIG5hbWUsIGNvbnRhY3QsIG5pYywgZW1haWwsIHZlaGljbGVObykge1xuICAgIC8vIENhbGxpbmcgRmlyZWJhc2UgV3JpdGVcbiAgICB3cml0ZVVzZXJEYXRhKHZpc2l0b3JJRCwgbmFtZSwgY29udGFjdCwgbmljLCBlbWFpbCwgdmVoaWNsZU5vKTtcbiAgICAvLyBXcml0ZSBRUlxuICAgIHN2Z0VsZW1lbnQgPSBjb2RlV3JpdGVyLndyaXRlVG9Eb20oXG4gICAgICAnI3Jlc3VsdCcsXG4gICAgICB2aXNpdG9ySUQsXG4gICAgICAyNTAsXG4gICAgICAyNTBcbiAgICApO1xuICB9XG5cbiAgLyogRm9ybSB2YWxpZGF0aW9uICovXG4gIC8vIEZvY3VzIElucHV0XG4gICQoJy5kYXRhLWZvcm1fX2Zvcm0gaW5wdXQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMpLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCQodGhpcykudmFsKCkudHJpbSgpICE9IFwiXCIpIHtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaGFzLXZhbCcpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2hhcy12YWwnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gVmFsaWRhdGVcbiAgdmFyIGlucHV0ID0gJCgnLnZhbGlkYXRlLWlucHV0IGlucHV0Jyk7XG5cbiAgJCgnLmRhdGEtZm9ybV9fZm9ybScpLnN1Ym1pdChmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciBjaGVjayA9IHRydWU7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsaWRhdGUoaW5wdXRbaV0pID09IGZhbHNlKSB7XG4gICAgICAgIHNob3dWYWxpZGF0ZShpbnB1dFtpXSk7XG4gICAgICAgIGNoZWNrID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoZWNrO1xuICB9KTtcblxuXG4gICQoJy5kYXRhLWZvcm1fX2Zvcm0gaW5wdXQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMpLmZvY3VzKGZ1bmN0aW9uICgpIHtcbiAgICAgIGhpZGVWYWxpZGF0ZSh0aGlzKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGUoaW5wdXQpIHtcbiAgICBpZiAoJChpbnB1dCkuYXR0cigndHlwZScpID09ICdlbWFpbCcgfHwgJChpbnB1dCkuYXR0cignbmFtZScpID09ICdlbWFpbCcpIHtcbiAgICAgIGlmICgkKGlucHV0KS52YWwoKS50cmltKCkubWF0Y2goL14oW2EtekEtWjAtOV9cXC1cXC5dKylAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC4pfCgoW2EtekEtWjAtOVxcLV0rXFwuKSspKShbYS16QS1aXXsxLDV9fFswLTldezEsM30pKFxcXT8pJC8pID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmICgkKGlucHV0KS52YWwoKS50cmltKCkgPT0gJycpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dWYWxpZGF0ZShpbnB1dCkge1xuICAgIHZhciB0aGlzQWxlcnQgPSAkKGlucHV0KS5wYXJlbnQoKTtcblxuICAgICQodGhpc0FsZXJ0KS5hZGRDbGFzcygnYWxlcnQtdmFsaWRhdGUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGVWYWxpZGF0ZShpbnB1dCkge1xuICAgIHZhciB0aGlzQWxlcnQgPSAkKGlucHV0KS5wYXJlbnQoKTtcblxuICAgICQodGhpc0FsZXJ0KS5yZW1vdmVDbGFzcygnYWxlcnQtdmFsaWRhdGUnKTtcbiAgfVxuXG4gIC8vIERvd25sb2FkIFFSIGZ1bmN0aW9uXG4gIGZ1bmN0aW9uIGRvd25sb2FkUVIoZmlsZW5hbWUpIHtcbiAgICBjYW52Zyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKSwgJChcIiNyZXN1bHRcIikuaHRtbCgpKTtcblxuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTtcbiAgICBmaWxsQ2FudmFzQmFja2dyb3VuZFdpdGhDb2xvcihjYW52YXMsICcjZmZmJyk7XG4gICAgdmFyIGltZyA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XG5cbiAgICAvLyBEb3dubG9hZCBmdW5jdGlvbiBhcyBhbiBpbWFnZVxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgaW1nKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmaWxlbmFtZSk7XG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgZWxlbWVudC5jbGljaygpO1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gIH1cblxuICAvLyBEZWZpbmluZyBmb3JtIGJ1dHRvbiBlbGVtZW50XG4gIGxldCBzdWJtaXRCdG4gPSAkKCcjc3VibWl0QnRuJyk7XG5cbiAgLy8gVmFsaWRhdGVcbiAgdmFyIGlucHV0ID0gJCgnLnZhbGlkYXRlLWlucHV0IGlucHV0Jyk7XG5cbiAgJCgnLmRhdGEtZm9ybV9fZm9ybScpLnN1Ym1pdChmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vRGVmaW5pbmcgZm9ybSBlbGVtZW50c1xuICAgIGxldCB2aXNpdG9ySUQgPSAndicgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgNik7XG4gICAgbGV0IG5hbWUgPSAkKCcjbmFtZScpLnZhbCgpO1xuICAgIGxldCBjb250YWN0ID0gJCgnI2NvbnRhY3QnKS52YWwoKTtcbiAgICBsZXQgbmljID0gJCgnI25pYycpLnZhbCgpO1xuICAgIGxldCBlbWFpbCA9ICQoJyNlbWFpbCcpLnZhbCgpO1xuICAgIGxldCB2ZWhpY2xlTm8gPSAkKCcjdmVoaWNsZS1ubycpLnZhbCgpO1xuXG4gICAgdmFyIGNoZWNrID0gdHJ1ZTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWxpZGF0ZShpbnB1dFtpXSkgPT0gZmFsc2UpIHtcbiAgICAgICAgc2hvd1ZhbGlkYXRlKGlucHV0W2ldKTtcbiAgICAgICAgY2hlY2sgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2hlY2spIHtcbiAgICAgIGdlbmVyYXRlUVIodmlzaXRvcklELCBuYW1lLCBjb250YWN0LCBuaWMsIGVtYWlsLCB2ZWhpY2xlTm8pO1xuICAgICAgZG93bmxvYWRRUihuYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hlY2s7XG4gIH0pO1xufVxuIl19

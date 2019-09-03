(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
/* eslint-env browser */
'use strict';

var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);var _jquery2 = _interopRequireDefault(_jquery);

var _qrGenerator = require('modules/qrGenerator.js');var _qrGenerator2 = _interopRequireDefault(_qrGenerator);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

(function ($) {
  $(document).ready(function () {
    ready();
  });

  // Initalizing all modules
  function ready() {
    // formValidator();
    (0, _qrGenerator2.default)();
  }
})(_jquery2.default); // import formValidator from 'modules/formValidator.js';

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"modules/qrGenerator.js":2}],2:[function(require,module,exports){
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

  // Form elements
  var visitorID = 'v' + Math.random().toString(36).substr(2, 6);
  var name = $('#name').val();
  var contact = $('#contact').val();
  var nic = $('#nic').val();
  var email = $('#email').val();
  var vehicleNo = $('#vehicle-no').val();

  // Sending data to Firebase Database
  function writeUserData(visitorID, name, contact, nic, email, vehicleNo) {
    firebase.database().ref("visitors/" + visitorID).set({
      ID: visitorID,
      Name: name,
      Contact: contact,
      NIC: nic,
      Email: email,
      Vehicle: vehicleNo });

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
  function writeQR() {
    // Calling Firebase Write
    writeUserData(visitorID, name, contact, nic, email, vehicleNo);

    // Write QR
    svgElement = codeWriter.writeToDom(
    '#result',
    JSON.stringify(visitorID, name, contact, nic, email, vehicleNo),
    250,
    250);

  }

  // File download function
  function save_as_svg() {
    // var svg_data = $("#result svg").html(); //put id of your svg element here

    // var head = '<svg title="graph" version="1.1" xmlns="http://www.w3.org/2000/svg">';

    // //if you have some additional styling like graph edges put them inside <style> tag
    // // var style = '<style>circle {cursor: pointer;stroke-width: 1.5px;}text {font: 10px arial;}path {stroke: DimGrey;stroke-width: 1.5px;}</style>'

    // var full_svg = head + svg_data + "</svg>";
    // var blob = new Blob([full_svg], { type: "image/svg+xml" });
    // saveAs(blob, "graph.svg");
  };

  // Form validation
  function validate() {
    var isFormValid = true;

    $("input:required").each(function () {
      if ($.trim($(this).val()).length == 0) {
        $(this).addClass("highlight");
        isFormValid = false;
        $(this).focus();
      } else
      {
        $(this).removeClass("highlight");

        // Disable the button
        $('#submitBtn').attr("disabled", true);
      }
    });

    if (!isFormValid) {
      alert("Please fill in all the required fields (indicated by *)");
    }
    return isFormValid;
  }

  function downloadQR() {
    canvg(document.getElementById("canvas"), $("#result").html());
    download("test.png");
  }

  function download(filename) {
    // Defining the canvas
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

  submitBtn.click(function (e) {
    e.preventDefault();

    // Call validate function
    if (validate()) {
      writeQR();
      downloadQR();
    }

    // Call download function
    // save_as_svg();
  });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2R1bGVzL3FyR2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7O0FBRUEsZ0M7O0FBRUEscUQ7O0FBRUEsQ0FBQyxVQUFVLENBQVYsRUFBYTtBQUNaLElBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsWUFBWTtBQUM1QjtBQUNELEdBRkQ7O0FBSUE7QUFDQSxXQUFTLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0Q7QUFDRixDQVZELEVBVUcsZ0JBVkgsRSxDQUhBOzs7Ozs7Ozs7QUNBZSxZQUFZO0FBQ3pCLE1BQUksaUJBQWlCO0FBQ25CLFlBQVEseUNBRFc7QUFFbkIsZ0JBQVksc0NBRk87QUFHbkIsaUJBQWEsNkNBSE07QUFJbkIsZUFBVyxzQkFKUTtBQUtuQixtQkFBZSxrQ0FMSTtBQU1uQix1QkFBbUIsY0FOQTtBQU9uQixXQUFPLHFDQVBZLEVBQXJCOzs7QUFVQTtBQUNBLFdBQVMsYUFBVCxDQUF1QixjQUF2QjtBQUNBLE1BQUksV0FBVyxTQUFTLFFBQVQsRUFBZjs7QUFFQSxNQUFNLGFBQWEsSUFBSSxNQUFNLHNCQUFWLEVBQW5CO0FBQ0EsTUFBSSxtQkFBSjs7QUFFQTtBQUNBLE1BQUksWUFBWSxNQUFNLEtBQUssTUFBTCxHQUFjLFFBQWQsQ0FBdUIsRUFBdkIsRUFBMkIsTUFBM0IsQ0FBa0MsQ0FBbEMsRUFBcUMsQ0FBckMsQ0FBdEI7QUFDQSxNQUFJLE9BQU8sRUFBRSxPQUFGLEVBQVcsR0FBWCxFQUFYO0FBQ0EsTUFBSSxVQUFVLEVBQUUsVUFBRixFQUFjLEdBQWQsRUFBZDtBQUNBLE1BQUksTUFBTSxFQUFFLE1BQUYsRUFBVSxHQUFWLEVBQVY7QUFDQSxNQUFJLFFBQVEsRUFBRSxRQUFGLEVBQVksR0FBWixFQUFaO0FBQ0EsTUFBSSxZQUFZLEVBQUUsYUFBRixFQUFpQixHQUFqQixF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QUFSO0FBQ0EsYUFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixPQUExQjtBQUNEOztBQUVEO0FBQ0EsTUFBSSxZQUFZLEVBQUUsWUFBRixDQUFoQjs7QUFFQSxZQUFVLEtBQVYsQ0FBZ0IsVUFBVSxDQUFWLEVBQWE7QUFDM0IsTUFBRSxjQUFGOztBQUVBO0FBQ0EsUUFBRyxVQUFILEVBQWM7QUFDWjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNELEdBWEQ7QUFZRCxDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyogZXNsaW50LWVudiBicm93c2VyICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBqcXVlcnkgZnJvbSAnanF1ZXJ5JztcclxuLy8gaW1wb3J0IGZvcm1WYWxpZGF0b3IgZnJvbSAnbW9kdWxlcy9mb3JtVmFsaWRhdG9yLmpzJztcclxuaW1wb3J0IHFyR2VuZXJhdG9yIGZyb20gJ21vZHVsZXMvcXJHZW5lcmF0b3IuanMnO1xyXG5cclxuKGZ1bmN0aW9uICgkKSB7XHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgcmVhZHkoKTtcclxuICB9KTtcclxuXHJcbiAgLy8gSW5pdGFsaXppbmcgYWxsIG1vZHVsZXNcclxuICBmdW5jdGlvbiByZWFkeSgpIHtcclxuICAgIC8vIGZvcm1WYWxpZGF0b3IoKTtcclxuICAgIHFyR2VuZXJhdG9yKCk7XHJcbiAgfVxyXG59KShqcXVlcnkpO1xyXG4iLCIvKipcclxuICogUVIgR2VuZXJhdG9yXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gIGxldCBmaXJlYmFzZUNvbmZpZyA9IHtcclxuICAgIGFwaUtleTogXCJBSXphU3lBWDBnLWZhWllpVUxEeV9RaUxNQnhhaWdOQkI4NVZBUElcIixcclxuICAgIGF1dGhEb21haW46IFwicmVjZXB0aW9uLW1hbmFnZW1lbnQuZmlyZWJhc2VhcHAuY29tXCIsXHJcbiAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL3JlY2VwdGlvbi1tYW5hZ2VtZW50LmZpcmViYXNlaW8uY29tXCIsXHJcbiAgICBwcm9qZWN0SWQ6IFwicmVjZXB0aW9uLW1hbmFnZW1lbnRcIixcclxuICAgIHN0b3JhZ2VCdWNrZXQ6IFwicmVjZXB0aW9uLW1hbmFnZW1lbnQuYXBwc3BvdC5jb21cIixcclxuICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjE5MjQxMzUwMzg1OVwiLFxyXG4gICAgYXBwSWQ6IFwiMToxOTI0MTM1MDM4NTk6d2ViOmM4ZjllNzhmNzAwMGQ0ZWFcIlxyXG4gIH07XHJcblxyXG4gIC8vIEluaXRpYWxpemUgRmlyZWJhc2VcclxuICBmaXJlYmFzZS5pbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcclxuICB2YXIgZGF0YWJhc2UgPSBmaXJlYmFzZS5kYXRhYmFzZSgpO1xyXG5cclxuICBjb25zdCBjb2RlV3JpdGVyID0gbmV3IFpYaW5nLkJyb3dzZXJRUkNvZGVTdmdXcml0ZXIoKTtcclxuICBsZXQgc3ZnRWxlbWVudDtcclxuXHJcbiAgLy8gRm9ybSBlbGVtZW50c1xyXG4gIGxldCB2aXNpdG9ySUQgPSAndicgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgNik7XHJcbiAgbGV0IG5hbWUgPSAkKCcjbmFtZScpLnZhbCgpO1xyXG4gIGxldCBjb250YWN0ID0gJCgnI2NvbnRhY3QnKS52YWwoKTtcclxuICBsZXQgbmljID0gJCgnI25pYycpLnZhbCgpO1xyXG4gIGxldCBlbWFpbCA9ICQoJyNlbWFpbCcpLnZhbCgpO1xyXG4gIGxldCB2ZWhpY2xlTm8gPSAkKCcjdmVoaWNsZS1ubycpLnZhbCgpO1xyXG5cclxuICAvLyBTZW5kaW5nIGRhdGEgdG8gRmlyZWJhc2UgRGF0YWJhc2VcclxuICBmdW5jdGlvbiB3cml0ZVVzZXJEYXRhKHZpc2l0b3JJRCwgbmFtZSwgY29udGFjdCwgbmljLCBlbWFpbCwgdmVoaWNsZU5vKSB7XHJcbiAgICBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZihcInZpc2l0b3JzL1wiICsgdmlzaXRvcklEKS5zZXQoe1xyXG4gICAgICBJRDogdmlzaXRvcklELFxyXG4gICAgICBOYW1lOiBuYW1lLFxyXG4gICAgICBDb250YWN0OiBjb250YWN0LFxyXG4gICAgICBOSUM6IG5pYyxcclxuICAgICAgRW1haWw6IGVtYWlsLFxyXG4gICAgICBWZWhpY2xlOiB2ZWhpY2xlTm8sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIEZpbGxpbmcgYmFja2dyb3VuZCBjb2xvdXIgb2YgQ2FudmFzXHJcbiAgZnVuY3Rpb24gZmlsbENhbnZhc0JhY2tncm91bmRXaXRoQ29sb3IoY2FudmFzLCBjb2xvcikge1xyXG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24tb3Zlcic7XHJcblxyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gRnVuY3Rpb24gd3JpdGUgUVJcclxuICBmdW5jdGlvbiB3cml0ZVFSKCkge1xyXG4gICAgLy8gQ2FsbGluZyBGaXJlYmFzZSBXcml0ZVxyXG4gICAgd3JpdGVVc2VyRGF0YSh2aXNpdG9ySUQsIG5hbWUsIGNvbnRhY3QsIG5pYywgZW1haWwsIHZlaGljbGVObyk7XHJcblxyXG4gICAgLy8gV3JpdGUgUVJcclxuICAgIHN2Z0VsZW1lbnQgPSBjb2RlV3JpdGVyLndyaXRlVG9Eb20oXHJcbiAgICAgICcjcmVzdWx0JyxcclxuICAgICAgSlNPTi5zdHJpbmdpZnkodmlzaXRvcklELCBuYW1lLCBjb250YWN0LCBuaWMsIGVtYWlsLCB2ZWhpY2xlTm8pLFxyXG4gICAgICAyNTAsXHJcbiAgICAgIDI1MFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIEZpbGUgZG93bmxvYWQgZnVuY3Rpb25cclxuICBmdW5jdGlvbiBzYXZlX2FzX3N2ZygpIHtcclxuICAgIC8vIHZhciBzdmdfZGF0YSA9ICQoXCIjcmVzdWx0IHN2Z1wiKS5odG1sKCk7IC8vcHV0IGlkIG9mIHlvdXIgc3ZnIGVsZW1lbnQgaGVyZVxyXG5cclxuICAgIC8vIHZhciBoZWFkID0gJzxzdmcgdGl0bGU9XCJncmFwaFwiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+JztcclxuXHJcbiAgICAvLyAvL2lmIHlvdSBoYXZlIHNvbWUgYWRkaXRpb25hbCBzdHlsaW5nIGxpa2UgZ3JhcGggZWRnZXMgcHV0IHRoZW0gaW5zaWRlIDxzdHlsZT4gdGFnXHJcbiAgICAvLyAvLyB2YXIgc3R5bGUgPSAnPHN0eWxlPmNpcmNsZSB7Y3Vyc29yOiBwb2ludGVyO3N0cm9rZS13aWR0aDogMS41cHg7fXRleHQge2ZvbnQ6IDEwcHggYXJpYWw7fXBhdGgge3N0cm9rZTogRGltR3JleTtzdHJva2Utd2lkdGg6IDEuNXB4O308L3N0eWxlPidcclxuXHJcbiAgICAvLyB2YXIgZnVsbF9zdmcgPSBoZWFkICsgc3ZnX2RhdGEgKyBcIjwvc3ZnPlwiO1xyXG4gICAgLy8gdmFyIGJsb2IgPSBuZXcgQmxvYihbZnVsbF9zdmddLCB7IHR5cGU6IFwiaW1hZ2Uvc3ZnK3htbFwiIH0pO1xyXG4gICAgLy8gc2F2ZUFzKGJsb2IsIFwiZ3JhcGguc3ZnXCIpO1xyXG4gIH07XHJcblxyXG4gIC8vIEZvcm0gdmFsaWRhdGlvblxyXG4gIGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xyXG4gICAgdmFyIGlzRm9ybVZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICAkKFwiaW5wdXQ6cmVxdWlyZWRcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkLnRyaW0oJCh0aGlzKS52YWwoKSkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiaGlnaGxpZ2h0XCIpO1xyXG4gICAgICAgIGlzRm9ybVZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgJCh0aGlzKS5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoXCJoaWdobGlnaHRcIik7XHJcblxyXG4gICAgICAgIC8vIERpc2FibGUgdGhlIGJ1dHRvblxyXG4gICAgICAgICQoJyNzdWJtaXRCdG4nKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghaXNGb3JtVmFsaWQpIHtcclxuICAgICAgYWxlcnQoXCJQbGVhc2UgZmlsbCBpbiBhbGwgdGhlIHJlcXVpcmVkIGZpZWxkcyAoaW5kaWNhdGVkIGJ5ICopXCIpO1xyXG4gICAgfSBcclxuICAgIHJldHVybiBpc0Zvcm1WYWxpZDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRvd25sb2FkUVIoKXtcclxuICAgIGNhbnZnKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpLCQoXCIjcmVzdWx0XCIpLmh0bWwoKSk7XHJcbiAgICBkb3dubG9hZChcInRlc3QucG5nXCIpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZG93bmxvYWQoZmlsZW5hbWUpIHtcclxuICAgIC8vIERlZmluaW5nIHRoZSBjYW52YXNcclxuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTtcclxuICAgIGZpbGxDYW52YXNCYWNrZ3JvdW5kV2l0aENvbG9yKGNhbnZhcywgJyNmZmYnKTtcclxuICAgIHZhciBpbWcgPSBjYW52YXMudG9EYXRhVVJMKFwiaW1hZ2UvcG5nXCIpO1xyXG5cclxuICAgIC8vIERvd25sb2FkIGZ1bmN0aW9uIGFzIGFuIGltYWdlXHJcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgaW1nKTtcclxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGZpbGVuYW1lKTtcclxuICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICBlbGVtZW50LmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLy8gRGVmaW5pbmcgZm9ybSBidXR0b24gZWxlbWVudFxyXG4gIGxldCBzdWJtaXRCdG4gPSAkKCcjc3VibWl0QnRuJyk7XHJcblxyXG4gIHN1Ym1pdEJ0bi5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIC8vIENhbGwgdmFsaWRhdGUgZnVuY3Rpb25cclxuICAgIGlmKHZhbGlkYXRlKCkpe1xyXG4gICAgICB3cml0ZVFSKCk7XHJcbiAgICAgIGRvd25sb2FkUVIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxsIGRvd25sb2FkIGZ1bmN0aW9uXHJcbiAgICAvLyBzYXZlX2FzX3N2ZygpO1xyXG4gIH0pO1xyXG59XHJcbiJdfQ==

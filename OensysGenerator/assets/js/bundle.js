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
  function generateQR(visitorID, name, contact, nic, email, vehicleNo) {
    // Calling Firebase Write
    writeUserData(visitorID, name, contact, nic, email, vehicleNo);
    // Write QR
    svgElement = codeWriter.writeToDom(
    '#result',
    JSON.stringify(visitorID, name, contact, nic, email, vehicleNo),
    250,
    250);

  }

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

  submitBtn.click(function (e) {
    e.preventDefault();
    //Defining form elements
    var visitorID = 'v' + Math.random().toString(36).substr(2, 6);
    var name = $('#name').val();
    var contact = $('#contact').val();
    var nic = $('#nic').val();
    var email = $('#email').val();
    var vehicleNo = $('#vehicle-no').val();
    // Call validate function
    if (validate()) {
      generateQR(visitorID);
      downloadQR(name);
    }
  });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2R1bGVzL3FyR2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7O0FBRUEsZ0M7O0FBRUEscUQ7O0FBRUEsQ0FBQyxVQUFVLENBQVYsRUFBYTtBQUNaLElBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsWUFBWTtBQUM1QjtBQUNELEdBRkQ7O0FBSUE7QUFDQSxXQUFTLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0Q7QUFDRixDQVZELEVBVUcsZ0JBVkgsRSxDQUhBOzs7Ozs7Ozs7QUNBZSxZQUFZO0FBQ3pCLE1BQUksaUJBQWlCO0FBQ25CLFlBQVEseUNBRFc7QUFFbkIsZ0JBQVksc0NBRk87QUFHbkIsaUJBQWEsNkNBSE07QUFJbkIsZUFBVyxzQkFKUTtBQUtuQixtQkFBZSxrQ0FMSTtBQU1uQix1QkFBbUIsY0FOQTtBQU9uQixXQUFPLHFDQVBZLEVBQXJCOzs7QUFVQTtBQUNBLFdBQVMsYUFBVCxDQUF1QixjQUF2QjtBQUNBLE1BQUksV0FBVyxTQUFTLFFBQVQsRUFBZjtBQUNBLE1BQU0sYUFBYSxJQUFJLE1BQU0sc0JBQVYsRUFBbkI7QUFDQSxNQUFJLG1CQUFKOztBQUVBO0FBQ0EsV0FBUyxhQUFULENBQXVCLFNBQXZCLEVBQWtDLElBQWxDLEVBQXdDLE9BQXhDLEVBQWlELEdBQWpELEVBQXNELEtBQXRELEVBQTZELFNBQTdELEVBQXdFO0FBQ3RFLGFBQVMsUUFBVCxHQUFvQixHQUFwQixDQUF3QixjQUFjLFNBQXRDLEVBQWlELEdBQWpELENBQXFEO0FBQ25ELFVBQUksU0FEK0M7QUFFbkQsWUFBTSxJQUY2QztBQUduRCxlQUFTLE9BSDBDO0FBSW5ELFdBQUssR0FKOEM7QUFLbkQsYUFBTyxLQUw0QztBQU1uRCxlQUFTLFNBTjBDLEVBQXJEOztBQVFEOztBQUVEO0FBQ0EsV0FBUyw2QkFBVCxD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VjtBQUNBLFFBQUksUUFBUSxFQUFFLFFBQUYsRUFBWSxHQUFaLEVBQVo7QUFDQSxRQUFJLFlBQVksRUFBRSxhQUFGLEVBQWlCLEdBQWpCLEVBQWhCO0FBQ0E7QUFDQSxRQUFHLFVBQUgsRUFBYztBQUNaLGlCQUFXLFNBQVg7QUFDQSxpQkFBVyxJQUFYO0FBQ0Q7QUFDRixHQWREO0FBZUQsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQganF1ZXJ5IGZyb20gJ2pxdWVyeSc7XHJcbi8vIGltcG9ydCBmb3JtVmFsaWRhdG9yIGZyb20gJ21vZHVsZXMvZm9ybVZhbGlkYXRvci5qcyc7XHJcbmltcG9ydCBxckdlbmVyYXRvciBmcm9tICdtb2R1bGVzL3FyR2VuZXJhdG9yLmpzJztcclxuXHJcbihmdW5jdGlvbiAoJCkge1xyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIHJlYWR5KCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIEluaXRhbGl6aW5nIGFsbCBtb2R1bGVzXHJcbiAgZnVuY3Rpb24gcmVhZHkoKSB7XHJcbiAgICAvLyBmb3JtVmFsaWRhdG9yKCk7XHJcbiAgICBxckdlbmVyYXRvcigpO1xyXG4gIH1cclxufSkoanF1ZXJ5KTtcclxuIiwiLyoqXHJcbiAqIFFSIEdlbmVyYXRvclxyXG4gKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZmlyZWJhc2VDb25maWcgPSB7XHJcbiAgICBhcGlLZXk6IFwiQUl6YVN5QVgwZy1mYVpZaVVMRHlfUWlMTUJ4YWlnTkJCODVWQVBJXCIsXHJcbiAgICBhdXRoRG9tYWluOiBcInJlY2VwdGlvbi1tYW5hZ2VtZW50LmZpcmViYXNlYXBwLmNvbVwiLFxyXG4gICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9yZWNlcHRpb24tbWFuYWdlbWVudC5maXJlYmFzZWlvLmNvbVwiLFxyXG4gICAgcHJvamVjdElkOiBcInJlY2VwdGlvbi1tYW5hZ2VtZW50XCIsXHJcbiAgICBzdG9yYWdlQnVja2V0OiBcInJlY2VwdGlvbi1tYW5hZ2VtZW50LmFwcHNwb3QuY29tXCIsXHJcbiAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCIxOTI0MTM1MDM4NTlcIixcclxuICAgIGFwcElkOiBcIjE6MTkyNDEzNTAzODU5OndlYjpjOGY5ZTc4ZjcwMDBkNGVhXCJcclxuICB9O1xyXG5cclxuICAvLyBJbml0aWFsaXplIEZpcmViYXNlXHJcbiAgZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XHJcbiAgdmFyIGRhdGFiYXNlID0gZmlyZWJhc2UuZGF0YWJhc2UoKTtcclxuICBjb25zdCBjb2RlV3JpdGVyID0gbmV3IFpYaW5nLkJyb3dzZXJRUkNvZGVTdmdXcml0ZXIoKTtcclxuICBsZXQgc3ZnRWxlbWVudDtcclxuXHJcbiAgLy8gU2VuZGluZyBkYXRhIHRvIEZpcmViYXNlIERhdGFiYXNlXHJcbiAgZnVuY3Rpb24gd3JpdGVVc2VyRGF0YSh2aXNpdG9ySUQsIG5hbWUsIGNvbnRhY3QsIG5pYywgZW1haWwsIHZlaGljbGVObykge1xyXG4gICAgZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoXCJ2aXNpdG9ycy9cIiArIHZpc2l0b3JJRCkuc2V0KHtcclxuICAgICAgSUQ6IHZpc2l0b3JJRCxcclxuICAgICAgTmFtZTogbmFtZSxcclxuICAgICAgQ29udGFjdDogY29udGFjdCxcclxuICAgICAgTklDOiBuaWMsXHJcbiAgICAgIEVtYWlsOiBlbWFpbCxcclxuICAgICAgVmVoaWNsZTogdmVoaWNsZU5vLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBGaWxsaW5nIGJhY2tncm91bmQgY29sb3VyIG9mIENhbnZhc1xyXG4gIGZ1bmN0aW9uIGZpbGxDYW52YXNCYWNrZ3JvdW5kV2l0aENvbG9yKGNhbnZhcywgY29sb3IpIHtcclxuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24tb3Zlcic7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBGdW5jdGlvbiB3cml0ZSBRUlxyXG4gIGZ1bmN0aW9uIGdlbmVyYXRlUVIodmlzaXRvcklELCBuYW1lLCBjb250YWN0LCBuaWMsIGVtYWlsLCB2ZWhpY2xlTm8pIHtcclxuICAgIC8vIENhbGxpbmcgRmlyZWJhc2UgV3JpdGVcclxuICAgIHdyaXRlVXNlckRhdGEodmlzaXRvcklELCBuYW1lLCBjb250YWN0LCBuaWMsIGVtYWlsLCB2ZWhpY2xlTm8pO1xyXG4gICAgLy8gV3JpdGUgUVJcclxuICAgIHN2Z0VsZW1lbnQgPSBjb2RlV3JpdGVyLndyaXRlVG9Eb20oXHJcbiAgICAgICcjcmVzdWx0JyxcclxuICAgICAgSlNPTi5zdHJpbmdpZnkodmlzaXRvcklELCBuYW1lLCBjb250YWN0LCBuaWMsIGVtYWlsLCB2ZWhpY2xlTm8pLFxyXG4gICAgICAyNTAsXHJcbiAgICAgIDI1MFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIEZvcm0gdmFsaWRhdGlvblxyXG4gIGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xyXG4gICAgdmFyIGlzRm9ybVZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICAkKFwiaW5wdXQ6cmVxdWlyZWRcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkLnRyaW0oJCh0aGlzKS52YWwoKSkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiaGlnaGxpZ2h0XCIpO1xyXG4gICAgICAgIGlzRm9ybVZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgJCh0aGlzKS5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoXCJoaWdobGlnaHRcIik7XHJcblxyXG4gICAgICAgIC8vIERpc2FibGUgdGhlIGJ1dHRvblxyXG4gICAgICAgICQoJyNzdWJtaXRCdG4nKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghaXNGb3JtVmFsaWQpIHtcclxuICAgICAgYWxlcnQoXCJQbGVhc2UgZmlsbCBpbiBhbGwgdGhlIHJlcXVpcmVkIGZpZWxkcyAoaW5kaWNhdGVkIGJ5ICopXCIpO1xyXG4gICAgfSBcclxuICAgIHJldHVybiBpc0Zvcm1WYWxpZDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRvd25sb2FkUVIoZmlsZW5hbWUpe1xyXG4gICAgY2FudmcoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIiksJChcIiNyZXN1bHRcIikuaHRtbCgpKTtcclxuICAgIFxyXG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xyXG4gICAgZmlsbENhbnZhc0JhY2tncm91bmRXaXRoQ29sb3IoY2FudmFzLCAnI2ZmZicpO1xyXG4gICAgdmFyIGltZyA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XHJcblxyXG4gICAgLy8gRG93bmxvYWQgZnVuY3Rpb24gYXMgYW4gaW1hZ2VcclxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBpbWcpO1xyXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xyXG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgIGVsZW1lbnQuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICAvLyBEZWZpbmluZyBmb3JtIGJ1dHRvbiBlbGVtZW50XHJcbiAgbGV0IHN1Ym1pdEJ0biA9ICQoJyNzdWJtaXRCdG4nKTtcclxuXHJcbiAgc3VibWl0QnRuLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAvL0RlZmluaW5nIGZvcm0gZWxlbWVudHNcclxuICAgIGxldCB2aXNpdG9ySUQgPSAndicgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgNik7XHJcbiAgICBsZXQgbmFtZSA9ICQoJyNuYW1lJykudmFsKCk7XHJcbiAgICBsZXQgY29udGFjdCA9ICQoJyNjb250YWN0JykudmFsKCk7XHJcbiAgICBsZXQgbmljID0gJCgnI25pYycpLnZhbCgpO1xyXG4gICAgbGV0IGVtYWlsID0gJCgnI2VtYWlsJykudmFsKCk7XHJcbiAgICBsZXQgdmVoaWNsZU5vID0gJCgnI3ZlaGljbGUtbm8nKS52YWwoKTtcclxuICAgIC8vIENhbGwgdmFsaWRhdGUgZnVuY3Rpb25cclxuICAgIGlmKHZhbGlkYXRlKCkpe1xyXG4gICAgICBnZW5lcmF0ZVFSKHZpc2l0b3JJRCk7XHJcbiAgICAgIGRvd25sb2FkUVIobmFtZSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuIl19

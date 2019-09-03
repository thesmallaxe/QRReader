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
    var svg_data = $("#result svg").html(); //put id of your svg element here

    var head = '<svg title="graph" version="1.1" xmlns="http://www.w3.org/2000/svg">';

    //if you have some additional styling like graph edges put them inside <style> tag
    // var style = '<style>circle {cursor: pointer;stroke-width: 1.5px;}text {font: 10px arial;}path {stroke: DimGrey;stroke-width: 1.5px;}</style>'

    var full_svg = head + svg_data + "</svg>";
    var blob = new Blob([full_svg], { type: "image/svg+xml" });
    saveAs(blob, "graph.svg");
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
    } else {
      // Call write QR function
      writeQR();
    }

    return isFormValid;
  }

  // Defining form button element
  var submitBtn = $('#submitBtn');

  submitBtn.click(function (e) {
    e.preventDefault();

    // Call validate function
    validate();

    // Call download function
    save_as_svg();
  });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2R1bGVzL3FyR2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7O0FBRUEsZ0M7O0FBRUEscUQ7O0FBRUEsQ0FBQyxVQUFVLENBQVYsRUFBYTtBQUNaLElBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsWUFBWTtBQUM1QjtBQUNELEdBRkQ7O0FBSUE7QUFDQSxXQUFTLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0Q7QUFDRixDQVZELEVBVUcsZ0JBVkgsRSxDQUhBOzs7Ozs7Ozs7QUNBZSxZQUFZO0FBQ3pCLE1BQUksaUJBQWlCO0FBQ25CLFlBQVEseUNBRFc7QUFFbkIsZ0JBQVksc0NBRk87QUFHbkIsaUJBQWEsNkNBSE07QUFJbkIsZUFBVyxzQkFKUTtBQUtuQixtQkFBZSxrQ0FMSTtBQU1uQix1QkFBbUIsY0FOQTtBQU9uQixXQUFPLHFDQVBZLEVBQXJCOzs7QUFVQTtBQUNBLFdBQVMsYUFBVCxDQUF1QixjQUF2QjtBQUNBLE1BQUksV0FBVyxTQUFTLFFBQVQsRUFBZjs7QUFFQSxNQUFNLGFBQWEsSUFBSSxNQUFNLHNCQUFWLEVBQW5CO0FBQ0EsTUFBSSxtQkFBSjs7QUFFQTtBQUNBLE1BQUksWUFBWSxNQUFNLEtBQUssTUFBTCxHQUFjLFFBQWQsQ0FBdUIsRUFBdkIsRUFBMkIsTUFBM0IsQ0FBa0MsQ0FBbEMsRUFBcUMsQ0FBckMsQ0FBdEI7QUFDQSxNQUFJLE9BQU8sRUFBRSxPQUFGLEVBQVcsR0FBWCxFQUFYO0FBQ0EsTUFBSSxVQUFVLEVBQUUsVUFBRixFQUFjLEdBQWQsRUFBZDtBQUNBLE1BQUksTUFBTSxFQUFFLE1BQUYsRUFBVSxHQUFWLEVBQVY7QUFDQSxNQUFJLFFBQVEsRUFBRSxRQUFGLEVBQVksR0FBWixFQUFaO0FBQ0EsTUFBSSxZQUFZLEVBQUUsYUFBRixFQUFpQixHQUFqQixFQUFoQjs7QUFFQTtBQUNBLFdBQVMsYUFBVCxDQUF1QixTQUF2QixFQUFrQyxJQUFsQyxFQUF3QyxPQUF4QyxFQUFpRCxHQUFqRCxFQUFzRCxLQUF0RCxFQUE2RCxTQUE3RCxFQUF3RTtBQUN0RSxhQUFTLFFBQVQsR0FBb0IsR0FBcEIsQ0FBd0IsY0FBYyxTQUF0QyxFQUFpRCxHQUFqRCxDQUFxRDtBQUNuRCxVQUFJLFNBRCtDO0FBRW5ELFlBQU0sSUFGNkM7QUFHbkQsZUFBUyxPQUgwQztBQUluRCxXQUFLLEdBSjhDO0FBS25ELGFBQU8sS0FMNEM7QUFNbkQsZUFBUyxTQU4wQyxFQUFyRDs7QUFRRDs7QUFFRDtBQUNBLFdBQVMsNkJBQVQsQ0FBdUMsTUFBdkMsRUFBK0MsS0FBL0MsRUFBc0Q7QUFDcEQsUUFBTSxVQUFVLE9BQU8sVUFBUCxDQUFrQixJQUFsQixDQUFoQjs7QUFFQSxZQUFRLElBQVI7QUFDQSxZQUFRLHdCQUFSLEdBQW1DLGtCQUFuQzs7QUFFQSxZQUFRLFNBQVIsR0FBb0IsS0FBcEI7QUFDQSxZQUFRLFFBQVIsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBdUIsT0FBTyxLQUE5QixFQUFxQyxPQUFPLE1BQTVDO0FBQ0EsWUFBUSxPQUFSO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLE9BQVQsR0FBbUI7QUFDakI7QUFDQSxrQkFBYyxTQUFkLEVBQXlCLElBQXpCLEVBQStCLE9BQS9CLEVBQXdDLEdBQXhDLEVBQTZDLEtBQTdDLEVBQW9ELFNBQXBEOztBQUVBO0FBQ0EsaUJBQWEsV0FBVyxVQUFYO0FBQ1gsYUFEVztBQUVYLFNBQUssU0FBTCxDQUFlLFNBQWYsRUFBMEIsSUFBMUIsRUFBZ0MsT0FBaEMsRUFBeUMsR0FBekMsRUFBOEMsS0FBOUMsRUFBcUQsU0FBckQsQ0FGVztBQUdYLE9BSFc7QUFJWCxPQUpXLENBQWI7O0FBTUQ7O0FBRUQ7QUFDQSxXQUFTLFdBQVQsR0FBdUI7QUFDckIsUUFBSSxXQUFXLEVBQUUsYUFBRixFQUFpQixJQUFqQixFQUFmLENBRHFCLENBQ21COztBQUV4QyxRQUFJLE9BQU8sc0VBQVg7O0FBRUE7QUFDQTs7QUFFQSxRQUFJLFdBQVcsT0FBTyxRQUFQLEdBQWtCLFFBQWpDO0FBQ0EsUUFBSSxPQUFPLElBQUksSUFBSixDQUFTLENBQUMsUUFBRCxDQUFULEVBQXFCLEVBQUUsTUFBTSxlQUFSLEVBQXJCLENBQVg7QUFDQSxXQUFPLElBQVAsRUFBYSxXQUFiO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLFFBQVQsR0FBb0I7QUFDbEIsUUFBSSxjQUFjLElBQWxCOztBQUVBLE1BQUUsZ0JBQUYsRUFBb0IsSUFBcEIsQ0FBeUIsWUFBWTtBQUNuQyxVQUFJLEVBQUUsSUFBRixDQUFPLEVBQUUsSUFBRixFQUFRLEdBQVIsRUFBUCxFQUFzQixNQUF0QixJQUFnQyxDQUFwQyxFQUF1QztBQUNyQyxVQUFFLElBQUYsRUFBUSxRQUFSLENBQWlCLFdBQWpCO0FBQ0Esc0JBQWMsS0FBZDtBQUNBLFVBQUUsSUFBRixFQUFRLEtBQVI7QUFDRCxPQUpEO0FBS0s7QUFDSCxVQUFFLElBQUYsRUFBUSxXQUFSLENBQW9CLFdBQXBCOztBQUVBO0FBQ0EsVUFBRSxZQUFGLEVBQWdCLElBQWhCLENBQXFCLFVBQXJCLEVBQWlDLElBQWpDO0FBQ0Q7QUFDRixLQVpEOztBQWNBLFFBQUksQ0FBQyxXQUFMLEVBQWtCO0FBQ2hCLFlBQU0seURBQU47QUFDRCxLQUZELE1BRU87QUFDTDtBQUNBO0FBQ0Q7O0FBRUQsV0FBTyxXQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJLFlBQVksRUFBRSxZQUFGLENBQWhCOztBQUVBLFlBQVUsS0FBVixDQUFnQixVQUFVLENBQVYsRUFBYTtBQUMzQixNQUFFLGNBQUY7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0QsR0FSRDtBQVNELEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGpxdWVyeSBmcm9tICdqcXVlcnknO1xuLy8gaW1wb3J0IGZvcm1WYWxpZGF0b3IgZnJvbSAnbW9kdWxlcy9mb3JtVmFsaWRhdG9yLmpzJztcbmltcG9ydCBxckdlbmVyYXRvciBmcm9tICdtb2R1bGVzL3FyR2VuZXJhdG9yLmpzJztcblxuKGZ1bmN0aW9uICgkKSB7XG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICByZWFkeSgpO1xuICB9KTtcblxuICAvLyBJbml0YWxpemluZyBhbGwgbW9kdWxlc1xuICBmdW5jdGlvbiByZWFkeSgpIHtcbiAgICAvLyBmb3JtVmFsaWRhdG9yKCk7XG4gICAgcXJHZW5lcmF0b3IoKTtcbiAgfVxufSkoanF1ZXJ5KTtcbiIsIi8qKlxuICogUVIgR2VuZXJhdG9yXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xuICBsZXQgZmlyZWJhc2VDb25maWcgPSB7XG4gICAgYXBpS2V5OiBcIkFJemFTeUFYMGctZmFaWWlVTER5X1FpTE1CeGFpZ05CQjg1VkFQSVwiLFxuICAgIGF1dGhEb21haW46IFwicmVjZXB0aW9uLW1hbmFnZW1lbnQuZmlyZWJhc2VhcHAuY29tXCIsXG4gICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9yZWNlcHRpb24tbWFuYWdlbWVudC5maXJlYmFzZWlvLmNvbVwiLFxuICAgIHByb2plY3RJZDogXCJyZWNlcHRpb24tbWFuYWdlbWVudFwiLFxuICAgIHN0b3JhZ2VCdWNrZXQ6IFwicmVjZXB0aW9uLW1hbmFnZW1lbnQuYXBwc3BvdC5jb21cIixcbiAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCIxOTI0MTM1MDM4NTlcIixcbiAgICBhcHBJZDogXCIxOjE5MjQxMzUwMzg1OTp3ZWI6YzhmOWU3OGY3MDAwZDRlYVwiXG4gIH07XG5cbiAgLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZVxuICBmaXJlYmFzZS5pbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcbiAgdmFyIGRhdGFiYXNlID0gZmlyZWJhc2UuZGF0YWJhc2UoKTtcblxuICBjb25zdCBjb2RlV3JpdGVyID0gbmV3IFpYaW5nLkJyb3dzZXJRUkNvZGVTdmdXcml0ZXIoKTtcbiAgbGV0IHN2Z0VsZW1lbnQ7XG5cbiAgLy8gRm9ybSBlbGVtZW50c1xuICBsZXQgdmlzaXRvcklEID0gJ3YnICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDYpO1xuICBsZXQgbmFtZSA9ICQoJyNuYW1lJykudmFsKCk7XG4gIGxldCBjb250YWN0ID0gJCgnI2NvbnRhY3QnKS52YWwoKTtcbiAgbGV0IG5pYyA9ICQoJyNuaWMnKS52YWwoKTtcbiAgbGV0IGVtYWlsID0gJCgnI2VtYWlsJykudmFsKCk7XG4gIGxldCB2ZWhpY2xlTm8gPSAkKCcjdmVoaWNsZS1ubycpLnZhbCgpO1xuXG4gIC8vIFNlbmRpbmcgZGF0YSB0byBGaXJlYmFzZSBEYXRhYmFzZVxuICBmdW5jdGlvbiB3cml0ZVVzZXJEYXRhKHZpc2l0b3JJRCwgbmFtZSwgY29udGFjdCwgbmljLCBlbWFpbCwgdmVoaWNsZU5vKSB7XG4gICAgZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoXCJ2aXNpdG9ycy9cIiArIHZpc2l0b3JJRCkuc2V0KHtcbiAgICAgIElEOiB2aXNpdG9ySUQsXG4gICAgICBOYW1lOiBuYW1lLFxuICAgICAgQ29udGFjdDogY29udGFjdCxcbiAgICAgIE5JQzogbmljLFxuICAgICAgRW1haWw6IGVtYWlsLFxuICAgICAgVmVoaWNsZTogdmVoaWNsZU5vLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gRmlsbGluZyBiYWNrZ3JvdW5kIGNvbG91ciBvZiBDYW52YXNcbiAgZnVuY3Rpb24gZmlsbENhbnZhc0JhY2tncm91bmRXaXRoQ29sb3IoY2FudmFzLCBjb2xvcikge1xuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIGNvbnRleHQuc2F2ZSgpO1xuICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLW92ZXInO1xuXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgY29udGV4dC5yZXN0b3JlKCk7XG4gIH1cblxuICAvLyBGdW5jdGlvbiB3cml0ZSBRUlxuICBmdW5jdGlvbiB3cml0ZVFSKCkge1xuICAgIC8vIENhbGxpbmcgRmlyZWJhc2UgV3JpdGVcbiAgICB3cml0ZVVzZXJEYXRhKHZpc2l0b3JJRCwgbmFtZSwgY29udGFjdCwgbmljLCBlbWFpbCwgdmVoaWNsZU5vKTtcblxuICAgIC8vIFdyaXRlIFFSXG4gICAgc3ZnRWxlbWVudCA9IGNvZGVXcml0ZXIud3JpdGVUb0RvbShcbiAgICAgICcjcmVzdWx0JyxcbiAgICAgIEpTT04uc3RyaW5naWZ5KHZpc2l0b3JJRCwgbmFtZSwgY29udGFjdCwgbmljLCBlbWFpbCwgdmVoaWNsZU5vKSxcbiAgICAgIDI1MCxcbiAgICAgIDI1MFxuICAgICk7XG4gIH1cblxuICAvLyBGaWxlIGRvd25sb2FkIGZ1bmN0aW9uXG4gIGZ1bmN0aW9uIHNhdmVfYXNfc3ZnKCkge1xuICAgIHZhciBzdmdfZGF0YSA9ICQoXCIjcmVzdWx0IHN2Z1wiKS5odG1sKCk7IC8vcHV0IGlkIG9mIHlvdXIgc3ZnIGVsZW1lbnQgaGVyZVxuXG4gICAgdmFyIGhlYWQgPSAnPHN2ZyB0aXRsZT1cImdyYXBoXCIgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj4nO1xuXG4gICAgLy9pZiB5b3UgaGF2ZSBzb21lIGFkZGl0aW9uYWwgc3R5bGluZyBsaWtlIGdyYXBoIGVkZ2VzIHB1dCB0aGVtIGluc2lkZSA8c3R5bGU+IHRhZ1xuICAgIC8vIHZhciBzdHlsZSA9ICc8c3R5bGU+Y2lyY2xlIHtjdXJzb3I6IHBvaW50ZXI7c3Ryb2tlLXdpZHRoOiAxLjVweDt9dGV4dCB7Zm9udDogMTBweCBhcmlhbDt9cGF0aCB7c3Ryb2tlOiBEaW1HcmV5O3N0cm9rZS13aWR0aDogMS41cHg7fTwvc3R5bGU+J1xuXG4gICAgdmFyIGZ1bGxfc3ZnID0gaGVhZCArIHN2Z19kYXRhICsgXCI8L3N2Zz5cIjtcbiAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtmdWxsX3N2Z10sIHsgdHlwZTogXCJpbWFnZS9zdmcreG1sXCIgfSk7XG4gICAgc2F2ZUFzKGJsb2IsIFwiZ3JhcGguc3ZnXCIpO1xuICB9O1xuXG4gIC8vIEZvcm0gdmFsaWRhdGlvblxuICBmdW5jdGlvbiB2YWxpZGF0ZSgpIHtcbiAgICB2YXIgaXNGb3JtVmFsaWQgPSB0cnVlO1xuXG4gICAgJChcImlucHV0OnJlcXVpcmVkXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCQudHJpbSgkKHRoaXMpLnZhbCgpKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiaGlnaGxpZ2h0XCIpO1xuICAgICAgICBpc0Zvcm1WYWxpZCA9IGZhbHNlO1xuICAgICAgICAkKHRoaXMpLmZvY3VzKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyhcImhpZ2hsaWdodFwiKTtcblxuICAgICAgICAvLyBEaXNhYmxlIHRoZSBidXR0b25cbiAgICAgICAgJCgnI3N1Ym1pdEJ0bicpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICghaXNGb3JtVmFsaWQpIHtcbiAgICAgIGFsZXJ0KFwiUGxlYXNlIGZpbGwgaW4gYWxsIHRoZSByZXF1aXJlZCBmaWVsZHMgKGluZGljYXRlZCBieSAqKVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ2FsbCB3cml0ZSBRUiBmdW5jdGlvblxuICAgICAgd3JpdGVRUigpO1xuICAgIH1cblxuICAgIHJldHVybiBpc0Zvcm1WYWxpZDtcbiAgfVxuXG4gIC8vIERlZmluaW5nIGZvcm0gYnV0dG9uIGVsZW1lbnRcbiAgbGV0IHN1Ym1pdEJ0biA9ICQoJyNzdWJtaXRCdG4nKTtcblxuICBzdWJtaXRCdG4uY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBDYWxsIHZhbGlkYXRlIGZ1bmN0aW9uXG4gICAgdmFsaWRhdGUoKTtcblxuICAgIC8vIENhbGwgZG93bmxvYWQgZnVuY3Rpb25cbiAgICBzYXZlX2FzX3N2ZygpO1xuICB9KTtcbn1cbiJdfQ==

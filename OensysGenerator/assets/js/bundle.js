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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2R1bGVzL3FyR2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7O0FBRUEsZ0M7O0FBRUEscUQ7O0FBRUEsQ0FBQyxVQUFVLENBQVYsRUFBYTtBQUNaLElBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsWUFBWTtBQUM1QjtBQUNELEdBRkQ7O0FBSUE7QUFDQSxXQUFTLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0Q7QUFDRixDQVZELEVBVUcsZ0JBVkgsRSxDQUhBOzs7Ozs7Ozs7QUNBZSxZQUFZO0FBQ3pCLE1BQUksaUJBQWlCO0FBQ25CLFlBQVEseUNBRFc7QUFFbkIsZ0JBQVksc0NBRk87QUFHbkIsaUJBQWEsNkNBSE07QUFJbkIsZUFBVyxzQkFKUTtBQUtuQixtQkFBZSxrQ0FMSTtBQU1uQix1QkFBbUIsY0FOQTtBQU9uQixXQUFPLHFDQVBZLEVBQXJCOzs7QUFVQTtBQUNBLFdBQVMsYUFBVCxDQUF1QixjQUF2QjtBQUNBLE1BQUksV0FBVyxTQUFTLFFBQVQsRUFBZjs7QUFFQSxNQUFNLGFBQWEsSUFBSSxNQUFNLHNCQUFWLEVBQW5CO0FBQ0EsTUFBSSxtQkFBSjs7QUFFQTtBQUNBLE1BQUksWUFBWSxNQUFNLEtBQUssTUFBTCxHQUFjLFFBQWQsQ0FBdUIsRUFBdkIsRUFBMkIsTUFBM0IsQ0FBa0MsQ0FBbEMsRUFBcUMsQ0FBckMsQ0FBdEI7QUFDQSxNQUFJLE9BQU8sRUFBRSxPQUFGLEVBQVcsR0FBWCxFQUFYO0FBQ0EsTUFBSSxVQUFVLEVBQUUsVUFBRixFQUFjLEdBQWQsRUFBZDtBQUNBLE1BQUksTUFBTSxFQUFFLE1BQUYsRUFBVSxHQUFWLEVBQVY7QUFDQSxNQUFJLFFBQVEsRUFBRSxRQUFGLEVBQVksR0FBWixFQUFaO0FBQ0EsTUFBSSxZQUFZLEVBQUUsYUFBRixFQUFpQixHQUFqQixFQUFoQjs7QUFFQTtBQUNBLFdBQVMsYUFBVCxDQUF1QixTQUF2QixFQUFrQyxJQUFsQyxFQUF3QyxPQUF4QyxFQUFpRCxHQUFqRCxFQUFzRCxLQUF0RCxFQUE2RCxTQUE3RCxFQUF3RTtBQUN0RSxhQUFTLFFBQVQsR0FBb0IsR0FBcEIsQ0FBd0IsY0FBYyxTQUF0QyxFQUFpRCxHQUFqRCxDQUFxRDtBQUNuRCxVQUFJLFNBRCtDO0FBRW5ELFlBQU0sSUFGNkM7QUFHbkQsZUFBUyxPQUgwQztBQUluRCxXQUFLLEdBSjhDO0FBS25ELGFBQU8sS0FMNEM7QUFNbkQsZUFBUyxTQU4wQyxFQUFyRDs7QUFRRDs7QUFFRDtBQUNBLFdBQVMsNkJBQVQsQ0FBdUMsTUFBdkMsRUFBK0MsS0FBL0MsRUFBc0Q7QUFDcEQsUUFBTSxVQUFVLE9BQU8sVUFBUCxDQUFrQixJQUFsQixDQUFoQjs7QUFFQSxZQUFRLElBQVI7QUFDQSxZQUFRLHdCQUFSLEdBQW1DLGtCQUFuQzs7QUFFQSxZQUFRLFNBQVIsR0FBb0IsS0FBcEI7QUFDQSxZQUFRLFFBQVIsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBdUIsT0FBTyxLQUE5QixFQUFxQyxPQUFPLE1BQTVDO0FBQ0EsWUFBUSxPQUFSO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLE9BQVQsR0FBbUI7QUFDakI7QUFDQSxrQkFBYyxTQUFkLEVBQXlCLElBQXpCLEVBQStCLE9BQS9CLEVBQXdDLEdBQXhDLEVBQTZDLEtBQTdDLEVBQW9ELFNBQXBEOztBQUVBO0FBQ0EsaUJBQWEsV0FBVyxVQUFYO0FBQ1gsYUFEVztBQUVYLFNBQUssU0FBTCxDQUFlLFNBQWYsRUFBMEIsSUFBMUIsRUFBZ0MsT0FBaEMsRUFBeUMsR0FBekMsRUFBOEMsS0FBOUMsRUFBcUQsU0FBckQsQ0FGVztBQUdYLE9BSFc7QUFJWCxPQUpXLENBQWI7O0FBTUQ7O0FBRUQ7QUFDQSxXQUFTLFdBQVQsR0FBdUI7QUFDckIsUUFBSSxXQUFXLEVBQUUsYUFBRixFQUFpQixJQUFqQixFQUFmLENBRHFCLENBQ21COztBQUV4QyxRQUFJLE9BQU8sc0VBQVg7O0FBRUE7QUFDQTs7QUFFQSxRQUFJLFdBQVcsT0FBTyxRQUFQLEdBQWtCLFFBQWpDO0FBQ0EsUUFBSSxPQUFPLElBQUksSUFBSixDQUFTLENBQUMsUUFBRCxDQUFULEVBQXFCLEVBQUUsTUFBTSxlQUFSLEVBQXJCLENBQVg7QUFDQSxXQUFPLElBQVAsRUFBYSxXQUFiO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLFFBQVQsR0FBb0I7QUFDbEIsUUFBSSxjQUFjLElBQWxCOztBQUVBLE1BQUUsZ0JBQUYsRUFBb0IsSUFBcEIsQ0FBeUIsWUFBWTtBQUNuQyxVQUFJLEVBQUUsSUFBRixDQUFPLEVBQUUsSUFBRixFQUFRLEdBQVIsRUFBUCxFQUFzQixNQUF0QixJQUFnQyxDQUFwQyxFQUF1QztBQUNyQyxVQUFFLElBQUYsRUFBUSxRQUFSLENBQWlCLFdBQWpCO0FBQ0Esc0JBQWMsS0FBZDtBQUNBLFVBQUUsSUFBRixFQUFRLEtBQVI7QUFDRCxPQUpEO0FBS0s7QUFDSCxVQUFFLElBQUYsRUFBUSxXQUFSLENBQW9CLFdBQXBCOztBQUVBO0FBQ0EsVUFBRSxZQUFGLEVBQWdCLElBQWhCLENBQXFCLFVBQXJCLEVBQWlDLElBQWpDO0FBQ0Q7QUFDRixLQVpEOztBQWNBLFFBQUksQ0FBQyxXQUFMLEVBQWtCO0FBQ2hCLFlBQU0seURBQU47QUFDRCxLQUZELE1BRU87QUFDTDtBQUNBO0FBQ0Q7O0FBRUQsV0FBTyxXQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJLFlBQVksRUFBRSxZQUFGLENBQWhCOztBQUVBLFlBQVUsS0FBVixDQUFnQixVQUFVLENBQVYsRUFBYTtBQUMzQixNQUFFLGNBQUY7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0QsR0FSRDtBQVNELEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IGpxdWVyeSBmcm9tICdqcXVlcnknO1xyXG4vLyBpbXBvcnQgZm9ybVZhbGlkYXRvciBmcm9tICdtb2R1bGVzL2Zvcm1WYWxpZGF0b3IuanMnO1xyXG5pbXBvcnQgcXJHZW5lcmF0b3IgZnJvbSAnbW9kdWxlcy9xckdlbmVyYXRvci5qcyc7XHJcblxyXG4oZnVuY3Rpb24gKCQpIHtcclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICByZWFkeSgpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBJbml0YWxpemluZyBhbGwgbW9kdWxlc1xyXG4gIGZ1bmN0aW9uIHJlYWR5KCkge1xyXG4gICAgLy8gZm9ybVZhbGlkYXRvcigpO1xyXG4gICAgcXJHZW5lcmF0b3IoKTtcclxuICB9XHJcbn0pKGpxdWVyeSk7XHJcbiIsIi8qKlxyXG4gKiBRUiBHZW5lcmF0b3JcclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGZpcmViYXNlQ29uZmlnID0ge1xyXG4gICAgYXBpS2V5OiBcIkFJemFTeUFYMGctZmFaWWlVTER5X1FpTE1CeGFpZ05CQjg1VkFQSVwiLFxyXG4gICAgYXV0aERvbWFpbjogXCJyZWNlcHRpb24tbWFuYWdlbWVudC5maXJlYmFzZWFwcC5jb21cIixcclxuICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vcmVjZXB0aW9uLW1hbmFnZW1lbnQuZmlyZWJhc2Vpby5jb21cIixcclxuICAgIHByb2plY3RJZDogXCJyZWNlcHRpb24tbWFuYWdlbWVudFwiLFxyXG4gICAgc3RvcmFnZUJ1Y2tldDogXCJyZWNlcHRpb24tbWFuYWdlbWVudC5hcHBzcG90LmNvbVwiLFxyXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMTkyNDEzNTAzODU5XCIsXHJcbiAgICBhcHBJZDogXCIxOjE5MjQxMzUwMzg1OTp3ZWI6YzhmOWU3OGY3MDAwZDRlYVwiXHJcbiAgfTtcclxuXHJcbiAgLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZVxyXG4gIGZpcmViYXNlLmluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xyXG4gIHZhciBkYXRhYmFzZSA9IGZpcmViYXNlLmRhdGFiYXNlKCk7XHJcblxyXG4gIGNvbnN0IGNvZGVXcml0ZXIgPSBuZXcgWlhpbmcuQnJvd3NlclFSQ29kZVN2Z1dyaXRlcigpO1xyXG4gIGxldCBzdmdFbGVtZW50O1xyXG5cclxuICAvLyBGb3JtIGVsZW1lbnRzXHJcbiAgbGV0IHZpc2l0b3JJRCA9ICd2JyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCA2KTtcclxuICBsZXQgbmFtZSA9ICQoJyNuYW1lJykudmFsKCk7XHJcbiAgbGV0IGNvbnRhY3QgPSAkKCcjY29udGFjdCcpLnZhbCgpO1xyXG4gIGxldCBuaWMgPSAkKCcjbmljJykudmFsKCk7XHJcbiAgbGV0IGVtYWlsID0gJCgnI2VtYWlsJykudmFsKCk7XHJcbiAgbGV0IHZlaGljbGVObyA9ICQoJyN2ZWhpY2xlLW5vJykudmFsKCk7XHJcblxyXG4gIC8vIFNlbmRpbmcgZGF0YSB0byBGaXJlYmFzZSBEYXRhYmFzZVxyXG4gIGZ1bmN0aW9uIHdyaXRlVXNlckRhdGEodmlzaXRvcklELCBuYW1lLCBjb250YWN0LCBuaWMsIGVtYWlsLCB2ZWhpY2xlTm8pIHtcclxuICAgIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKFwidmlzaXRvcnMvXCIgKyB2aXNpdG9ySUQpLnNldCh7XHJcbiAgICAgIElEOiB2aXNpdG9ySUQsXHJcbiAgICAgIE5hbWU6IG5hbWUsXHJcbiAgICAgIENvbnRhY3Q6IGNvbnRhY3QsXHJcbiAgICAgIE5JQzogbmljLFxyXG4gICAgICBFbWFpbDogZW1haWwsXHJcbiAgICAgIFZlaGljbGU6IHZlaGljbGVObyxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gRmlsbGluZyBiYWNrZ3JvdW5kIGNvbG91ciBvZiBDYW52YXNcclxuICBmdW5jdGlvbiBmaWxsQ2FudmFzQmFja2dyb3VuZFdpdGhDb2xvcihjYW52YXMsIGNvbG9yKSB7XHJcbiAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1vdmVyJztcclxuXHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBGdW5jdGlvbiB3cml0ZSBRUlxyXG4gIGZ1bmN0aW9uIHdyaXRlUVIoKSB7XHJcbiAgICAvLyBDYWxsaW5nIEZpcmViYXNlIFdyaXRlXHJcbiAgICB3cml0ZVVzZXJEYXRhKHZpc2l0b3JJRCwgbmFtZSwgY29udGFjdCwgbmljLCBlbWFpbCwgdmVoaWNsZU5vKTtcclxuXHJcbiAgICAvLyBXcml0ZSBRUlxyXG4gICAgc3ZnRWxlbWVudCA9IGNvZGVXcml0ZXIud3JpdGVUb0RvbShcclxuICAgICAgJyNyZXN1bHQnLFxyXG4gICAgICBKU09OLnN0cmluZ2lmeSh2aXNpdG9ySUQsIG5hbWUsIGNvbnRhY3QsIG5pYywgZW1haWwsIHZlaGljbGVObyksXHJcbiAgICAgIDI1MCxcclxuICAgICAgMjUwXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLy8gRmlsZSBkb3dubG9hZCBmdW5jdGlvblxyXG4gIGZ1bmN0aW9uIHNhdmVfYXNfc3ZnKCkge1xyXG4gICAgdmFyIHN2Z19kYXRhID0gJChcIiNyZXN1bHQgc3ZnXCIpLmh0bWwoKTsgLy9wdXQgaWQgb2YgeW91ciBzdmcgZWxlbWVudCBoZXJlXHJcblxyXG4gICAgdmFyIGhlYWQgPSAnPHN2ZyB0aXRsZT1cImdyYXBoXCIgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj4nO1xyXG5cclxuICAgIC8vaWYgeW91IGhhdmUgc29tZSBhZGRpdGlvbmFsIHN0eWxpbmcgbGlrZSBncmFwaCBlZGdlcyBwdXQgdGhlbSBpbnNpZGUgPHN0eWxlPiB0YWdcclxuICAgIC8vIHZhciBzdHlsZSA9ICc8c3R5bGU+Y2lyY2xlIHtjdXJzb3I6IHBvaW50ZXI7c3Ryb2tlLXdpZHRoOiAxLjVweDt9dGV4dCB7Zm9udDogMTBweCBhcmlhbDt9cGF0aCB7c3Ryb2tlOiBEaW1HcmV5O3N0cm9rZS13aWR0aDogMS41cHg7fTwvc3R5bGU+J1xyXG5cclxuICAgIHZhciBmdWxsX3N2ZyA9IGhlYWQgKyBzdmdfZGF0YSArIFwiPC9zdmc+XCI7XHJcbiAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtmdWxsX3N2Z10sIHsgdHlwZTogXCJpbWFnZS9zdmcreG1sXCIgfSk7XHJcbiAgICBzYXZlQXMoYmxvYiwgXCJncmFwaC5zdmdcIik7XHJcbiAgfTtcclxuXHJcbiAgLy8gRm9ybSB2YWxpZGF0aW9uXHJcbiAgZnVuY3Rpb24gdmFsaWRhdGUoKSB7XHJcbiAgICB2YXIgaXNGb3JtVmFsaWQgPSB0cnVlO1xyXG5cclxuICAgICQoXCJpbnB1dDpyZXF1aXJlZFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCQudHJpbSgkKHRoaXMpLnZhbCgpKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJoaWdobGlnaHRcIik7XHJcbiAgICAgICAgaXNGb3JtVmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAkKHRoaXMpLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyhcImhpZ2hsaWdodFwiKTtcclxuXHJcbiAgICAgICAgLy8gRGlzYWJsZSB0aGUgYnV0dG9uXHJcbiAgICAgICAgJCgnI3N1Ym1pdEJ0bicpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFpc0Zvcm1WYWxpZCkge1xyXG4gICAgICBhbGVydChcIlBsZWFzZSBmaWxsIGluIGFsbCB0aGUgcmVxdWlyZWQgZmllbGRzIChpbmRpY2F0ZWQgYnkgKilcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBDYWxsIHdyaXRlIFFSIGZ1bmN0aW9uXHJcbiAgICAgIHdyaXRlUVIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaXNGb3JtVmFsaWQ7XHJcbiAgfVxyXG5cclxuICAvLyBEZWZpbmluZyBmb3JtIGJ1dHRvbiBlbGVtZW50XHJcbiAgbGV0IHN1Ym1pdEJ0biA9ICQoJyNzdWJtaXRCdG4nKTtcclxuXHJcbiAgc3VibWl0QnRuLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgLy8gQ2FsbCB2YWxpZGF0ZSBmdW5jdGlvblxyXG4gICAgdmFsaWRhdGUoKTtcclxuXHJcbiAgICAvLyBDYWxsIGRvd25sb2FkIGZ1bmN0aW9uXHJcbiAgICBzYXZlX2FzX3N2ZygpO1xyXG4gIH0pO1xyXG59XHJcbiJdfQ==

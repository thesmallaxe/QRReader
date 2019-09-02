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
    (0, _qrGenerator2.default)();
  }
})(_jquery2.default);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"modules/qrGenerator.js":2}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default =



function () {
  //! Firebase Initialisation
  var firebaseConfig = {
    apiKey: "AIzaSyBSES8151aT4TvUkaaQUc8z6Jt_rKlHss8",
    authDomain: "qr-reader-e5dbe.firebaseapp.com",
    databaseURL: "https://qr-reader-e5dbe.firebaseio.com",
    projectId: "qr-reader-e5dbe",
    storageBucket: "qr-reader-e5dbe.appspot.com",
    messagingSenderId: "501459211305",
    appId: "1:501459211305:web:757b993c57fe8f2b" };


  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

  //!Importing the file
  var invites = [];

  var codeWriter = new ZXing.BrowserQRCodeSvgWriter();
  var svgElement = void 0;

  var fileInput = document.getElementById("csv"),
  readFile = function readFile() {
    var reader = new FileReader();
    reader.onload = function () {
      var table_details = reader.result;
      var table_details_new = table_details.split("\r\n");
      table_details_new.forEach(function (row) {
        var split = row.split(",");
        invites.push({
          id: split[0],
          name: split[1],
          title: split[2],
          company: split[3],
          image: split[4] });

      });
      loadTable(invites);
    };
    reader.readAsBinaryString(fileInput.files[0]);
  };
  fileInput.addEventListener("change", readFile);

  $('.btn-generate-all').click(function () {
    var i = 0;
    for (i = 0; i < invites.length; i++) {
      var invite = invites[i];
      var id = "#table-row-qr-" + i;
      svgElement = codeWriter.writeToDom(
      id,
      JSON.stringify(invite),
      200,
      200);

      writeUserData(invite);
    }
  });

  $('.btn-save-all').click(function () {
    var i = 0;
    for (i = 0; i < invites.length; i++) {
      canvg(document.getElementById("canvas"), $("#table-row-qr-" + i).html());
      // DON'T DELETE THE COMMENTED CODE BELOW
      // document.write('<img src="' + img + '"/>');
      download(invites[i].name + ".png");
    }
  });

  function loadTable(invites) {
    var i = 0;
    for (i = 0; i < invites.length; i++) {
      var row = $("#template-row").clone().appendTo("#table");
      $(row).attr("style", "");
      $(row).children(".table-row-id").html(invites[i].id);
      $(row).children(".table-row-name").html(invites[i].name);
      $(row).children(".table-row-title").html(invites[i].title);
      $(row).children(".table-row-company").html(invites[i].company);
      $(row).children(".table-row-image").html(invites[i].image);

      $(row).children(".table-row-btn").children(".btn-generate").removeClass('btn-generate-all').html('Generate').attr("data-index", i);
      $(row).children(".table-row-qr").attr("id", "table-row-qr-" + i);
      $(row).children(".table-row-btn").children(".btn-save").removeClass('btn-save-all').html('Save').attr("data-index", i);

      $(row).children(".table-row-btn").children(".btn-generate").click(function () {
        var elementID = $(this).attr("data-index");
        var invite = invites[elementID];
        var id = "#table-row-qr-" + elementID;
        svgElement = codeWriter.writeToDom(
        id,
        JSON.stringify(invite),
        200,
        200);

        // Calling Firebase Write
        writeUserData(invite);
      });

      // Save button
      $(row).children(".table-row-btn").children(".btn-save").click(function () {
        var elementID = $(this).attr("data-index");
        canvg(document.getElementById("canvas"), $("#table-row-qr-" + elementID).html());
        // DON'T DELETE THE COMMENTED CODE BELOW
        // document.write('<img src="' + img + '"/>');
        download(invites[elementID].name + ".png");
      });
    }
  }

  // Sending data to Firebase Database
  function writeUserData(invite) {
    console.log(invite);
    firebase.database().ref("attendees/" + invite.id).set({
      ID: invite.id,
      Name: invite.name,
      Title: invite.title,
      Company: invite.company,
      Image: invite.image,
      Attended: "No" });

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

  // Filling background colour of Canvas
  function fillCanvasBackgroundWithColor(canvas, color) {
    var context = canvas.getContext('2d');

    context.save();
    context.globalCompositeOperation = 'destination-over';

    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2R1bGVzL3FyR2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7O0FBRUEsZ0M7QUFDQSxxRDs7QUFFQSxDQUFDLFVBQVUsQ0FBVixFQUFhO0FBQ1osSUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFZO0FBQzVCO0FBQ0QsR0FGRDs7QUFJQTtBQUNBLFdBQVMsS0FBVCxHQUFpQjtBQUNmO0FBQ0Q7QUFDRixDQVRELEVBU0csZ0JBVEg7Ozs7Ozs7OztBQ0ZlLFlBQVk7QUFDekI7QUFDQSxNQUFJLGlCQUFpQjtBQUNuQixZQUFRLHlDQURXO0FBRW5CLGdCQUFZLGlDQUZPO0FBR25CLGlCQUFhLHdDQUhNO0FBSW5CLGVBQVcsaUJBSlE7QUFLbkIsbUJBQWUsNkJBTEk7QUFNbkIsdUJBQW1CLGNBTkE7QUFPbkIsV0FBTyxxQ0FQWSxFQUFyQjs7O0FBVUEsV0FBUyxhQUFULENBQXVCLGNBQXZCO0FBQ0EsTUFBSSxXQUFXLFNBQVMsUUFBVCxFQUFmOztBQUVBO0FBQ0EsTUFBSSxVQUFVLEVBQWQ7O0FBRUEsTUFBTSxhQUFhLElBQUksTUFBTSxzQkFBVixFQUFuQjtBQUNBLE1BQUksbUJBQUo7O0FBRUEsTUFBSSxZQUFZLFNBQVMsY0FBVCxDQUF3QixLQUF4QixDQUFoQjtBQUNFLGFBQVcsU0FBWCxRQUFXLEdBQVk7QUFDckIsUUFBSSxTQUFTLElBQUksVUFBSixFQUFiO0FBQ0EsV0FBTyxNQUFQLEdBQWdCLFlBQVk7QUFDMUIsVUFBTSxnQkFBZ0IsT0FBTyxNQUE3QjtBQUNBLFVBQU0sb0JBQW9CLGNBQWMsS0FBZCxDQUFvQixNQUFwQixDQUExQjtBQUNBLHdCQUFrQixPQUFsQixDQUEwQixlQUFPO0FBQy9CLFlBQUksUUFBUSxJQUFJLEtBQUosQ0FBVSxHQUFWLENBQVo7QUFDQSxnQkFBUSxJQUFS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QUF0RDs7QUFRRDs7QUFFRCxXQUFTLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEI7QUFDMUI7QUFDQSxRQUFJLFNBQVMsU0FBUyxjQUFULENBQXdCLFFBQXhCLENBQWI7QUFDQSxrQ0FBOEIsTUFBOUIsRUFBc0MsTUFBdEM7QUFDQSxRQUFJLE1BQU0sT0FBTyxTQUFQLENBQWlCLFdBQWpCLENBQVY7O0FBRUE7QUFDQSxRQUFJLFVBQVUsU0FBUyxhQUFULENBQXVCLEdBQXZCLENBQWQ7QUFDQSxZQUFRLFlBQVIsQ0FBcUIsTUFBckIsRUFBNkIsR0FBN0I7QUFDQSxZQUFRLFlBQVIsQ0FBcUIsVUFBckIsRUFBaUMsUUFBakM7QUFDQSxZQUFRLEtBQVIsQ0FBYyxPQUFkLEdBQXdCLE1BQXhCO0FBQ0EsYUFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixPQUExQjtBQUNBLFlBQVEsS0FBUjtBQUNBLGFBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsT0FBMUI7QUFDRDs7QUFFRDtBQUNBLFdBQVMsNkJBQVQsQ0FBdUMsTUFBdkMsRUFBK0MsS0FBL0MsRUFBc0Q7QUFDcEQsUUFBTSxVQUFVLE9BQU8sVUFBUCxDQUFrQixJQUFsQixDQUFoQjs7QUFFQSxZQUFRLElBQVI7QUFDQSxZQUFRLHdCQUFSLEdBQW1DLGtCQUFuQzs7QUFFQSxZQUFRLFNBQVIsR0FBb0IsS0FBcEI7QUFDQSxZQUFRLFFBQVIsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBdUIsT0FBTyxLQUE5QixFQUFxQyxPQUFPLE1BQTVDO0FBQ0EsWUFBUSxPQUFSO0FBQ0Q7QUFDRixDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyogZXNsaW50LWVudiBicm93c2VyICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBqcXVlcnkgZnJvbSAnanF1ZXJ5JztcclxuaW1wb3J0IHFyR2VuZXJhdG9yIGZyb20gJ21vZHVsZXMvcXJHZW5lcmF0b3IuanMnO1xyXG5cclxuKGZ1bmN0aW9uICgkKSB7XHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgcmVhZHkoKTtcclxuICB9KTtcclxuXHJcbiAgLy8gSW5pdGFsaXppbmcgYWxsIG1vZHVsZXNcclxuICBmdW5jdGlvbiByZWFkeSgpIHtcclxuICAgIHFyR2VuZXJhdG9yKCk7XHJcbiAgfVxyXG59KShqcXVlcnkpO1xyXG4iLCIvKipcclxuICogUVIgR2VuZXJhdG9yXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gIC8vISBGaXJlYmFzZSBJbml0aWFsaXNhdGlvblxyXG4gIHZhciBmaXJlYmFzZUNvbmZpZyA9IHtcclxuICAgIGFwaUtleTogXCJBSXphU3lCU0VTODE1MWFUNFR2VWthYVFVYzh6Nkp0X3JLbEhzczhcIixcclxuICAgIGF1dGhEb21haW46IFwicXItcmVhZGVyLWU1ZGJlLmZpcmViYXNlYXBwLmNvbVwiLFxyXG4gICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9xci1yZWFkZXItZTVkYmUuZmlyZWJhc2Vpby5jb21cIixcclxuICAgIHByb2plY3RJZDogXCJxci1yZWFkZXItZTVkYmVcIixcclxuICAgIHN0b3JhZ2VCdWNrZXQ6IFwicXItcmVhZGVyLWU1ZGJlLmFwcHNwb3QuY29tXCIsXHJcbiAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCI1MDE0NTkyMTEzMDVcIixcclxuICAgIGFwcElkOiBcIjE6NTAxNDU5MjExMzA1OndlYjo3NTdiOTkzYzU3ZmU4ZjJiXCJcclxuICB9O1xyXG5cclxuICBmaXJlYmFzZS5pbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcclxuICB2YXIgZGF0YWJhc2UgPSBmaXJlYmFzZS5kYXRhYmFzZSgpO1xyXG5cclxuICAvLyFJbXBvcnRpbmcgdGhlIGZpbGVcclxuICB2YXIgaW52aXRlcyA9IFtdO1xyXG5cclxuICBjb25zdCBjb2RlV3JpdGVyID0gbmV3IFpYaW5nLkJyb3dzZXJRUkNvZGVTdmdXcml0ZXIoKTtcclxuICBsZXQgc3ZnRWxlbWVudDtcclxuXHJcbiAgbGV0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3N2XCIpLFxyXG4gICAgcmVhZEZpbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IHRhYmxlX2RldGFpbHMgPSByZWFkZXIucmVzdWx0O1xyXG4gICAgICAgIGNvbnN0IHRhYmxlX2RldGFpbHNfbmV3ID0gdGFibGVfZGV0YWlscy5zcGxpdChcIlxcclxcblwiKTtcclxuICAgICAgICB0YWJsZV9kZXRhaWxzX25ldy5mb3JFYWNoKHJvdyA9PiB7XHJcbiAgICAgICAgICBsZXQgc3BsaXQgPSByb3cuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgaW52aXRlcy5wdXNoKHtcclxuICAgICAgICAgICAgaWQ6IHNwbGl0WzBdLFxyXG4gICAgICAgICAgICBuYW1lOiBzcGxpdFsxXSxcclxuICAgICAgICAgICAgdGl0bGU6IHNwbGl0WzJdLFxyXG4gICAgICAgICAgICBjb21wYW55OiBzcGxpdFszXSxcclxuICAgICAgICAgICAgaW1hZ2U6IHNwbGl0WzRdXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBsb2FkVGFibGUoaW52aXRlcyk7XHJcbiAgICAgIH07XHJcbiAgICAgIHJlYWRlci5yZWFkQXNCaW5hcnlTdHJpbmcoZmlsZUlucHV0LmZpbGVzWzBdKTtcclxuICAgIH07XHJcbiAgZmlsZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgcmVhZEZpbGUpO1xyXG5cclxuICAkKCcuYnRuLWdlbmVyYXRlLWFsbCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBpID0gMDtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBpbnZpdGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBpbnZpdGUgPSBpbnZpdGVzW2ldO1xyXG4gICAgICBsZXQgaWQgPSBcIiN0YWJsZS1yb3ctcXItXCIgKyBpO1xyXG4gICAgICBzdmdFbGVtZW50ID0gY29kZVdyaXRlci53cml0ZVRvRG9tKFxyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KGludml0ZSksXHJcbiAgICAgICAgMjAwLFxyXG4gICAgICAgIDIwMFxyXG4gICAgICApO1xyXG4gICAgICB3cml0ZVVzZXJEYXRhKGludml0ZSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoJy5idG4tc2F2ZS1hbGwnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgaW52aXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjYW52Zyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKSwkKFwiI3RhYmxlLXJvdy1xci1cIiArIGkpLmh0bWwoKSk7XHJcbiAgICAgIC8vIERPTidUIERFTEVURSBUSEUgQ09NTUVOVEVEIENPREUgQkVMT1dcclxuICAgICAgLy8gZG9jdW1lbnQud3JpdGUoJzxpbWcgc3JjPVwiJyArIGltZyArICdcIi8+Jyk7XHJcbiAgICAgIGRvd25sb2FkKGludml0ZXNbaV0ubmFtZSArIFwiLnBuZ1wiKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gbG9hZFRhYmxlKGludml0ZXMpe1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGludml0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IHJvdyA9ICQoXCIjdGVtcGxhdGUtcm93XCIpLmNsb25lKCkuYXBwZW5kVG8oXCIjdGFibGVcIik7XHJcbiAgICAgICQocm93KS5hdHRyKFwic3R5bGVcIiwgXCJcIik7XHJcbiAgICAgICQocm93KS5jaGlsZHJlbihcIi50YWJsZS1yb3ctaWRcIikuaHRtbChpbnZpdGVzW2ldLmlkKTtcclxuICAgICAgJChyb3cpLmNoaWxkcmVuKFwiLnRhYmxlLXJvdy1uYW1lXCIpLmh0bWwoaW52aXRlc1tpXS5uYW1lKTtcclxuICAgICAgJChyb3cpLmNoaWxkcmVuKFwiLnRhYmxlLXJvdy10aXRsZVwiKS5odG1sKGludml0ZXNbaV0udGl0bGUpO1xyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LWNvbXBhbnlcIikuaHRtbChpbnZpdGVzW2ldLmNvbXBhbnkpO1xyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LWltYWdlXCIpLmh0bWwoaW52aXRlc1tpXS5pbWFnZSk7XHJcbiAgICAgIFxyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LWJ0blwiKS5jaGlsZHJlbihcIi5idG4tZ2VuZXJhdGVcIikucmVtb3ZlQ2xhc3MoJ2J0bi1nZW5lcmF0ZS1hbGwnKS5odG1sKCdHZW5lcmF0ZScpLmF0dHIoXCJkYXRhLWluZGV4XCIsIGkpO1xyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LXFyXCIpLmF0dHIoXCJpZFwiLCBcInRhYmxlLXJvdy1xci1cIiArIGkpO1xyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LWJ0blwiKS5jaGlsZHJlbihcIi5idG4tc2F2ZVwiKS5yZW1vdmVDbGFzcygnYnRuLXNhdmUtYWxsJykuaHRtbCgnU2F2ZScpLmF0dHIoXCJkYXRhLWluZGV4XCIsIGkpO1xyXG5cclxuICAgICAgJChyb3cpLmNoaWxkcmVuKFwiLnRhYmxlLXJvdy1idG5cIikuY2hpbGRyZW4oXCIuYnRuLWdlbmVyYXRlXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgZWxlbWVudElEID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1pbmRleFwiKTtcclxuICAgICAgICBsZXQgaW52aXRlID0gaW52aXRlc1tlbGVtZW50SURdO1xyXG4gICAgICAgIGxldCBpZCA9IFwiI3RhYmxlLXJvdy1xci1cIiArIGVsZW1lbnRJRDtcclxuICAgICAgICBzdmdFbGVtZW50ID0gY29kZVdyaXRlci53cml0ZVRvRG9tKFxyXG4gICAgICAgICAgaWQsXHJcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeShpbnZpdGUpLFxyXG4gICAgICAgICAgMjAwLFxyXG4gICAgICAgICAgMjAwXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBDYWxsaW5nIEZpcmViYXNlIFdyaXRlXHJcbiAgICAgICAgd3JpdGVVc2VyRGF0YShpbnZpdGUpOyAgICAgICAgXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gU2F2ZSBidXR0b25cclxuICAgICAgJChyb3cpLmNoaWxkcmVuKFwiLnRhYmxlLXJvdy1idG5cIikuY2hpbGRyZW4oXCIuYnRuLXNhdmVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCBlbGVtZW50SUQgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLWluZGV4XCIpO1xyXG4gICAgICAgIGNhbnZnKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpLCQoXCIjdGFibGUtcm93LXFyLVwiICsgZWxlbWVudElEKS5odG1sKCkpO1xyXG4gICAgICAgIC8vIERPTidUIERFTEVURSBUSEUgQ09NTUVOVEVEIENPREUgQkVMT1dcclxuICAgICAgICAvLyBkb2N1bWVudC53cml0ZSgnPGltZyBzcmM9XCInICsgaW1nICsgJ1wiLz4nKTtcclxuICAgICAgICBkb3dubG9hZChpbnZpdGVzW2VsZW1lbnRJRF0ubmFtZSArIFwiLnBuZ1wiKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBTZW5kaW5nIGRhdGEgdG8gRmlyZWJhc2UgRGF0YWJhc2VcclxuICBmdW5jdGlvbiB3cml0ZVVzZXJEYXRhKGludml0ZSkge1xyXG4gICAgY29uc29sZS5sb2coaW52aXRlKTtcclxuICAgIGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKFwiYXR0ZW5kZWVzL1wiICsgaW52aXRlLmlkKS5zZXQoe1xyXG4gICAgICBJRDogaW52aXRlLmlkLFxyXG4gICAgICBOYW1lOiBpbnZpdGUubmFtZSxcclxuICAgICAgVGl0bGU6IGludml0ZS50aXRsZSxcclxuICAgICAgQ29tcGFueTogaW52aXRlLmNvbXBhbnksXHJcbiAgICAgIEltYWdlOiBpbnZpdGUuaW1hZ2UsXHJcbiAgICAgIEF0dGVuZGVkOiBcIk5vXCJcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZG93bmxvYWQoZmlsZW5hbWUpIHtcclxuICAgIC8vIERlZmluaW5nIHRoZSBjYW52YXNcclxuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTtcclxuICAgIGZpbGxDYW52YXNCYWNrZ3JvdW5kV2l0aENvbG9yKGNhbnZhcywgJyNmZmYnKTtcclxuICAgIHZhciBpbWcgPSBjYW52YXMudG9EYXRhVVJMKFwiaW1hZ2UvcG5nXCIpO1xyXG5cclxuICAgIC8vIERvd25sb2FkIGZ1bmN0aW9uIGFzIGFuIGltYWdlXHJcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgaW1nKTtcclxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGZpbGVuYW1lKTtcclxuICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICBlbGVtZW50LmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLy8gRmlsbGluZyBiYWNrZ3JvdW5kIGNvbG91ciBvZiBDYW52YXNcclxuICBmdW5jdGlvbiBmaWxsQ2FudmFzQmFja2dyb3VuZFdpdGhDb2xvcihjYW52YXMsIGNvbG9yKSB7XHJcbiAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1vdmVyJztcclxuXHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==

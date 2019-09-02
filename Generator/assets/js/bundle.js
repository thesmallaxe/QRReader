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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2R1bGVzL3FyR2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7O0FBRUEsZ0M7QUFDQSxxRDs7QUFFQSxDQUFDLFVBQVUsQ0FBVixFQUFhO0FBQ1osSUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFZO0FBQzVCO0FBQ0QsR0FGRDs7QUFJQTtBQUNBLFdBQVMsS0FBVCxHQUFpQjtBQUNmO0FBQ0Q7QUFDRixDQVRELEVBU0csZ0JBVEg7Ozs7Ozs7OztBQ0ZlLFlBQVk7QUFDekI7QUFDQSxNQUFJLGlCQUFpQjtBQUNuQixZQUFRLHlDQURXO0FBRW5CLGdCQUFZLGlDQUZPO0FBR25CLGlCQUFhLHdDQUhNO0FBSW5CLGVBQVcsaUJBSlE7QUFLbkIsbUJBQWUsNkJBTEk7QUFNbkIsdUJBQW1CLGNBTkE7QUFPbkIsV0FBTyxxQ0FQWSxFQUFyQjs7O0FBVUEsV0FBUyxhQUFULENBQXVCLGNBQXZCO0FBQ0EsTUFBSSxXQUFXLFNBQVMsUUFBVCxFQUFmOztBQUVBO0FBQ0EsTUFBSSxVQUFVLEVBQWQ7O0FBRUEsTUFBTSxhQUFhLElBQUksTUFBTSxzQkFBVixFQUFuQjtBQUNBLE1BQUksbUJBQUo7O0FBRUEsTUFBSSxZQUFZLFNBQVMsY0FBVCxDQUF3QixLQUF4QixDQUFoQjtBQUNFLGFBQVcsU0FBWCxRQUFXLEdBQVk7QUFDckIsUUFBSSxTQUFTLElBQUksVUFBSixFQUFiO0FBQ0EsV0FBTyxNQUFQLEdBQWdCLFlBQVk7QUFDMUIsVUFBTSxnQkFBZ0IsT0FBTyxNQUE3QjtBQUNBLFVBQU0sb0JBQW9CLGNBQWMsS0FBZCxDQUFvQixNQUFwQixDQUExQjtBQUNBLHdCQUFrQixPQUFsQixDQUEwQixlQUFPO0FBQy9CLFlBQUksUUFBUSxJQUFJLEtBQUosQ0FBVSxHQUFWLENBQVo7QUFDQSxnQkFBUSxJQUFS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LENBQXFCLFVBQXJCLEVBQWlDLFFBQWpDO0FBQ0EsWUFBUSxLQUFSLENBQWMsT0FBZCxHQUF3QixNQUF4QjtBQUNBLGFBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsT0FBMUI7QUFDQSxZQUFRLEtBQVI7QUFDQSxhQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLE9BQTFCO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTLDZCQUFULENBQXVDLE1BQXZDLEVBQStDLEtBQS9DLEVBQXNEO0FBQ3BELFFBQU0sVUFBVSxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBaEI7O0FBRUEsWUFBUSxJQUFSO0FBQ0EsWUFBUSx3QkFBUixHQUFtQyxrQkFBbkM7O0FBRUEsWUFBUSxTQUFSLEdBQW9CLEtBQXBCO0FBQ0EsWUFBUSxRQUFSLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLEVBQXVCLE9BQU8sS0FBOUIsRUFBcUMsT0FBTyxNQUE1QztBQUNBLFlBQVEsT0FBUjtBQUNEO0FBQ0YsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQganF1ZXJ5IGZyb20gJ2pxdWVyeSc7XHJcbmltcG9ydCBxckdlbmVyYXRvciBmcm9tICdtb2R1bGVzL3FyR2VuZXJhdG9yLmpzJztcclxuXHJcbihmdW5jdGlvbiAoJCkge1xyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIHJlYWR5KCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIEluaXRhbGl6aW5nIGFsbCBtb2R1bGVzXHJcbiAgZnVuY3Rpb24gcmVhZHkoKSB7XHJcbiAgICBxckdlbmVyYXRvcigpO1xyXG4gIH1cclxufSkoanF1ZXJ5KTtcclxuIiwiLyoqXHJcbiAqIFFSIEdlbmVyYXRvclxyXG4gKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICAvLyEgRmlyZWJhc2UgSW5pdGlhbGlzYXRpb25cclxuICB2YXIgZmlyZWJhc2VDb25maWcgPSB7XHJcbiAgICBhcGlLZXk6IFwiQUl6YVN5QlNFUzgxNTFhVDRUdlVrYWFRVWM4ejZKdF9yS2xIc3M4XCIsXHJcbiAgICBhdXRoRG9tYWluOiBcInFyLXJlYWRlci1lNWRiZS5maXJlYmFzZWFwcC5jb21cIixcclxuICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vcXItcmVhZGVyLWU1ZGJlLmZpcmViYXNlaW8uY29tXCIsXHJcbiAgICBwcm9qZWN0SWQ6IFwicXItcmVhZGVyLWU1ZGJlXCIsXHJcbiAgICBzdG9yYWdlQnVja2V0OiBcInFyLXJlYWRlci1lNWRiZS5hcHBzcG90LmNvbVwiLFxyXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiNTAxNDU5MjExMzA1XCIsXHJcbiAgICBhcHBJZDogXCIxOjUwMTQ1OTIxMTMwNTp3ZWI6NzU3Yjk5M2M1N2ZlOGYyYlwiXHJcbiAgfTtcclxuXHJcbiAgZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XHJcbiAgdmFyIGRhdGFiYXNlID0gZmlyZWJhc2UuZGF0YWJhc2UoKTtcclxuXHJcbiAgLy8hSW1wb3J0aW5nIHRoZSBmaWxlXHJcbiAgdmFyIGludml0ZXMgPSBbXTtcclxuXHJcbiAgY29uc3QgY29kZVdyaXRlciA9IG5ldyBaWGluZy5Ccm93c2VyUVJDb2RlU3ZnV3JpdGVyKCk7XHJcbiAgbGV0IHN2Z0VsZW1lbnQ7XHJcblxyXG4gIGxldCBmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNzdlwiKSxcclxuICAgIHJlYWRGaWxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCB0YWJsZV9kZXRhaWxzID0gcmVhZGVyLnJlc3VsdDtcclxuICAgICAgICBjb25zdCB0YWJsZV9kZXRhaWxzX25ldyA9IHRhYmxlX2RldGFpbHMuc3BsaXQoXCJcXHJcXG5cIik7XHJcbiAgICAgICAgdGFibGVfZGV0YWlsc19uZXcuZm9yRWFjaChyb3cgPT4ge1xyXG4gICAgICAgICAgbGV0IHNwbGl0ID0gcm93LnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgIGludml0ZXMucHVzaCh7XHJcbiAgICAgICAgICAgIGlkOiBzcGxpdFswXSxcclxuICAgICAgICAgICAgbmFtZTogc3BsaXRbMV0sXHJcbiAgICAgICAgICAgIHRpdGxlOiBzcGxpdFsyXSxcclxuICAgICAgICAgICAgY29tcGFueTogc3BsaXRbM10sXHJcbiAgICAgICAgICAgIGltYWdlOiBzcGxpdFs0XVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbG9hZFRhYmxlKGludml0ZXMpO1xyXG4gICAgICB9O1xyXG4gICAgICByZWFkZXIucmVhZEFzQmluYXJ5U3RyaW5nKGZpbGVJbnB1dC5maWxlc1swXSk7XHJcbiAgICB9O1xyXG4gIGZpbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHJlYWRGaWxlKTtcclxuXHJcbiAgJCgnLmJ0bi1nZW5lcmF0ZS1hbGwnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgaW52aXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgaW52aXRlID0gaW52aXRlc1tpXTtcclxuICAgICAgbGV0IGlkID0gXCIjdGFibGUtcm93LXFyLVwiICsgaTtcclxuICAgICAgc3ZnRWxlbWVudCA9IGNvZGVXcml0ZXIud3JpdGVUb0RvbShcclxuICAgICAgICBpZCxcclxuICAgICAgICBKU09OLnN0cmluZ2lmeShpbnZpdGUpLFxyXG4gICAgICAgIDIwMCxcclxuICAgICAgICAyMDBcclxuICAgICAgKTtcclxuICAgICAgd3JpdGVVc2VyRGF0YShpbnZpdGUpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBsb2FkVGFibGUoaW52aXRlcyl7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgaW52aXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgcm93ID0gJChcIiN0ZW1wbGF0ZS1yb3dcIikuY2xvbmUoKS5hcHBlbmRUbyhcIiN0YWJsZVwiKTtcclxuICAgICAgJChyb3cpLmF0dHIoXCJzdHlsZVwiLCBcIlwiKTtcclxuICAgICAgJChyb3cpLmNoaWxkcmVuKFwiLnRhYmxlLXJvdy1pZFwiKS5odG1sKGludml0ZXNbaV0uaWQpO1xyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LW5hbWVcIikuaHRtbChpbnZpdGVzW2ldLm5hbWUpO1xyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LXRpdGxlXCIpLmh0bWwoaW52aXRlc1tpXS50aXRsZSk7XHJcbiAgICAgICQocm93KS5jaGlsZHJlbihcIi50YWJsZS1yb3ctY29tcGFueVwiKS5odG1sKGludml0ZXNbaV0uY29tcGFueSk7XHJcbiAgICAgICQocm93KS5jaGlsZHJlbihcIi50YWJsZS1yb3ctaW1hZ2VcIikuaHRtbChpbnZpdGVzW2ldLmltYWdlKTtcclxuICAgICAgXHJcbiAgICAgICQocm93KS5jaGlsZHJlbihcIi50YWJsZS1yb3ctYnRuXCIpLmNoaWxkcmVuKFwiLmJ0bi1nZW5lcmF0ZVwiKS5yZW1vdmVDbGFzcygnYnRuLWdlbmVyYXRlLWFsbCcpLmh0bWwoJ0dlbmVyYXRlJykuYXR0cihcImRhdGEtaW5kZXhcIiwgaSk7XHJcbiAgICAgICQocm93KS5jaGlsZHJlbihcIi50YWJsZS1yb3ctcXJcIikuYXR0cihcImlkXCIsIFwidGFibGUtcm93LXFyLVwiICsgaSk7XHJcbiAgICAgICQocm93KS5jaGlsZHJlbihcIi50YWJsZS1yb3ctYnRuXCIpLmNoaWxkcmVuKFwiLmJ0bi1zYXZlXCIpLnJlbW92ZUNsYXNzKCdidG4tc2F2ZS1hbGwnKS5odG1sKCdTYXZlJykuYXR0cihcImRhdGEtaW5kZXhcIiwgaSk7XHJcblxyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LWJ0blwiKS5jaGlsZHJlbihcIi5idG4tZ2VuZXJhdGVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCBlbGVtZW50SUQgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLWluZGV4XCIpO1xyXG4gICAgICAgIGxldCBpbnZpdGUgPSBpbnZpdGVzW2VsZW1lbnRJRF07XHJcbiAgICAgICAgbGV0IGlkID0gXCIjdGFibGUtcm93LXFyLVwiICsgZWxlbWVudElEO1xyXG4gICAgICAgIHN2Z0VsZW1lbnQgPSBjb2RlV3JpdGVyLndyaXRlVG9Eb20oXHJcbiAgICAgICAgICBpZCxcclxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGludml0ZSksXHJcbiAgICAgICAgICAyMDAsXHJcbiAgICAgICAgICAyMDBcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIENhbGxpbmcgRmlyZWJhc2UgV3JpdGVcclxuICAgICAgICB3cml0ZVVzZXJEYXRhKGludml0ZSk7ICAgICAgICBcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBTYXZlIGJ1dHRvblxyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LWJ0blwiKS5jaGlsZHJlbihcIi5idG4tc2F2ZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnRJRCA9ICQodGhpcykuYXR0cihcImRhdGEtaW5kZXhcIik7XHJcbiAgICAgICAgY2FudmcoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIiksJChcIiN0YWJsZS1yb3ctcXItXCIgKyBlbGVtZW50SUQpLmh0bWwoKSk7XHJcbiAgICAgICAgLy8gRE9OJ1QgREVMRVRFIFRIRSBDT01NRU5URUQgQ09ERSBCRUxPV1xyXG4gICAgICAgIC8vIGRvY3VtZW50LndyaXRlKCc8aW1nIHNyYz1cIicgKyBpbWcgKyAnXCIvPicpO1xyXG4gICAgICAgIGRvd25sb2FkKGludml0ZXNbZWxlbWVudElEXS5uYW1lICsgXCIucG5nXCIpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFNlbmRpbmcgZGF0YSB0byBGaXJlYmFzZSBEYXRhYmFzZVxyXG4gIGZ1bmN0aW9uIHdyaXRlVXNlckRhdGEoaW52aXRlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhpbnZpdGUpO1xyXG4gICAgZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoXCJhdHRlbmRlZXMvXCIgKyBpbnZpdGUuaWQpLnNldCh7XHJcbiAgICAgIElEOiBpbnZpdGUuaWQsXHJcbiAgICAgIE5hbWU6IGludml0ZS5uYW1lLFxyXG4gICAgICBUaXRsZTogaW52aXRlLnRpdGxlLFxyXG4gICAgICBDb21wYW55OiBpbnZpdGUuY29tcGFueSxcclxuICAgICAgSW1hZ2U6IGludml0ZS5pbWFnZSxcclxuICAgICAgQXR0ZW5kZWQ6IFwiTm9cIlxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkb3dubG9hZChmaWxlbmFtZSkge1xyXG4gICAgLy8gRGVmaW5pbmcgdGhlIGNhbnZhc1xyXG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xyXG4gICAgZmlsbENhbnZhc0JhY2tncm91bmRXaXRoQ29sb3IoY2FudmFzLCAnI2ZmZicpO1xyXG4gICAgdmFyIGltZyA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XHJcblxyXG4gICAgLy8gRG93bmxvYWQgZnVuY3Rpb24gYXMgYW4gaW1hZ2VcclxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBpbWcpO1xyXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xyXG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgIGVsZW1lbnQuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICAvLyBGaWxsaW5nIGJhY2tncm91bmQgY29sb3VyIG9mIENhbnZhc1xyXG4gIGZ1bmN0aW9uIGZpbGxDYW52YXNCYWNrZ3JvdW5kV2l0aENvbG9yKGNhbnZhcywgY29sb3IpIHtcclxuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICBjb250ZXh0LnNhdmUoKTtcclxuICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLW92ZXInO1xyXG5cclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuICB9XHJcbn1cclxuIl19

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
      //Disable the buttons
      $('.btn-generate').prop("disabled", false);
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
    $('.btn-save').prop("disabled", false);
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
        $('.btn-save[data-index="' + elementID + '"]').prop("disabled", false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2R1bGVzL3FyR2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7O0FBRUEsZ0M7QUFDQSxxRDs7QUFFQSxDQUFDLFVBQVUsQ0FBVixFQUFhO0FBQ1osSUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFZO0FBQzVCO0FBQ0QsR0FGRDs7QUFJQTtBQUNBLFdBQVMsS0FBVCxHQUFpQjtBQUNmO0FBQ0Q7QUFDRixDQVRELEVBU0csZ0JBVEg7Ozs7Ozs7OztBQ0ZlLFlBQVk7QUFDekI7QUFDQSxNQUFJLGlCQUFpQjtBQUNuQixZQUFRLHlDQURXO0FBRW5CLGdCQUFZLGlDQUZPO0FBR25CLGlCQUFhLHdDQUhNO0FBSW5CLGVBQVcsaUJBSlE7QUFLbkIsbUJBQWUsNkJBTEk7QUFNbkIsdUJBQW1CLGNBTkE7QUFPbkIsV0FBTyxxQ0FQWSxFQUFyQjs7O0FBVUEsV0FBUyxhQUFULENBQXVCLGNBQXZCO0FBQ0EsTUFBSSxXQUFXLFNBQVMsUUFBVCxFQUFmOztBQUVBO0FBQ0EsTUFBSSxVQUFVLEVBQWQ7O0FBRUEsTUFBTSxhQUFhLElBQUksTUFBTSxzQkFBVixFQUFuQjtBQUNBLE1BQUksbUJBQUo7O0FBRUEsTUFBSSxZQUFZLFNBQVMsY0FBVCxDQUF3QixLQUF4QixDQUFoQjtBQUNFLGFBQVcsU0FBWCxRQUFXLEdBQVk7QUFDckIsUUFBSSxTQUFTLElBQUksVUFBSixFQUFiO0FBQ0EsV0FBTyxNQUFQLEdBQWdCLFlBQVk7QUFDMUIsVUFBTSxnQkFBZ0IsT0FBTyxNQUE3QjtBQUNBLFVBQU0sb0JBQW9CLGNBQWMsS0FBZCxDQUFvQixNQUFwQixDQUExQjtBQUNBLHdCQUFrQixPQUFsQixDQUEwQixlQUFPO0FBQy9CLFlBQUksUUFBUSxJQUFJLEtBQUosQ0FBVSxHQUFWLENBQVo7QUFDQSxnQkFBUSxJQUFSLENBQWE7QUFDWCxjQUFJLE1BQU0sQ0FBTixDQURPO0FBRVgsZ0JBQU0sTUFBTSxDQUFOLENBRks7QUFHWCxpQkFBTyxNQUFNLENBQU4sQ0FISTtBQUlYLG1CQUFTLE1BQU0sQ0FBTixDQUpFO0FBS1gsaUJBQU8sTUFBTSxDQUFOLENBTEksRUFBYjs7QUFPRCxPQVREO0FBVUEsZ0JBQVUsT0FBVjtBQUNBO0FBQ0EsUUFBRSxlQUFGLEVBQW1CLElBQW5CLENBQXdCLFVBQXhCLEVBQW9DLEtBQXBDO0FBQ0QsS0FoQkQ7QUFpQkEsV0FBTyxrQkFBUCxDQUEwQixVQUFVLEtBQVYsQ0FBZ0IsQ0FBaEIsQ0FBMUI7QUFDRCxHQXJCSDtBQXNCQSxZQUFVLGdCQUFWLENBQTJCLFFBQTNCLEVBQXFDLFFBQXJDOztBQUVBLElBQUUsbUJBQUYsRUFBdUIsS0FBdkIsQ0FBNkIsWUFBWTtBQUN2QyxRQUFJLElBQUksQ0FBUjtBQUNBLFNBQUssSUFBSSxDQUFULEVBQVksSUFBSSxRQUFRLE1BQXhCLEVBQWdDLEdBQWhDLEVBQXFDO0FBQ25DLFVBQUksU0FBUyxRQUFRLENBQVIsQ0FBYjtBQUNBLFVBQUksS0FBSyxtQkFBbUIsQ0FBNUI7QUFDQSxtQkFBYSxXQUFXLFVBQVg7QUFDWCxRQURXO0FBRVgsV0FBSyxTQUFMLENBQWUsTUFBZixDQUZXO0FBR1gsU0FIVztBQUlYLFNBSlcsQ0FBYjs7QUFNQSxvQkFBYyxNQUFkO0FBQ0Q7QUFDRCxNQUFFLFdBQUYsRUFBZSxJQUFmLENBQW9CLFVBQXBCLEVBQWdDLEtBQWhDO0FBQ0QsR0FkRDs7QUFnQkEsSUFBRSxlQUFGLEVBQW1CLEtBQW5CLENBQXlCLFlBQVk7QUFDbkMsUUFBSSxJQUFJLENBQVI7QUFDQSxTQUFLLElBQUksQ0FBVCxFQUFZLElBQUksUUFBUSxNQUF4QixFQUFnQyxHQUFoQyxFQUFxQztBQUNuQyxZQUFNLFNBQVMsY0FBVCxDQUF3QixRQUF4QixDQUFOLEVBQXdDLEVBQUUsbUJBQW1CLENBQXJCLEVBQXdCLElBQXhCLEVBQXhDO0FBQ0E7QUFDQTtBQUNBLGVBQVMsUUFBUSxDQUFSLEVBQVcsSUFBWCxHQUFrQixNQUEzQjtBQUNEO0FBQ0YsR0FSRDs7QUFVQSxXQUFTLFNBQVQsQ0FBbUIsT0FBbkIsRUFBMkI7QUFDekIsUUFBSSxJQUFJLENBQVI7QUFDQSxTQUFLLElBQUksQ0FBVCxFQUFZLElBQUksUUFBUSxNQUF4QixFQUFnQyxHQUFoQyxFQUFxQztBQUNuQyxVQUFJLE1BQU0sRUFBRSxlQUFGLEVBQW1CLEtBQW5CLEdBQTJCLFFBQTNCLENBQW9DLFFBQXBDLENBQVY7QUFDQSxRQUFFLEdBQUYsRUFBTyxJQUFQLENBQVksT0FBWixFQUFxQixFQUFyQjtBQUNBLFFBQUUsR0FBRixFQUFPLFFBQVAsQ0FBZ0IsZUFBaEIsRUFBaUMsSUFBakMsQ0FBc0MsUUFBUSxDQUFSLEVBQVcsRUFBakQ7QUFDQSxRQUFFLEdBQUYsRUFBTyxRQUFQLENBQWdCLGlCQUFoQixFQUFtQyxJQUFuQyxDQUF3QyxRQUFRLENBQVIsRUFBVyxJQUFuRDtBQUNBLFFBQUUsR0FBRixFQUFPLFFBQVAsQ0FBZ0Isa0JBQWhCLEVBQW9DLElBQXBDLENBQXlDLFFBQVEsQ0FBUixFQUFXLEtBQXBEO0FBQ0EsUUFBRSxHQUFGLEVBQU8sUUFBUCxDQUFnQixvQkFBaEIsRUFBc0MsSUFBdEMsQ0FBMkMsUUFBUSxDQUFSLEVBQVcsT0FBdEQ7QUFDQSxRQUFFLEdBQUYsRUFBTyxRQUFQLENBQWdCLGtCQUFoQixFQUFvQyxJQUFwQyxDQUF5QyxRQUFRLENBQVIsRUFBVyxLQUFwRDs7QUFFQSxRQUFFLEdBQUYsRUFBTyxRQUFQLENBQWdCLGdCQUFoQixFQUFrQyxRQUFsQyxDQUEyQyxlQUEzQyxFQUE0RCxXQUE1RCxDQUF3RSxrQkFBeEUsRUFBNEYsSUFBNUYsQ0FBaUcsVUFBakcsRUFBNkcsSUFBN0csQ0FBa0gsWUFBbEgsRUFBZ0ksQ0FBaEk7QUFDQSxRQUFFLEdBQUYsRUFBTyxRQUFQLENBQWdCLGVBQWhCLEVBQWlDLElBQWpDLENBQXNDLElBQXRDLEVBQTRDLGtCQUFrQixDQUE5RDtBQUNBLFFBQUUsR0FBRixFQUFPLFFBQVAsQ0FBZ0IsZ0JBQWhCLEVBQWtDLFFBQWxDLENBQTJDLFdBQTNDLEVBQXdELFdBQXhELENBQW9FLGNBQXBFLEVBQW9GLElBQXBGLENBQXlGLE1BQXpGLEVBQWlHLElBQWpHLENBQXNHLFlBQXRHLEVBQW9ILENBQXBIOztBQUVBLFFBQUUsR0FBRixFQUFPLFFBQVAsQ0FBZ0IsZ0JBQWhCLEVBQWtDLFFBQWxDLENBQTJDLGVBQTNDLEVBQTRELEtBQTVELENBQWtFLFlBQVk7QUFDNUUsWUFBSSxZQUFZLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxZQUFiLENBQWhCO0FBQ0EsWUFBSSxTQUFTLFFBQVEsU0FBUixDQUFiO0FBQ0EsWUFBSSxLQUFLLG1CQUFtQixTQUE1QjtBQUNBLHFCQUFhLFdBQVcsVUFBWDtBQUNYLFVBRFc7QUFFWCxhQUFLLFNBQUwsQ0FBZSxNQUFmLENBRlc7QUFHWCxXQUhXO0FBSVgsV0FKVyxDQUFiOztBQU1BO0FBQ0Esc0JBQWMsTUFBZDtBQUNBLFVBQUUsMkJBQXlCLFNBQXpCLEdBQW1DLElBQXJDLEVBQTJDLElBQTNDLENBQWdELFVBQWhELEVBQTRELEtBQTVEO0FBQ0QsT0FiRDs7QUFlQTtBQUNBLFFBQUUsR0FBRixFQUFPLFFBQVAsQ0FBZ0IsZ0JBQWhCLEVBQWtDLFFBQWxDLENBQTJDLFdBQTNDLEVBQXdELEtBQXhELENBQThELFlBQVk7QUFDeEUsWUFBSSxZQUFZLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxZQUFiLENBQWhCO0FBQ0EsY0FBTSxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBTixFQUF3QyxFQUFFLG1CQUFtQixTQUFyQixFQUFnQyxJQUFoQyxFQUF4QztBQUNBO0FBQ0E7QUFDQSxpQkFBUyxRQUFRLFNBQVIsRUFBbUIsSUFBbkIsR0FBMEIsTUFBbkM7QUFDRCxPQU5EO0FBT0Q7QUFDRjs7QUFFRDtBQUNBLFdBQVMsYUFBVCxDQUF1QixNQUF2QixFQUErQjtBQUM3QixZQUFRLEdBQVIsQ0FBWSxNQUFaO0FBQ0EsYUFBUyxRQUFULEdBQW9CLEdBQXBCLENBQXdCLGVBQWUsT0FBTyxFQUE5QyxFQUFrRCxHQUFsRCxDQUFzRDtBQUNwRCxVQUFJLE9BQU8sRUFEeUM7QUFFcEQsWUFBTSxPQUFPLElBRnVDO0FBR3BELGFBQU8sT0FBTyxLQUhzQztBQUlwRCxlQUFTLE9BQU8sT0FKb0M7QUFLcEQsYUFBTyxPQUFPLEtBTHNDO0FBTXBELGdCQUFVLElBTjBDLEVBQXREOztBQVFEOztBQUVELFdBQVMsUUFBVCxDQUFrQixRQUFsQixFQUE0QjtBQUMxQjtBQUNBLFFBQUksU0FBUyxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBYjtBQUNBLGtDQUE4QixNQUE5QixFQUFzQyxNQUF0QztBQUNBLFFBQUksTUFBTSxPQUFPLFNBQVAsQ0FBaUIsV0FBakIsQ0FBVjs7QUFFQTtBQUNBLFFBQUksVUFBVSxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBZDtBQUNBLFlBQVEsWUFBUixDQUFxQixNQUFyQixFQUE2QixHQUE3QjtBQUNBLFlBQVEsWUFBUixDQUFxQixVQUFyQixFQUFpQyxRQUFqQztBQUNBLFlBQVEsS0FBUixDQUFjLE9BQWQsR0FBd0IsTUFBeEI7QUFDQSxhQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLE9BQTFCO0FBQ0EsWUFBUSxLQUFSO0FBQ0EsYUFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixPQUExQjtBQUNEOztBQUVEO0FBQ0EsV0FBUyw2QkFBVCxDQUF1QyxNQUF2QyxFQUErQyxLQUEvQyxFQUFzRDtBQUNwRCxRQUFNLFVBQVUsT0FBTyxVQUFQLENBQWtCLElBQWxCLENBQWhCOztBQUVBLFlBQVEsSUFBUjtBQUNBLFlBQVEsd0JBQVIsR0FBbUMsa0JBQW5DOztBQUVBLFlBQVEsU0FBUixHQUFvQixLQUFwQjtBQUNBLFlBQVEsUUFBUixDQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QixPQUFPLEtBQTlCLEVBQXFDLE9BQU8sTUFBNUM7QUFDQSxZQUFRLE9BQVI7QUFDRDtBQUNGLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IGpxdWVyeSBmcm9tICdqcXVlcnknO1xyXG5pbXBvcnQgcXJHZW5lcmF0b3IgZnJvbSAnbW9kdWxlcy9xckdlbmVyYXRvci5qcyc7XHJcblxyXG4oZnVuY3Rpb24gKCQpIHtcclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICByZWFkeSgpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBJbml0YWxpemluZyBhbGwgbW9kdWxlc1xyXG4gIGZ1bmN0aW9uIHJlYWR5KCkge1xyXG4gICAgcXJHZW5lcmF0b3IoKTtcclxuICB9XHJcbn0pKGpxdWVyeSk7XHJcbiIsIi8qKlxyXG4gKiBRUiBHZW5lcmF0b3JcclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgLy8hIEZpcmViYXNlIEluaXRpYWxpc2F0aW9uXHJcbiAgdmFyIGZpcmViYXNlQ29uZmlnID0ge1xyXG4gICAgYXBpS2V5OiBcIkFJemFTeUJTRVM4MTUxYVQ0VHZVa2FhUVVjOHo2SnRfcktsSHNzOFwiLFxyXG4gICAgYXV0aERvbWFpbjogXCJxci1yZWFkZXItZTVkYmUuZmlyZWJhc2VhcHAuY29tXCIsXHJcbiAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL3FyLXJlYWRlci1lNWRiZS5maXJlYmFzZWlvLmNvbVwiLFxyXG4gICAgcHJvamVjdElkOiBcInFyLXJlYWRlci1lNWRiZVwiLFxyXG4gICAgc3RvcmFnZUJ1Y2tldDogXCJxci1yZWFkZXItZTVkYmUuYXBwc3BvdC5jb21cIixcclxuICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjUwMTQ1OTIxMTMwNVwiLFxyXG4gICAgYXBwSWQ6IFwiMTo1MDE0NTkyMTEzMDU6d2ViOjc1N2I5OTNjNTdmZThmMmJcIlxyXG4gIH07XHJcblxyXG4gIGZpcmViYXNlLmluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xyXG4gIHZhciBkYXRhYmFzZSA9IGZpcmViYXNlLmRhdGFiYXNlKCk7XHJcblxyXG4gIC8vIUltcG9ydGluZyB0aGUgZmlsZVxyXG4gIHZhciBpbnZpdGVzID0gW107XHJcblxyXG4gIGNvbnN0IGNvZGVXcml0ZXIgPSBuZXcgWlhpbmcuQnJvd3NlclFSQ29kZVN2Z1dyaXRlcigpO1xyXG4gIGxldCBzdmdFbGVtZW50O1xyXG5cclxuICBsZXQgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjc3ZcIiksXHJcbiAgICByZWFkRmlsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgdGFibGVfZGV0YWlscyA9IHJlYWRlci5yZXN1bHQ7XHJcbiAgICAgICAgY29uc3QgdGFibGVfZGV0YWlsc19uZXcgPSB0YWJsZV9kZXRhaWxzLnNwbGl0KFwiXFxyXFxuXCIpO1xyXG4gICAgICAgIHRhYmxlX2RldGFpbHNfbmV3LmZvckVhY2gocm93ID0+IHtcclxuICAgICAgICAgIGxldCBzcGxpdCA9IHJvdy5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICBpbnZpdGVzLnB1c2goe1xyXG4gICAgICAgICAgICBpZDogc3BsaXRbMF0sXHJcbiAgICAgICAgICAgIG5hbWU6IHNwbGl0WzFdLFxyXG4gICAgICAgICAgICB0aXRsZTogc3BsaXRbMl0sXHJcbiAgICAgICAgICAgIGNvbXBhbnk6IHNwbGl0WzNdLFxyXG4gICAgICAgICAgICBpbWFnZTogc3BsaXRbNF1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxvYWRUYWJsZShpbnZpdGVzKTtcclxuICAgICAgICAvL0Rpc2FibGUgdGhlIGJ1dHRvbnNcclxuICAgICAgICAkKCcuYnRuLWdlbmVyYXRlJykucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcclxuICAgICAgfTtcclxuICAgICAgcmVhZGVyLnJlYWRBc0JpbmFyeVN0cmluZyhmaWxlSW5wdXQuZmlsZXNbMF0pO1xyXG4gICAgfTtcclxuICBmaWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCByZWFkRmlsZSk7XHJcblxyXG4gICQoJy5idG4tZ2VuZXJhdGUtYWxsJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGludml0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IGludml0ZSA9IGludml0ZXNbaV07XHJcbiAgICAgIGxldCBpZCA9IFwiI3RhYmxlLXJvdy1xci1cIiArIGk7XHJcbiAgICAgIHN2Z0VsZW1lbnQgPSBjb2RlV3JpdGVyLndyaXRlVG9Eb20oXHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoaW52aXRlKSxcclxuICAgICAgICAyMDAsXHJcbiAgICAgICAgMjAwXHJcbiAgICAgICk7XHJcbiAgICAgIHdyaXRlVXNlckRhdGEoaW52aXRlKTtcclxuICAgIH1cclxuICAgICQoJy5idG4tc2F2ZScpLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XHJcbiAgfSk7XHJcblxyXG4gICQoJy5idG4tc2F2ZS1hbGwnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgaW52aXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjYW52Zyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKSwkKFwiI3RhYmxlLXJvdy1xci1cIiArIGkpLmh0bWwoKSk7XHJcbiAgICAgIC8vIERPTidUIERFTEVURSBUSEUgQ09NTUVOVEVEIENPREUgQkVMT1dcclxuICAgICAgLy8gZG9jdW1lbnQud3JpdGUoJzxpbWcgc3JjPVwiJyArIGltZyArICdcIi8+Jyk7XHJcbiAgICAgIGRvd25sb2FkKGludml0ZXNbaV0ubmFtZSArIFwiLnBuZ1wiKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gbG9hZFRhYmxlKGludml0ZXMpe1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGludml0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IHJvdyA9ICQoXCIjdGVtcGxhdGUtcm93XCIpLmNsb25lKCkuYXBwZW5kVG8oXCIjdGFibGVcIik7XHJcbiAgICAgICQocm93KS5hdHRyKFwic3R5bGVcIiwgXCJcIik7XHJcbiAgICAgICQocm93KS5jaGlsZHJlbihcIi50YWJsZS1yb3ctaWRcIikuaHRtbChpbnZpdGVzW2ldLmlkKTtcclxuICAgICAgJChyb3cpLmNoaWxkcmVuKFwiLnRhYmxlLXJvdy1uYW1lXCIpLmh0bWwoaW52aXRlc1tpXS5uYW1lKTtcclxuICAgICAgJChyb3cpLmNoaWxkcmVuKFwiLnRhYmxlLXJvdy10aXRsZVwiKS5odG1sKGludml0ZXNbaV0udGl0bGUpO1xyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LWNvbXBhbnlcIikuaHRtbChpbnZpdGVzW2ldLmNvbXBhbnkpO1xyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LWltYWdlXCIpLmh0bWwoaW52aXRlc1tpXS5pbWFnZSk7XHJcbiAgICAgIFxyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LWJ0blwiKS5jaGlsZHJlbihcIi5idG4tZ2VuZXJhdGVcIikucmVtb3ZlQ2xhc3MoJ2J0bi1nZW5lcmF0ZS1hbGwnKS5odG1sKCdHZW5lcmF0ZScpLmF0dHIoXCJkYXRhLWluZGV4XCIsIGkpO1xyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LXFyXCIpLmF0dHIoXCJpZFwiLCBcInRhYmxlLXJvdy1xci1cIiArIGkpO1xyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LWJ0blwiKS5jaGlsZHJlbihcIi5idG4tc2F2ZVwiKS5yZW1vdmVDbGFzcygnYnRuLXNhdmUtYWxsJykuaHRtbCgnU2F2ZScpLmF0dHIoXCJkYXRhLWluZGV4XCIsIGkpO1xyXG5cclxuICAgICAgJChyb3cpLmNoaWxkcmVuKFwiLnRhYmxlLXJvdy1idG5cIikuY2hpbGRyZW4oXCIuYnRuLWdlbmVyYXRlXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgZWxlbWVudElEID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1pbmRleFwiKTtcclxuICAgICAgICBsZXQgaW52aXRlID0gaW52aXRlc1tlbGVtZW50SURdO1xyXG4gICAgICAgIGxldCBpZCA9IFwiI3RhYmxlLXJvdy1xci1cIiArIGVsZW1lbnRJRDtcclxuICAgICAgICBzdmdFbGVtZW50ID0gY29kZVdyaXRlci53cml0ZVRvRG9tKFxyXG4gICAgICAgICAgaWQsXHJcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeShpbnZpdGUpLFxyXG4gICAgICAgICAgMjAwLFxyXG4gICAgICAgICAgMjAwXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBDYWxsaW5nIEZpcmViYXNlIFdyaXRlXHJcbiAgICAgICAgd3JpdGVVc2VyRGF0YShpbnZpdGUpOyBcclxuICAgICAgICAkKCcuYnRuLXNhdmVbZGF0YS1pbmRleD1cIicrZWxlbWVudElEKydcIl0nKS5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpOyAgICAgICBcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBTYXZlIGJ1dHRvblxyXG4gICAgICAkKHJvdykuY2hpbGRyZW4oXCIudGFibGUtcm93LWJ0blwiKS5jaGlsZHJlbihcIi5idG4tc2F2ZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnRJRCA9ICQodGhpcykuYXR0cihcImRhdGEtaW5kZXhcIik7XHJcbiAgICAgICAgY2FudmcoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIiksJChcIiN0YWJsZS1yb3ctcXItXCIgKyBlbGVtZW50SUQpLmh0bWwoKSk7XHJcbiAgICAgICAgLy8gRE9OJ1QgREVMRVRFIFRIRSBDT01NRU5URUQgQ09ERSBCRUxPV1xyXG4gICAgICAgIC8vIGRvY3VtZW50LndyaXRlKCc8aW1nIHNyYz1cIicgKyBpbWcgKyAnXCIvPicpO1xyXG4gICAgICAgIGRvd25sb2FkKGludml0ZXNbZWxlbWVudElEXS5uYW1lICsgXCIucG5nXCIpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFNlbmRpbmcgZGF0YSB0byBGaXJlYmFzZSBEYXRhYmFzZVxyXG4gIGZ1bmN0aW9uIHdyaXRlVXNlckRhdGEoaW52aXRlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhpbnZpdGUpO1xyXG4gICAgZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoXCJhdHRlbmRlZXMvXCIgKyBpbnZpdGUuaWQpLnNldCh7XHJcbiAgICAgIElEOiBpbnZpdGUuaWQsXHJcbiAgICAgIE5hbWU6IGludml0ZS5uYW1lLFxyXG4gICAgICBUaXRsZTogaW52aXRlLnRpdGxlLFxyXG4gICAgICBDb21wYW55OiBpbnZpdGUuY29tcGFueSxcclxuICAgICAgSW1hZ2U6IGludml0ZS5pbWFnZSxcclxuICAgICAgQXR0ZW5kZWQ6IFwiTm9cIlxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkb3dubG9hZChmaWxlbmFtZSkge1xyXG4gICAgLy8gRGVmaW5pbmcgdGhlIGNhbnZhc1xyXG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xyXG4gICAgZmlsbENhbnZhc0JhY2tncm91bmRXaXRoQ29sb3IoY2FudmFzLCAnI2ZmZicpO1xyXG4gICAgdmFyIGltZyA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XHJcblxyXG4gICAgLy8gRG93bmxvYWQgZnVuY3Rpb24gYXMgYW4gaW1hZ2VcclxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBpbWcpO1xyXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xyXG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgIGVsZW1lbnQuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICAvLyBGaWxsaW5nIGJhY2tncm91bmQgY29sb3VyIG9mIENhbnZhc1xyXG4gIGZ1bmN0aW9uIGZpbGxDYW52YXNCYWNrZ3JvdW5kV2l0aENvbG9yKGNhbnZhcywgY29sb3IpIHtcclxuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICBjb250ZXh0LnNhdmUoKTtcclxuICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLW92ZXInO1xyXG5cclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuICB9XHJcbn1cclxuIl19

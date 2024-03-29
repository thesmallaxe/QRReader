//! Init Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBSES8151aT4TvUkaaQUc8z6Jt_rKlHss8",
  authDomain: "qr-reader-e5dbe.firebaseapp.com",
  databaseURL: "https://qr-reader-e5dbe.firebaseio.com",
  projectId: "qr-reader-e5dbe",
  storageBucket: "qr-reader-e5dbe.appspot.com",
  messagingSenderId: "501459211305",
  appId: "1:501459211305:web:757b993c57fe8f2b"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

//!Importing the file
var invites = [];

const codeWriter = new ZXing.BrowserQRCodeSvgWriter();
let svgElement;

let fileInput = document.getElementById("csv"),
  readFile = function () {
    let reader = new FileReader();
    reader.onload = function () {
      const table_details = reader.result;
      const table_details_new = table_details.split("\r\n");
      table_details_new.forEach(row => {
        let split = row.split(",");
        invites.push({
          id: split[0],
          name: split[1],
          title: split[2],
          company: split[3]
        });
      });
      console.log(invites);
      // console.log(JSON.stringify(invites[0]));

      function fillCanvasBackgroundWithColor(canvas, color) { //! CHANGES COLOR
        // Get the 2D drawing context from the provided canvas.
        const context = canvas.getContext('2d');

        // We're going to modify the context state, so it's
        // good practice to save the current state first.
        context.save();
        context.globalCompositeOperation = 'destination-over';

        // Fill in the background. We do this by drawing a rectangle
        // filling the entire canvas, using the provided color.
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Restore the original context state from `context.save()`
        context.restore();
      }

      for (i = 0; i < invites.length; i++) {
        let row = $("#template-row")
          .clone()
          .appendTo("#table");
        $(row).attr("style", "");
        $(row)
          .children(".table-row-id")
          .html(invites[i].id);
        $(row)
          .children(".table-row-name")
          .html(invites[i].name);
        $(row)
          .children(".table-row-title")
          .html(invites[i].title);
        $(row)
          .children(".table-row-company")
          .html(invites[i].company);
        $(row)
          .children(".table-row-btn")
          .children(".btn-generate")
          .attr("data-index", i);
        $(row)
          .children(".table-row-qr")
          .attr("id", "table-row-qr-" + i);

        $(row)
          .children(".table-row-btn")
          .children(".btn-generate")
          .click(function () {
            let i = $(this).attr("data-index");
            let invite = invites[i];
            let id = "#table-row-qr-" + i;
            svgElement = codeWriter.writeToDom(
              id,
              JSON.stringify(invite),
              200,
              200
            );

            function writeUserData() {
              firebase.database().ref("attendees/").push({
                ID: invites[i].id,
                Name: invites[i].name,
                Title: invites[i].title,
                Company: invites[i].company,
                Attended: "No"
              });
            }

            writeUserData();

            $(row)
              .children(".table-row-btn")
              .children(".btn-save")
              .click(function () {
                console.log($("#table-row-qr-" + i).html());
                canvg(
                  document.getElementById("canvas"),
                  $("#table-row-qr-" + i).html()
                );

                var canvas = document.getElementById("canvas");
                fillCanvasBackgroundWithColor(canvas, '#fff'); //! IMPORTANT - changes color
                var img = canvas.toDataURL("image/png");
                document.write('<img src="' + img + '"/>');
              });
          });
      }
    };
    reader.readAsBinaryString(fileInput.files[0]);
  };

fileInput.addEventListener("change", readFile);
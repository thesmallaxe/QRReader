/**
 * QR Generator
 */

export default function () {
  //! Firebase Initialisation
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
            company: split[3],
            image: split[4]
          });
        });
        loadTable(invites);
      };
      reader.readAsBinaryString(fileInput.files[0]);
    };
  fileInput.addEventListener("change", readFile);

  $('.btn-generate-all').click(function () {
    var i = 0;
    for (i = 0; i < invites.length; i++) {
      let invite = invites[i];
      let id = "#table-row-qr-" + i;
      svgElement = codeWriter.writeToDom(
        id,
        JSON.stringify(invite),
        200,
        200
      );
      writeUserData(invite);
    }
  });

  function loadTable(invites){
    var i = 0;
    for (i = 0; i < invites.length; i++) {
      let row = $("#template-row").clone().appendTo("#table");
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
        let elementID = $(this).attr("data-index");
        let invite = invites[elementID];
        let id = "#table-row-qr-" + elementID;
        svgElement = codeWriter.writeToDom(
          id,
          JSON.stringify(invite),
          200,
          200
        );
        // Calling Firebase Write
        writeUserData(invite);        
      });

      // Save button
      $(row).children(".table-row-btn").children(".btn-save").click(function () {
        let elementID = $(this).attr("data-index");
        canvg(document.getElementById("canvas"),$("#table-row-qr-" + elementID).html());
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
      Attended: "No"
    });
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
    const context = canvas.getContext('2d');

    context.save();
    context.globalCompositeOperation = 'destination-over';

    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }
}

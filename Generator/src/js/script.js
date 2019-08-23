//!Importing the file
var invites = [];

const codeWriter = new ZXing.BrowserQRCodeSvgWriter();
let svgElement;

let fileInput = document.getElementById("csv"),
  readFile = function() {
    let reader = new FileReader();
    reader.onload = function() {
      const table_details = reader.result;
      const table_details_new = table_details.split("\r\n");
      table_details_new.forEach(row => {
        let split = row.split(",");
        invites.push({
          id: split[0],
          name: split[1]
        });
      });
      console.log(invites);
      // console.log(JSON.stringify(invites[0]));

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
          .children(".table-row-btn")
          .children(".btn-generate")
          .attr("data-index", i);
        $(row)
          .children(".table-row-qr")
          .attr("id", "table-row-qr-" + i);

        $(row)
          .children(".table-row-btn")
          .children(".btn-generate")
          .click(function() {
            let i = $(this).attr("data-index");
            let invite = invites[i];
            let id = "#table-row-qr-" + i;
            svgElement = codeWriter.writeToDom(
              id,
              JSON.stringify(invite),
              200,
              200
            );

            $(row)
              .children(".table-row-btn")
              .children(".btn-save")
              .click(function() {
                console.log($("#table-row-qr-" + i).html());
                canvg(
                  document.getElementById("canvas"),
                  $("#table-row-qr-" + i).html()
                );

                var canvas = document.getElementById("canvas");
                var img = canvas.toDataURL("image/png");
                document.write('<img src="' + img + '"/>');
              });
          });
      }
    };
    reader.readAsBinaryString(fileInput.files[0]);
  };

fileInput.addEventListener("change", readFile);

//!Saving the QR code
// document.getElementById("saveButton").addEventListener("click", () => {
//   html2canvas(document.querySelector("#result")).then(canvas => {
//     document.body.appendChild(canvas);

//     let img = canvas.toDataURL("image/png");

//     document.write("<img id='img' src='" + img + "'/>");
//   });
// });

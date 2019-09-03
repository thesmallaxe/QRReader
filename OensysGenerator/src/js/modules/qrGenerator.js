/**
 * QR Generator
 */

export default function () {
  let firebaseConfig = {
    apiKey: "AIzaSyAX0g-faZYiULDy_QiLMBxaigNBB85VAPI",
    authDomain: "reception-management.firebaseapp.com",
    databaseURL: "https://reception-management.firebaseio.com",
    projectId: "reception-management",
    storageBucket: "reception-management.appspot.com",
    messagingSenderId: "192413503859",
    appId: "1:192413503859:web:c8f9e78f7000d4ea"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

  const codeWriter = new ZXing.BrowserQRCodeSvgWriter();
  let svgElement;

  // Form elements
  let visitorID = 'v' + Math.random().toString(36).substr(2, 6);
  let name = $('#name').val();
  let contact = $('#contact').val();
  let nic = $('#nic').val();
  let email = $('#email').val();
  let vehicleNo = $('#vehicle-no').val();

  // Sending data to Firebase Database
  function writeUserData(visitorID, name, contact, nic, email, vehicleNo) {
    firebase.database().ref("visitors/" + visitorID).set({
      ID: visitorID,
      Name: name,
      Contact: contact,
      NIC: nic,
      Email: email,
      Vehicle: vehicleNo,
    });
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

  // Function write QR
  function writeQR() {
    // Calling Firebase Write
    writeUserData(visitorID, name, contact, nic, email, vehicleNo);

    // Write QR
    svgElement = codeWriter.writeToDom(
      '#result',
      JSON.stringify(visitorID, name, contact, nic, email, vehicleNo),
      250,
      250
    );
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
      }
      else {
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
  let submitBtn = $('#submitBtn');

  submitBtn.click(function (e) {
    e.preventDefault();

    // Call validate function
    validate();

    // Call download function
    save_as_svg();
  });
}

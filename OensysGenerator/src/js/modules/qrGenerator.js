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
  function generateQR(visitorID, name, contact, nic, email, vehicleNo) {
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
    } 
    return isFormValid;
  }

  function downloadQR(filename){
    canvg(document.getElementById("canvas"),$("#result").html());
    
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
  let submitBtn = $('#submitBtn');

  submitBtn.click(function (e) {
    e.preventDefault();
    //Defining form elements
    let visitorID = 'v' + Math.random().toString(36).substr(2, 6);
    let name = $('#name').val();
    let contact = $('#contact').val();
    let nic = $('#nic').val();
    let email = $('#email').val();
    let vehicleNo = $('#vehicle-no').val();
    // Call validate function
    if(validate()){
      generateQR(visitorID);
      downloadQR(name);
    }
  });
}

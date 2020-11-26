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
      Visited: "No"
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
      visitorID,
      250,
      250
    );
  }

  /* Form validation */
  // Focus Input
  $('.data-form__form input').each(function () {
    $(this).on('blur', function () {
      if ($(this).val().trim() != "") {
        $(this).addClass('has-val');
      }
      else {
        $(this).removeClass('has-val');
      }
    });
  });

  // Validate
  var input = $('.validate-input input');

  $('.data-form__form').submit(function (e) {
    e.preventDefault();

    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    return check;
  });


  $('.data-form__form input').each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
      if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        return false;
      }
    }
    else {
      if ($(input).val().trim() == '') {
        return false;
      }
    }
  }

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
  }

  // Download QR function
  function downloadQR(filename) {
    canvg(document.getElementById("canvas"), $("#result").html());

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

  // Validate
  var input = $('.validate-input input');

  $('.data-form__form').submit(function (e) {
    e.preventDefault();

    //Defining form elements
    let visitorID = 'v' + Math.random().toString(36).substr(2, 6);
    let name = $('#name').val();
    let contact = $('#contact').val();
    let nic = $('#nic').val();
    let email = $('#email').val();
    let vehicleNo = $('#vehicle-no').val();

    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    if (check) {
      generateQR(visitorID, name, contact, nic, email, vehicleNo);
      downloadQR(name);
    }

    return check;
  });
}

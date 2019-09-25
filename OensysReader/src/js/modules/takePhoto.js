/**
 * Take photos from the Camera
 */

export default function () {
  // Database Setup
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
  let database = firebase.database();
  // let filesRef = storageRef.child('photos/' + this.ID + '.jpg');

  // Grab elements, create settings, etc.
  let photoCanvas = document.getElementById('canvas');
  let context = photoCanvas.getContext('2d');
  let video = document.getElementById('video');
  let mediaConfig = { video: true };
  let errBack = function (e) {
    console.log('An error has occurred!', e)
  };
  let videoWidth = 640;
  let videoHeight = 480;

  // Retrieve Data
  var ref = database.ref('visitors');
  ref.on('value', gotData, errData);

  function gotData(data) {
    console.log(data.val());
  }

  function errData(err) {
    console.log('Error!');
    console.log(err);
  }

  // Put video listeners into place
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(mediaConfig).then(function (stream) {
      // video.src = window.URL.createObjectURL(stream);
      video.srcObject = stream;
      video.play();
    });
  }

  /* Legacy code below! */
  else if (navigator.getUserMedia) { // Standard
    navigator.getUserMedia(mediaConfig, function (stream) {
      video.src = stream;
      video.play();
    }, errBack);
  } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(mediaConfig, function (stream) {
      video.src = window.webkitURL.createObjectURL(stream);
      video.play();
    }, errBack);
  } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
    navigator.mozGetUserMedia(mediaConfig, function (stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  }

  // Has class function
  function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  // Trigger photo take
  document.getElementById('snap').addEventListener('click', function () {
    let video = document.getElementById('video');
    let photoCanvas = document.getElementById('canvas');
    let snapButton = document.getElementById('snap');

    context.drawImage(video, 0, 0, videoWidth, videoHeight);
    let image = photoCanvas.toDataURL('image/jpeg', 0.65);

    if (!snapButton.classList.contains('active')) {
      video.className = 'fadeOut';
      photoCanvas.className = 'fadeIn';
      snapButton.classList = 'btn-submit btn--small active';
      snapButton.textContent = "Retake Photo";
    } else {
      video.className = 'fadeIn';
      photoCanvas.className = 'fadeOut';
      snapButton.classList = 'btn-submit btn--small';
      snapButton.textContent = "Take Photo";
    }
  });

  document.getElementById('proceed').addEventListener('click', function () {
    // Write or Update Data
    let visitorID = sessionStorage.getItem("visitorID");
    let photoCanvas = document.getElementById('canvas');
    let image = photoCanvas.toDataURL('image/jpeg', 0.65);

    firebase.database().ref('/visitors/' + visitorID).once('value').then(function (snapshot) {

      let visitorData = snapshot.val();

      console.log(visitorData);

      visitorData.profilePicture = image;

      firebase.database().ref("visitors/" + visitorID).set(visitorData, function (error) {
        if (error) {
          console.log('Not done');
        } else {
          console.log('done');
        }
      });
    });
  });
}
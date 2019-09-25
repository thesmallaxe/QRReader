/**
 * Preview Visitor Information
 */

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
  const codeWriter = new ZXing.BrowserQRCodeSvgWriter();
  let visitorID =sessionStorage.getItem("visitorID");
  
  firebase
    .database()
    .ref("/visitors/" + visitorID)
    .once("value")
    .then(function(snapshot) {
      let visitorData = snapshot.val();
      $("#name").text(` : ${visitorData.Name}`);
      $("#contact").text(` : ${visitorData.Contact}`);
      $("#nic").text(` : ${visitorData.NIC}`);
      $("#email").text(` : ${visitorData.Email}`);
      $("#vehicle-no").text(` : ${visitorData.Vehicle}`);
      $("#visitorImage").attr("src", visitorData.profilePicture);
      svgElement = codeWriter.writeToDom(
        '#result',
        visitorID,
        100,
        100
      );
     //window.print();
    });
  
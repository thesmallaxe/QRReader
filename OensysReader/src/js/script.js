window.addEventListener("load", () => {

  //! Firebase Initialization
  var firebaseConfig = {
    apiKey: "AIzaSyAX0g-faZYiULDy_QiLMBxaigNBB85VAPI",
    authDomain: "reception-management.firebaseapp.com",
    databaseURL: "https://reception-management.firebaseio.com",
    projectId: "reception-management",
    storageBucket: "reception-management.appspot.com",
    messagingSenderId: "192413503859",
    appId: "1:192413503859:web:c8f9e78f7000d4ea"
  };

  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

  var visitorsCount = 0;
  var visitedCount = 0;

  let selectedDeviceId;
  const codeReader = new ZXing.BrowserMultiFormatReader();
  codeReader
    .getVideoInputDevices()
    .then(videoInputDevices => {
      const souceSelect = $("#sourceSelect");
      selectedDeviceId = videoInputDevices[0].deviceId;

      if (videoInputDevices.length >= 1) {
        videoInputDevices.forEach(element => {
          const sourceOption = document.createElement("option");
          sourceOption.text = element.label;
          sourceOption.value = element.deviceId;
          sourceSelect.appendChild(sourceOption);
        });

        sourceSelect.onchange = () => {
          selectedDeviceId = sourceSelect.value;
        };

        const sourceSelectPanel = document.getElementById("sourceSelectPanel");
        sourceSelectPanel.style.display = "block";
      }

      database.ref().on("child_added", function (snapshot) {
        visitorsCount = snapshot.numChildren();
        updateCounts();
      });

      database.ref("visitors").orderByChild("Visited").equalTo("Yes").on("child_added", function (snapshot) {
        visitedCount++;
        updateCounts();
      });

      function updateCounts() {
        $("#attendees-attending").html(visitorsCount);
        $("#attendees-attended").html(visitedCount);
      }

      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        "video",
        (result, err) => {
          if (result) {
            console.log(result);
            document.getElementById("result").textContent = result.text;

            sessionStorage.setItem("visitorID", result.text);

            let visitorID = result.text;

            if (typeof visitorID !== 'undefined') {

              $(".qr-video-reader").slideUp(800);
              $(".header-scan").slideUp(800);
              $(".header-visitor").delay(800).slideDown();
              $(".data-form").delay(800).slideDown();

              firebase.database().ref('/visitors/' + visitorID).once('value').then(function (snapshot) {

                //console.log(snapshot.val());
                let visitorData = snapshot.val();

                $("#name").val(visitorData.Name);
                $("#contact").val(visitorData.Contact);
                $("#nic").val(visitorData.NIC);
                $("#email").val(visitorData.Email);
                $("#vehicle-no").val(visitorData.Vehicle);

                var updates = {};
                updates["visitors/" + visitorID + "/" + "Visited"] = "Yes"

                return firebase.database().ref().update(updates);

              });
            }
          }

          if (err && !(err instanceof ZXing.NotFoundException)) {
            //console.error(err);
            // $("result").textContent = err;
          }
        }
      );

      console.log(
        `Started continous decode from camera with id ${selectedDeviceId}`
      );
    });
})

window.addEventListener("load", () => {

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

  var attendeeCount = 0;
  var attendedCount = 0;

  let selectedDeviceId;
  const codeReader = new ZXing.BrowserMultiFormatReader();
  codeReader
    .getVideoInputDevices()
    .then(videoInputDevices => {
      const souceSelect = document.getElementById("sourceSelect");
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
        attendeeCount = snapshot.numChildren();
        updateCounts();
      });

      database.ref("attendees").orderByChild("Attended").equalTo("Yes").on("child_added", function (snapshot) {
        attendedCount++;
        updateCounts();
      });

      function updateCounts() {
        $("#attendees-attending").html(attendeeCount);
        $("#attendees-attended").html(attendedCount);
      }

      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        "video",
        (result, err) => {
          if (result) {
            document.getElementById("result").textContent = result.text;
            let content = JSON.parse(result.text)
            let attendeeID = content.id;
            console.log(attendeeID);

            document.getElementById("name").textContent = content.name;
            document.getElementById("title").textContent = content.title;
            document.getElementById("company").textContent = content.company;
            // document.getElementsByClassName("user__img-image")[0].style.background = content.image;

            if (!content.image) {
              document.getElementById("user-image-base").style.display = 'none';
            } else {
              document.getElementById("user-image-base").style.display = 'block';
              document.getElementById("user-image").style.backgroundImage = 'url(' + content.image + ')';
            }

            var updates = {};
            updates["attendees/" + attendeeID + "/" + "Attended"] = "Yes"

            return firebase.database().ref().update(updates);
          }

          if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err);
            document.getElementById("result").textContent = err;
          }
        }
      );

      console.log(
        `Started continous decode from camera with id ${selectedDeviceId}`
      );
    });
})

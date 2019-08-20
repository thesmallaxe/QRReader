window.addEventListener("load", () => {
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserMultiFormatReader();
  console.log("ZXing code reader initialized");
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

      document.getElementById("b_start").addEventListener("click", () => {
        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          "video",
          (result, err) => {
            if (result) {
              console.log(result);
              document.getElementById("result").textContent = result.text;
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

      document.getElementById("b_stop").addEventListener("click", () => {
        codeReader.reset();
        document.getElementById("result").textContent = "";
        console.log("Stream Stopped");
      });
    })

    .catch(err => {
      console.error(err);
    });
});

const showImg = document.getElementById("image_show");
const message = document.getElementById("result-text");

document.getElementById("imageInput").addEventListener("change", async function (event) {
  const fileInput = event.target;

  if (fileInput.files.length > 0) {
    const selectedFile = fileInput.files[0];
    const render = new FileReader();

    render.onload = async function (e) {
      message.innerText = "";
      const base64Image = e.target.result;
      showImg.src = "./loading.gif";

      try {
        const response = await axios({
          method: "POST",
          url: "https://detect.roboflow.com/binsmaterial/1",
          params: {
            api_key: "06AAsOyyx5C7hrsygRQT",
          },
          data: base64Image,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        showImg.src = base64Image;

        const data = response.data;

        const predictionClasses = [];

        // Looping through predictions in reverse order
        for (let i = 0; i <= data.predictions.length - 1; i++) {
          const prediction = data.predictions[i];
          predictionClasses.push(prediction.class);
        }

        let specialElementsArray;
        let restElementsArray

        if (predictionClasses.length > 0) {
          // Array with unique elements ["60-90", "below 50", "overfill"]
           specialElementsArray = Array.from(new Set(predictionClasses.filter(element => ["60-90", "below 50", "overfill"].includes(element))));

          // Array with unique elements other than ["60-90", "below 50", "overfill"]
           restElementsArray = Array.from(new Set(predictionClasses.filter(element => !["60-90", "below 50", "overfill"].includes(element))));
        }

        console.log(predictionClasses);
        if (predictionClasses.length > 0) {
          message.style.color = "green";
          message.innerText = `Material = ${restElementsArray <= 0 ? "No Material" : restElementsArray.map(pre => pre)} and Fill value = ${specialElementsArray.map(pre => pre)}`;
        }
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    render.readAsDataURL(selectedFile);
  }
});

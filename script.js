const showImg = document.getElementById("image_show");
const message = document.getElementById("result-text");
// const myCanvas = document.getElementById("myCanvas");
// const ctx = myCanvas.getContext("2d");

document
  .getElementById("imageInput")
  .addEventListener("change", function (event) {
    const fileInput = event.target;

    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      const render = new FileReader();

      render.onload = function (e) {
        message.innerText = "";
        const base64Image = e.target.result;
        showImg.src = "./loading.gif";
        axios({
          method: "POST",
          url: "https://detect.roboflow.com/binpercecntage/2",
          params: {
            api_key: "so7oMBbo34YblkbWHgTs",
          },
          data: base64Image,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
          .then(function (response) {
            showImg.src = base64Image;

            const data = response.data;
            if (data.predictions.length > 0) {
              message.style.color = "green";
              message.innerText = `Material = ${data.predictions[0]?.class} and Fill value = ${data.predictions[1]?.class}`;
            }
            console.log(data);
          })
          .catch(function (error) {
            console.log(error.message);
          });
      };

      render.readAsDataURL(selectedFile);
    }
  });

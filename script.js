let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let captureButton = document.getElementById("capture");
let toggleCameraButton = document.getElementById("toggle-camera");
let toggleThemeButton = document.getElementById("toggle-theme");
let photoGallery = document.getElementById("photo-gallery");

let currentStream = null;
let useFrontCamera = true;

async function startCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  const constraints = {
    video: {
      facingMode: useFrontCamera ? "user" : "environment"
    }
  };

  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert("Unable to access the camera. Please check permissions or use a supported device.");
  }
}

startCamera();

toggleCameraButton.addEventListener("click", () => {
  useFrontCamera = !useFrontCamera;
  startCamera();
});

captureButton.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/png");
  addPhotoToGallery(imageData);
});

function addPhotoToGallery(imageData) {
  const photoItem = document.createElement("div");
  photoItem.classList.add("photo-item");

  const img = document.createElement("img");
  img.src = imageData;

  const iconButtons = document.createElement("div");
  iconButtons.classList.add("icon-buttons");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-icon");
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.addEventListener("click", () => {
    photoItem.remove();
  });

  const downloadButton = document.createElement("button");
  downloadButton.classList.add("download-icon");
  downloadButton.innerHTML = '<i class="fas fa-download"></i>';
  downloadButton.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = imageData;
    a.download = "photo.png";
    a.click();
  });

  iconButtons.appendChild(deleteButton);
  iconButtons.appendChild(downloadButton);
  photoItem.appendChild(img);
  photoItem.appendChild(iconButtons);
  photoGallery.appendChild(photoItem);
}

toggleThemeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

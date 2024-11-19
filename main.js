// Voice Input Functionality
function startVoiceInput() {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
  
    recognition.onstart = () => {
      alert("Voice input started. Speak now...");
    };
  
    recognition.onspeechend = () => {
      recognition.stop();
      alert("Voice input stopped.");
    };
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById("description").value = transcript;
    };
  
    recognition.onerror = (event) => {
      alert("Error during voice input: " + event.error);
    };
  
    recognition.start();
  }
  const canvas = document.getElementById("capturedImage");

  
  const imageData = canvas.toDataURL("image/png");
  const img = document.createElement("img");
  img.src = imageData;
  document.body.appendChild(img); // Add the image to the page
  
  // Camera Capture Functionality
  function startCamera() {
    const video = document.getElementById("cameraPreview");
    const canvas = document.getElementById("capturedImage");
  
    // Mobile and tablet detection
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/.test(
      navigator.userAgent
    );
  
    // Restrict to mobile or tablet devices only
    if (window.innerWidth > 1024 || !isMobileDevice) {
      alert(
        "Camera functionality is only available on mobile or tablet devices."
      );
      return;
    }
  
    // Check if camera is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Use back camera by setting video constraints
      const constraints = {
        video: {
          facingMode: { exact: "environment" } // Force back camera
        }
      };
  
      // Access the back camera
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          video.srcObject = stream; // Connect the stream to the video element
          video.style.display = "block"; // Show the video preview
          video.play(); // Start the video preview
  
          // Ensure the video fits within the container
          video.style.maxWidth = "100%";
          video.style.height = "auto";
  
          // Capture frame when clicking the video
          video.addEventListener("click", () => {
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
  
            // Draw the current video frame onto the canvas
            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
            // Stop the video stream after capturing
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
  
            // Hide video preview
            video.style.display = "none";
  
            // Provide feedback to the user
            alert("Image captured!");
  
            // Optionally, display the captured image
            canvas.style.display = "block";
          });
        })
        .catch((error) => {
          if (error.name === "OverconstrainedError") {
            alert("Your device does not support the back camera.");
          } else {
            alert("Error accessing camera: " + error.message);
          }
        });
    } else {
      alert("Camera not supported in this browser.");
    }
  }
  
 
  
  // Incident Submission Handler
  function handleIncident() {
    const incidentType = document.getElementById("incidentType").value;
    const description = document.getElementById("description").value;
    const address = document.getElementById("address").value;
  
    alert(
      `Incident reported:\nType: ${incidentType}\nDescription: ${description}\nLocation: ${address}`
    );
    console.log("Incident data submitted.");
  }
  
  // Initialization
  document.addEventListener("DOMContentLoaded", () => {
    // Initialize map when the page loads
    initMap();
  
    // Ensure the camera preview and canvas dimensions match
    const video = document.getElementById("cameraPreview");
    const canvas = document.getElementById("capturedImage");
    canvas.width = 640; // Width in pixels
    canvas.height = 480; // Height in pixels
  });

  function initMap() {
    // Initialize the map and set its view to a default location (latitude, longitude) and zoom level
    const map = L.map('map').setView([51.505, -0.09], 13); // Default: London

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker at the default location
    const marker = L.marker([51.505, -0.09]).addTo(map);
    marker.bindPopup('<b>Hello!</b><br>This is the default location.').openPopup();

    // Add event listener to update marker on click
    map.on('click', (event) => {
        const { lat, lng } = event.latlng;
        marker.setLatLng([lat, lng]).bindPopup(`You clicked at: <b>${lat.toFixed(4)}, ${lng.toFixed(4)}</b>`).openPopup();
    });
}

document.addEventListener('DOMContentLoaded', initMap);

  
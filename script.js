// 1. Select the elements we need from the HTML
const mirrorModal = document.getElementById('mirror-modal');
const video = document.getElementById('video-element');

// 2. Function to turn the camera ON and show the modal
async function openMirror() {
    try {
        // Request access to the camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Give the camera stream to our <video> tag
        video.srcObject = stream;
        
        // Show the hidden modal (changing CSS display from 'none' to 'flex')
        mirrorModal.style.display = 'flex';
    } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Oops! Could not open the camera. Check permissions.");
    }
}

// 3. Function to turn the camera OFF and hide the modal
function closeMirror() {
    // Hide the modal
    mirrorModal.style.display = 'none';

    // Stop the camera (important so the "camera on" light goes off)
    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    
    // Clear the video source
    video.srcObject = null;
}

//Simple game modal handling
function openGame(gameId) {
    const modal = document.getElementById(gameId);
    if (modal) {
        // We add !important here so it overrides any CSS files
        modal.style.setProperty('display', 'flex', 'important');
    }
}

function closeGame(gameId) {
    const modal = document.getElementById(gameId);
    if (modal) {
        modal.style.setProperty('display', 'none', 'important');
    }
    // ... keep your mirror logic below ...
}

// Card video
function playVideo(videoId) {
    const container = document.getElementById('video-player-container');
    container.innerHTML = `
        <iframe width="100%" height="315" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
        </iframe>
        <button class="close-btn" onclick="stopVideo()">Stop Video</button>
    `;
}

function stopVideo() {
    document.getElementById('video-player-container').innerHTML = '';
}
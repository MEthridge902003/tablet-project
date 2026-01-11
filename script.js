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
// Sound Board
function playSound(name) {
    const sound = document.getElementById('sfx-' + name);
    
    // Check if the sound element exists AND has a valid source
    if (sound && sound.readyState >= 2) { 
        sound.currentTime = 0;
        sound.play();
    } else {
        console.warn(`Sound "sfx-${name}" is not ready or file is missing.`);
        // Optional: Alert yourself so you know which one is broken
        // alert("Check file: " + name); 
    }
}
// Bubbles
function createBubble() {
    const area = document.getElementById('bubble-area');
    if (!area) return;

    const bubble = document.createElement('div');
    const size = Math.floor(Math.random() * 60) + 40 + "px"; // 40px to 100px
    const speed = Math.floor(Math.random() * 4) + 6 + "s"; // 3s to 7s float time

    bubble.classList.add('bubble');
    bubble.style.width = size;
    bubble.style.height = size;
    bubble.style.left = Math.random() * 90 + "%"; // Random horizontal spot
    bubble.style.setProperty('--speed', speed);

    // When Keeva or Kiara taps it
    bubble.onclick = function() {
        playSound('pop'); // Use a short "pop" or "magic" sound from your assets
        bubble.remove();
    };

    area.appendChild(bubble);

    // Remove bubble after animation ends so the page doesn't get heavy
    setTimeout(() => {
        if (bubble.parentElement) bubble.remove();
    }, 8000);
}

// Start spawning when the modal opens
let bubbleInterval;
function startBubbles() {
    bubbleInterval = setInterval(createBubble, 1000); // New bubble every second
}

function stopBubbles() {
    clearInterval(bubbleInterval); // This kills the "timer"
    const area = document.getElementById('bubble-area');
    if (area) area.innerHTML = ''; // This clears the old bubbles
}
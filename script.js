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
// Sticker Garden
let activeSticker = '🌸'; // Default sticker

function selectSticker(emoji, btnElement) {
    activeSticker = emoji;
    
    // Reset all tray items
    document.querySelectorAll('.tray-item').forEach(btn => {
        btn.style.backgroundColor = '#f0f0f0';
        btn.style.transform = "scale(1)";
    });

    // Highlight the selected one
    if (btnElement) {
        btnElement.style.backgroundColor = '#fff';
        btnElement.style.transform = "scale(1.1)";
    }
}

// Update the garden listener to be more robust
const gardenArea = document.getElementById('garden-area');
if (gardenArea) {
    gardenArea.addEventListener('click', function(e) {
        const rect = gardenArea.getBoundingClientRect();
        
        // Use pageX/Y or clientX/Y depending on scroll
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newSticker = document.createElement('div');
        newSticker.classList.add('placed-sticker');
        
        // Random slight rotation so they don't look too "perfect"
        const rotation = Math.floor(Math.random() * 40) - 20; // -20 to 20 degrees
        
        newSticker.innerHTML = activeSticker;
        newSticker.style.left = x + 'px';
        newSticker.style.top = y + 'px';
        newSticker.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

        gardenArea.appendChild(newSticker);
        
        // Play sound (safe check)
        const popSound = document.getElementById('sfx-pop');
        if (popSound) {
            popSound.currentTime = 0;
            popSound.play().catch(() => {}); // Catch prevents console errors if sound isn't ready
        }
    });
}

// Add this to your initialization code
document.getElementById('garden-area').addEventListener('click', function(e) {
    const garden = document.getElementById('garden-area');
    const rect = garden.getBoundingClientRect();
    
    // Calculate position relative to the garden div
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSticker = document.createElement('div');
    newSticker.classList.add('placed-sticker');
    newSticker.innerHTML = activeSticker;
    newSticker.style.left = x + 'px';
    newSticker.style.top = y + 'px';

    garden.appendChild(newSticker);
    
    // Play a "tap" sound if you have one!
    if (typeof playSound === "function") playSound('pop');
});
function clearGarden() {
    const garden = document.getElementById('garden-area');
    if (garden) {
        garden.innerHTML = ''; // This deletes everything inside the garden
        if (typeof playSound === "function") playSound('magic'); // Optional "poof" sound
    }
}
// Songs in Progress JavaScript - Audio player with clickable icons

// Audio data
const songs = [
    {
        id: 1,
        title: "Honey-Boo-Boo",
        icon: "🎵",
        thumbnail: "../public/icons/kytka.JPEG",
        audioPath: "../public/audio/2GA_Test1.wav"
    }
    // Add more songs here in the future
];

// Initialize media grid
function initializeMediaGrid() {
    const mediaGrid = document.getElementById('mediaGrid');
    if (!mediaGrid) return;
    
    // Clear existing content to prevent duplicates
    mediaGrid.innerHTML = '';
    
    songs.forEach((song, index) => {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.setAttribute('data-song-index', index);
        
        card.innerHTML = `
            <div class="media-card-image" style="background-image: url('${song.thumbnail}'); background-size: cover; background-position: center; position: relative;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
                    ${song.icon}
                </div>
            </div>
            <div class="media-card-content">
                <div class="media-card-title">${song.title}</div>
            </div>
        `;
        
        // Add click handler (non-draggable, just clickable)
        card.addEventListener('click', function(e) {
            e.preventDefault();
            openAudioPlayer(index);
        });
        
        // Touch support for mobile
        card.addEventListener('touchend', function(e) {
            e.preventDefault();
            openAudioPlayer(index);
        });
        
        mediaGrid.appendChild(card);
    });
}

// Modal player state
let currentSongIndex = null;
let isMinimized = false;

// Get modal elements
const modalOverlay = document.getElementById('modalOverlay');
const modalPlayer = document.getElementById('modalPlayer');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');

// Open audio player
function openAudioPlayer(songIndex) {
    currentSongIndex = songIndex;
    const song = songs[songIndex];
    
    // Update title
    modalTitle.textContent = song.title;
    
    // Create album art
    const albumArt = document.createElement('div');
    albumArt.className = 'album-art';
    if (song.thumbnail) {
        albumArt.style.backgroundImage = `url('${song.thumbnail}')`;
    } else {
        albumArt.textContent = song.icon;
    }
    
    // Create audio element
    const audioElement = document.createElement('audio');
    audioElement.controls = true;
    audioElement.autoplay = true;
    audioElement.src = song.audioPath;
    
    // Clear previous content and add audio
    modalContent.innerHTML = '';
    modalContent.appendChild(albumArt);
    modalContent.appendChild(audioElement);
    
    // Show modal
    modalOverlay.classList.add('active');
    
    // Reset state
    isMinimized = false;
    modalPlayer.classList.remove('minimized');
}

// Close audio player
function closeAudioPlayer() {
    modalOverlay.classList.remove('active');
    
    // Stop and remove audio
    const audio = modalContent.querySelector('audio');
    if (audio) {
        audio.pause();
        audio.src = '';
    }
    modalContent.innerHTML = '';
    
    currentSongIndex = null;
    isMinimized = false;
    modalPlayer.classList.remove('minimized');
}

// Toggle minimize
function toggleMinimize() {
    isMinimized = !isMinimized;
    
    if (isMinimized) {
        modalPlayer.classList.add('minimized');
    } else {
        modalPlayer.classList.remove('minimized');
    }
}

// Event listeners for modal controls
minimizeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMinimize();
});

closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeAudioPlayer();
});

// Close modal when clicking overlay (but not the player itself)
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        closeAudioPlayer();
    }
});

// Touch event handlers for mobile
minimizeBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMinimize();
});

closeBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeAudioPlayer();
});

// Handle escape key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeAudioPlayer();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeMediaGrid();
});

// Songs in Progress JavaScript - Audio player with clickable icons

// Audio data
const songs = [
    {
        id: 1,
        title: "Honey-Boo-Boo I",
        icon: "☮︎",
        thumbnail: "../public/icons/honeybooboovegan.png",
        audioPath: "../public/audio/2GA_Test1.mp3"
    },
     {
        id: 2,
        title: "Honey-Boo-Boo II",
        icon: "☮︎",
        thumbnail: "../public/icons/honeybooboovegan.png",
        audioPath: "../public/audio/2GA_Test2.mp3"
    },
         {
        id: 3,
        title: "3GA TEST I",
        icon: "☮︎",
        thumbnail: "../public/icons/CD.png",
        audioPath: "../public/audio/3GA_SoundTest.mp3"
    },
         {
        id: 4,
        title: "3GA TEST II",
        icon: "☮︎",
        thumbnail: "../public/icons/CD.png",
        audioPath: "../public/audio/3GA_Vocal_Test2.mp3"
    },
    // Add more songs here in the future
];

// Calculate icon positions
function calculateIconPositions() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    const positions = [];
    
    if (viewportWidth <= 768) {
        // Mobile: 2 column grid
        const iconSpacing = 140;
        const startX = centerX - iconSpacing;
        const startY = centerY - (Math.ceil(songs.length / 2) * 90);
        
        songs.forEach((song, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            positions.push({
                x: startX + (col * iconSpacing * 2),
                y: startY + (row * 180)
            });
        });
    } else {
        // Desktop: grid layout with spacing
        const cols = Math.min(3, songs.length);
        const iconSpacing = 200;
        const startX = centerX - ((cols - 1) * iconSpacing / 2);
        const startY = centerY - 100;
        
        songs.forEach((song, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            positions.push({
                x: startX + (col * iconSpacing),
                y: startY + (row * 200)
            });
        });
    }
    
    return positions;
}

// Initialize icon grid
function initializeMediaGrid() {
    const iconsWrapper = document.getElementById('iconsWrapper');
    if (!iconsWrapper) return;
    
    // Clear existing content to prevent duplicates
    iconsWrapper.innerHTML = '';
    
    const positions = calculateIconPositions();
    const textColor = window.txtColor || '#ffffff';
    
    songs.forEach((song, index) => {
        const icon = document.createElement('div');
        icon.className = 'clickable-icon';
        icon.setAttribute('data-song-index', index);
        icon.style.left = `${positions[index].x}px`;
        icon.style.top = `${positions[index].y}px`;
        
        icon.innerHTML = `
            <div class="icon-content">
                <div class="icon-image-wrapper">
                    <img 
                        src="${song.thumbnail}" 
                        alt="${song.title}"
                        class="icon-image"
                        draggable="false"
                    />
                </div>
                <span class="icon-title" style="color: ${textColor}">
                    ${song.title}
                </span>
            </div>
        `;
        
        // Add click handler (non-draggable, just clickable)
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            openAudioPlayer(index);
        });
        
        // Touch support for mobile
        icon.addEventListener('touchend', function(e) {
            e.preventDefault();
            openAudioPlayer(index);
        });
        
        iconsWrapper.appendChild(icon);
    });
}

// Recalculate positions on window resize
window.addEventListener('resize', function() {
    initializeMediaGrid();
});

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
    audioElement.preload = 'auto';
    audioElement.src = song.audioPath;
    
    // Error handling
    audioElement.addEventListener('error', function(e) {
        console.error('Audio load error:', e);
        console.error('Audio path:', song.audioPath);
        alert('Error loading audio file. Please check if the file exists.');
    });
    
    // Log when audio is ready
    audioElement.addEventListener('canplay', function() {
        console.log('Audio ready to play');
    });
    
    // Try to play (but catch errors on mobile)
    audioElement.addEventListener('loadedmetadata', function() {
        audioElement.play().catch(function(error) {
            console.log('Autoplay prevented:', error);
            // User will need to click play manually
        });
    });
    
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
    
    // Stop and remove audio properly
    const audio = modalContent.querySelector('audio');
    if (audio) {
        audio.pause();
        // Remove src to stop loading, but don't set to empty string
        audio.removeAttribute('src');
        audio.load(); // Reset the audio element
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

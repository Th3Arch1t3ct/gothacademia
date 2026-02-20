// Music Videos JavaScript - Non-draggable clickable icons with modal video player

// Video data
const videos = [
    {
        title: "Kytka Final MV",
        icon: "🎬",
        thumbnail: "../public/icons/kytka.JPEG",
        videoPath: "../public/videos/kytka final MV.mov"
    }
    // Add more videos here in the future
];

// Get base path for file loading
function getBasePath() {
    const path = window.location.pathname;
    const directory = path.substring(0, path.lastIndexOf('/'));
    return window.location.origin + directory + '/';
}

// Initialize media grid
function initializeMediaGrid() {
    const mediaGrid = document.getElementById('mediaGrid');
    
    videos.forEach((video, index) => {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.setAttribute('data-video-index', index);
        
        card.innerHTML = `
            <div class="media-card-image" style="background-image: url('${video.thumbnail}'); background-size: cover; background-position: center; position: relative;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
                    ${video.icon}
                </div>
            </div>
            <div class="media-card-content">
                <div class="media-card-title">${video.title}</div>
            </div>
        `;
        
        // Add click handler (non-draggable, just clickable)
        card.addEventListener('click', function(e) {
            e.preventDefault();
            openVideoPlayer(index);
        });
        
        // Touch support for mobile
        card.addEventListener('touchend', function(e) {
            e.preventDefault();
            openVideoPlayer(index);
        });
        
        mediaGrid.appendChild(card);
    });
}

// Modal player state
let currentVideoIndex = null;
let isFullscreen = false;
let isMinimized = false;

// Get modal elements
const modalOverlay = document.getElementById('modalOverlay');
const modalPlayer = document.getElementById('modalPlayer');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const minimizeBtn = document.getElementById('minimizeBtn');
const expandBtn = document.getElementById('expandBtn');
const closeBtn = document.getElementById('closeBtn');

// Open video player
function openVideoPlayer(videoIndex) {
    currentVideoIndex = videoIndex;
    const video = videos[videoIndex];
    
    // Update title
    modalTitle.textContent = video.title;
    
    // Create video element
    const videoElement = document.createElement('video');
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.src = video.videoPath;
    
    // Clear previous content and add video
    modalContent.innerHTML = '';
    modalContent.appendChild(videoElement);
    
    // Show modal
    modalOverlay.classList.add('active');
    
    // Reset state
    isFullscreen = false;
    isMinimized = false;
    modalPlayer.classList.remove('fullscreen', 'minimized');
}

// Close video player
function closeVideoPlayer() {
    modalOverlay.classList.remove('active');
    
    // Stop and remove video
    const video = modalContent.querySelector('video');
    if (video) {
        video.pause();
        video.src = '';
    }
    modalContent.innerHTML = '';
    
    currentVideoIndex = null;
    isFullscreen = false;
    isMinimized = false;
    modalPlayer.classList.remove('fullscreen', 'minimized');
}

// Toggle fullscreen
function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    
    if (isFullscreen) {
        isMinimized = false;
        modalPlayer.classList.add('fullscreen');
        modalPlayer.classList.remove('minimized');
        expandBtn.textContent = '❐'; // Restore/normal icon
    } else {
        modalPlayer.classList.remove('fullscreen');
        expandBtn.textContent = '⛶'; // Expand icon
    }
}

// Toggle minimize
function toggleMinimize() {
    isMinimized = !isMinimized;
    
    if (isMinimized) {
        isFullscreen = false;
        modalPlayer.classList.add('minimized');
        modalPlayer.classList.remove('fullscreen');
    } else {
        modalPlayer.classList.remove('minimized');
    }
}

// Event listeners for modal controls
minimizeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMinimize();
});

expandBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleFullscreen();
});

closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeVideoPlayer();
});

// Close modal when clicking overlay (but not the player itself)
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        closeVideoPlayer();
    }
});

// Touch event handlers for mobile
minimizeBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMinimize();
});

expandBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFullscreen();
});

closeBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeVideoPlayer();
});

// Handle escape key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeVideoPlayer();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeMediaGrid();
});

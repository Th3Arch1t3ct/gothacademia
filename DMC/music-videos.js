// Music Videos JavaScript - Non-draggable clickable icons with modal video player

// Video data
const videos = [
    {
        title: "Kytka",
        icon: "🎬",
        thumbnail: "../public/icons/kytka.JPEG",
        videoPath: "../public/videos/kytka final MV.mov"
    }
    // Add more videos here in the future
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
        const startY = centerY - (Math.ceil(videos.length / 2) * 90);
        
        videos.forEach((video, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            positions.push({
                x: startX + (col * iconSpacing * 2),
                y: startY + (row * 180)
            });
        });
    } else {
        // Desktop: grid layout with spacing
        const cols = Math.min(3, videos.length);
        const iconSpacing = 200;
        const startX = centerX - ((cols - 1) * iconSpacing / 2);
        const startY = centerY - 100;
        
        videos.forEach((video, index) => {
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
    
    videos.forEach((video, index) => {
        const icon = document.createElement('div');
        icon.className = 'clickable-icon';
        icon.setAttribute('data-video-index', index);
        icon.style.left = `${positions[index].x}px`;
        icon.style.top = `${positions[index].y}px`;
        
        icon.innerHTML = `
            <div class="icon-content">
                <div class="icon-image-wrapper">
                    <img 
                        src="${video.thumbnail}" 
                        alt="${video.title}"
                        class="icon-image"
                        draggable="false"
                    />
                </div>
                <span class="icon-title" style="color: ${textColor}">
                    ${video.title}
                </span>
            </div>
        `;
        
        // Add click handler (non-draggable, just clickable)
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            openVideoPlayer(index);
        });
        
        // Touch support for mobile
        icon.addEventListener('touchend', function(e) {
            e.preventDefault();
            openVideoPlayer(index);
        });
        
        iconsWrapper.appendChild(icon);
    });
}

// Recalculate positions on window resize
window.addEventListener('resize', function() {
    initializeMediaGrid();
});

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

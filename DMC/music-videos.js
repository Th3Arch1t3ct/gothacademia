// Music Videos JavaScript - Draggable icons with persistent draggable player

// Video data with positions
let videos = [
    {
        id: 1,
        title: "Kytka",
        icon: "🎬",
        thumbnail: "../public/icons/kytka.JPEG",
        videoPath: "../public/videos/kytka final MV.mov",
        position: { x: 0, y: 0 }
    }
];

// Calculate responsive positions
function calculateResponsivePositions() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Mobile layout - 2 column grid
    if (viewportWidth <= 768) {
        const iconWidth = 160;
        const iconHeight = 160;
        const horizontalSpacing = 20;
        const verticalSpacing = 40;
        
        // Calculate grid starting position
        const gridWidth = (iconWidth * 2) + horizontalSpacing;
        const startX = centerX - (gridWidth / 2);
        const startY = centerY - 80;
        
        // Position icons in 2-column grid
        videos.forEach((video, index) => {
            const col = index % 2; // 0 or 1 (left or right)
            const row = Math.floor(index / 2); // 0, 1, 2, 3...
            
            video.position = {
                x: startX + (col * (iconWidth + horizontalSpacing)),
                y: startY + (row * (iconHeight + verticalSpacing))
            };
        });
    } else {
        // Desktop layout - center based on number of icons
        const cols = Math.min(3, videos.length);
        const rows = Math.ceil(videos.length / cols);
        const iconSpacing = 250;
        
        // Calculate total grid dimensions
        const gridWidth = (cols - 1) * iconSpacing;
        const gridHeight = (rows - 1) * 200;
        const startX = centerX - (gridWidth / 2);
        const startY = centerY - (gridHeight / 2);
        
        videos.forEach((video, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            video.position = {
                x: startX + (col * iconSpacing),
                y: startY + (row * 200)
            };
        });
    }
}

// Icon drag state
let activeIcon = null;
let startPos = { x: 0, y: 0 };
let isDragging = false;
let hasMoved = false;
let touchStartTime = 0;
let totalMovement = 0;

// Get text color from window
const textColor = window.txtColor || '#ffffff';

// Render icons to DOM
function renderIcons() {
    const iconsWrapper = document.getElementById('iconsWrapper');
    if (!iconsWrapper) return;

    iconsWrapper.innerHTML = '';

    videos.forEach((video) => {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'draggable-icon';
        iconDiv.id = `icon-${video.id}`;
        iconDiv.style.left = `${video.position.x}px`;
        iconDiv.style.top = `${video.position.y}px`;
        iconDiv.dataset.iconId = video.id.toString();

        iconDiv.innerHTML = `
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

        iconDiv.addEventListener('mousedown', (e) => handleMouseDown(video.id, e));
        iconDiv.addEventListener('touchstart', (e) => handleTouchStart(video.id, e), { passive: false });
        iconDiv.addEventListener('click', (e) => handleIconClick(e, video.id));

        iconsWrapper.appendChild(iconDiv);
    });
}

// Handle mouse down
function handleMouseDown(id, e) {
    e.preventDefault();
    activeIcon = id;
    startPos = { x: e.clientX, y: e.clientY };
    isDragging = true;
    hasMoved = false;

    const iconElement = document.getElementById(`icon-${id}`);
    if (iconElement) {
        iconElement.classList.add('dragging');
    }
}

// Handle touch start
function handleTouchStart(id, e) {
    activeIcon = id;
    startPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isDragging = false;
    hasMoved = false;
    touchStartTime = Date.now();
    totalMovement = 0;

    const iconElement = document.getElementById(`icon-${id}`);
    if (iconElement) {
        iconElement.classList.add('dragging');
    }
}

// Handle mouse move
function handleMouseMove(e) {
    if (activeIcon !== null && isDragging) {
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        if (Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15) {
            hasMoved = true;
        }

        videos = videos.map(video => {
            if (video.id === activeIcon) {
                return {
                    ...video,
                    position: {
                        x: video.position.x + deltaX,
                        y: video.position.y + deltaY
                    }
                };
            }
            return video;
        });

        const iconElement = document.getElementById(`icon-${activeIcon}`);
        if (iconElement) {
            const updatedVideo = videos.find(video => video.id === activeIcon);
            if (updatedVideo) {
                iconElement.style.left = `${updatedVideo.position.x}px`;
                iconElement.style.top = `${updatedVideo.position.y}px`;
            }
        }

        startPos = { x: e.clientX, y: e.clientY };
    }
}

// Handle touch move
function handleTouchMove(e) {
    if (activeIcon !== null) {
        const deltaX = e.touches[0].clientX - startPos.x;
        const deltaY = e.touches[0].clientY - startPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        totalMovement += distance;
        
        if (totalMovement > 5) {
            isDragging = true;
            hasMoved = true;
            e.preventDefault();
        }
        
        if (isDragging) {
            videos = videos.map(video => {
                if (video.id === activeIcon) {
                    return {
                        ...video,
                        position: {
                            x: video.position.x + deltaX,
                            y: video.position.y + deltaY
                        }
                    };
                }
                return video;
            });

            const iconElement = document.getElementById(`icon-${activeIcon}`);
            if (iconElement) {
                const updatedVideo = videos.find(video => video.id === activeIcon);
                if (updatedVideo) {
                    iconElement.style.left = `${updatedVideo.position.x}px`;
                    iconElement.style.top = `${updatedVideo.position.y}px`;
                }
            }

            startPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }
}

// Handle mouse up
function handleMouseUp() {
    if (activeIcon !== null) {
        const iconElement = document.getElementById(`icon-${activeIcon}`);
        if (iconElement) {
            iconElement.classList.remove('dragging');
        }
    }
    activeIcon = null;
    isDragging = false;
}

// Handle touch end
function handleTouchEnd(e) {
    if (activeIcon !== null && !hasMoved && totalMovement < 5) {
        const video = videos.find(v => v.id === activeIcon);
        if (video) {
            openVideoPlayer(video.id);
        }
    }
    
    if (activeIcon !== null) {
        const iconElement = document.getElementById(`icon-${activeIcon}`);
        if (iconElement) {
            iconElement.classList.remove('dragging');
        }
    }
    activeIcon = null;
    isDragging = false;
    hasMoved = false;
    totalMovement = 0;
}

// Handle icon click
function handleIconClick(e, id) {
    if (!hasMoved) {
        openVideoPlayer(id);
    } else {
        e.preventDefault();
    }
}

// Modal player state
let playerDragState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0
};
let isFullscreen = false;

// Get modal elements
const modalOverlay = document.getElementById('modalOverlay');
const modalPlayer = document.getElementById('modalPlayer');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalHeader = document.querySelector('.modal-header');
const minimizeBtn = document.getElementById('minimizeBtn');
const expandBtn = document.getElementById('expandBtn');
const closeBtn = document.getElementById('closeBtn');

// Open video player
function openVideoPlayer(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    // Update title
    modalTitle.textContent = video.title;
    
    // Create video element
    const videoElement = document.createElement('video');
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.src = video.videoPath;
    videoElement.id = 'currentVideo';
    
    // Clear previous content and add video
    modalContent.innerHTML = '';
    modalContent.appendChild(videoElement);
    
    // Show modal
    modalOverlay.classList.add('active');
    isFullscreen = false;
    modalPlayer.classList.remove('fullscreen', 'minimized');
    
    // Save to localStorage
    savePlayerState(video.id, videoElement.currentTime);
}

// Close video player
function closeVideoPlayer() {
    modalOverlay.classList.remove('active');
    
    const video = modalContent.querySelector('video');
    if (video) {
        video.pause();
        video.src = '';
    }
    modalContent.innerHTML = '';
    
    // Clear localStorage
    localStorage.removeItem('currentAudioPlayer');
    isFullscreen = false;
    modalPlayer.classList.remove('fullscreen', 'minimized');
}

// Toggle fullscreen
function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    
    if (isFullscreen) {
        modalPlayer.classList.add('fullscreen');
        modalPlayer.classList.remove('minimized');
        expandBtn.textContent = '❐';
    } else {
        modalPlayer.classList.remove('fullscreen');
        expandBtn.textContent = '⛶';
    }
}

// Toggle minimize
function toggleMinimize() {
    if (isFullscreen) {
        isFullscreen = false;
        expandBtn.textContent = '⛶';
    }
    modalPlayer.classList.toggle('minimized');
    modalPlayer.classList.remove('fullscreen');
}

// Save player state
function savePlayerState(videoId, currentTime) {
    const state = {
        type: 'video',
        videoId: videoId,
        currentTime: currentTime || 0,
        page: window.location.pathname
    };
    localStorage.setItem('currentAudioPlayer', JSON.stringify(state));
}

// Restore player state
function restorePlayerState() {
    const stateStr = localStorage.getItem('currentAudioPlayer');
    if (!stateStr) return;
    
    try {
        const state = JSON.parse(stateStr);
        if (state.type === 'video') {
            const video = videos.find(v => v.id === state.videoId);
            if (video) {
                openVideoPlayer(video.id);
                const videoEl = document.getElementById('currentVideo');
                if (videoEl && state.currentTime) {
                    videoEl.currentTime = state.currentTime;
                }
            }
        }
    } catch (e) {
        console.error('Error restoring player:', e);
    }
}

// Update player state periodically
function startPlayerStateUpdates() {
    setInterval(() => {
        const video = document.getElementById('currentVideo');
        if (video && !video.paused) {
            const currentVideoId = videos.find(v => 
                modalTitle.textContent === v.title
            )?.id;
            if (currentVideoId) {
                savePlayerState(currentVideoId, video.currentTime);
            }
        }
    }, 1000);
}

// Make player draggable
function makePlayerDraggable() {
    modalHeader.addEventListener('mousedown', function(e) {
        if (e.target.closest('.modal-btn')) return;
        if (isFullscreen) return;
        
        playerDragState.isDragging = true;
        playerDragState.startX = e.clientX;
        playerDragState.startY = e.clientY;
        
        const rect = modalPlayer.getBoundingClientRect();
        playerDragState.offsetX = rect.left;
        playerDragState.offsetY = rect.top;
        
        modalPlayer.style.position = 'fixed';
        modalPlayer.style.left = `${playerDragState.offsetX}px`;
        modalPlayer.style.top = `${playerDragState.offsetY}px`;
        modalPlayer.style.transform = 'none';
        
        e.preventDefault();
    });
    
    modalHeader.addEventListener('touchstart', function(e) {
        if (e.target.closest('.modal-btn')) return;
        if (isFullscreen) return;
        
        playerDragState.isDragging = true;
        playerDragState.startX = e.touches[0].clientX;
        playerDragState.startY = e.touches[0].clientY;
        
        const rect = modalPlayer.getBoundingClientRect();
        playerDragState.offsetX = rect.left;
        playerDragState.offsetY = rect.top;
        
        modalPlayer.style.position = 'fixed';
        modalPlayer.style.left = `${playerDragState.offsetX}px`;
        modalPlayer.style.top = `${playerDragState.offsetY}px`;
        modalPlayer.style.transform = 'none';
        
        e.preventDefault();
    }, { passive: false });
}

document.addEventListener('mousemove', function(e) {
    if (playerDragState.isDragging && !isFullscreen) {
        const deltaX = e.clientX - playerDragState.startX;
        const deltaY = e.clientY - playerDragState.startY;
        
        modalPlayer.style.left = `${playerDragState.offsetX + deltaX}px`;
        modalPlayer.style.top = `${playerDragState.offsetY + deltaY}px`;
    }
});

document.addEventListener('touchmove', function(e) {
    if (playerDragState.isDragging && !isFullscreen) {
        const deltaX = e.touches[0].clientX - playerDragState.startX;
        const deltaY = e.touches[0].clientY - playerDragState.startY;
        
        modalPlayer.style.left = `${playerDragState.offsetX + deltaX}px`;
        modalPlayer.style.top = `${playerDragState.offsetY + deltaY}px`;
        
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('mouseup', function() {
    if (playerDragState.isDragging) {
        const rect = modalPlayer.getBoundingClientRect();
        playerDragState.offsetX = rect.left;
        playerDragState.offsetY = rect.top;
    }
    playerDragState.isDragging = false;
});

document.addEventListener('touchend', function() {
    if (playerDragState.isDragging) {
        const rect = modalPlayer.getBoundingClientRect();
        playerDragState.offsetX = rect.left;
        playerDragState.offsetY = rect.top;
    }
    playerDragState.isDragging = false;
});

// Event listeners
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

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeVideoPlayer();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    calculateResponsivePositions();
    renderIcons();
    makePlayerDraggable();
    restorePlayerState();
    startPlayerStateUpdates();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
});

window.addEventListener('resize', function() {
    calculateResponsivePositions();
    renderIcons();
});

// Save state before unload
window.addEventListener('beforeunload', function() {
    const video = document.getElementById('currentVideo');
    if (video && !video.paused) {
        const currentVideoId = videos.find(v => 
            modalTitle.textContent === v.title
        )?.id;
        if (currentVideoId) {
            savePlayerState(currentVideoId, video.currentTime);
        }
    }
});

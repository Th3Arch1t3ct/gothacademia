// Songs in Progress JavaScript - Draggable icons with persistent draggable player

// Audio data with positions
let songs = [
    {
        id: 1,
        title: "2GA I",
        thumbnail: "../public/icons/honeybooboovegan.png",
        audioPath: "../public/audio/2GA_Test1.mp3",
        position: { x: 0, y: 0 }
    },
    {
        id: 2,
        title: "2GA II",
        thumbnail: "../public/icons/honeybooboovegan.png",
        audioPath: "../public/audio/2GA_Test2.mp3",
        position: { x: 0, y: 0 }
    },
    {
        id: 3,
        title: "3GA I",
        thumbnail: "../public/icons/CD.png",
        audioPath: "../public/audio/3GA_SoundTest.mp3",
        position: { x: 0, y: 0 }
    },
    {
        id: 4,
        title: "3GA II",
        thumbnail: "../public/icons/CD.png",
        audioPath: "../public/audio/3GA_Vocal_Test2.mp3",
        position: { x: 0, y: 0 }
    }
];

// Calculate responsive positions
function calculateResponsivePositions() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    if (viewportWidth <= 768) {
        // Mobile: 2 column grid
        const iconWidth = 100;
        const iconSpacing = 40;
        const totalWidth = (iconWidth * 2) + iconSpacing;
        const startX = centerX - totalWidth / 2;
        const startY = Math.max(100, centerY - (Math.ceil(songs.length / 2) * 90));
        
        songs.forEach((song, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            song.position = {
                x: startX + (col * (iconWidth + iconSpacing)),
                y: startY + (row * 160)
            };
        });
    } else {
        // Desktop: grid layout
        const cols = Math.min(3, songs.length);
        const iconSpacing = 200;
        const totalWidth = (cols - 1) * iconSpacing;
        const startX = centerX - totalWidth / 2;
        const startY = centerY - 100;
        
        songs.forEach((song, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            song.position = {
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

    songs.forEach((song) => {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'draggable-icon';
        iconDiv.id = `icon-${song.id}`;
        iconDiv.style.left = `${song.position.x}px`;
        iconDiv.style.top = `${song.position.y}px`;
        iconDiv.dataset.iconId = song.id.toString();

        iconDiv.innerHTML = `
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

        iconDiv.addEventListener('mousedown', (e) => handleMouseDown(song.id, e));
        iconDiv.addEventListener('touchstart', (e) => handleTouchStart(song.id, e), { passive: false });
        iconDiv.addEventListener('click', (e) => handleIconClick(e, song.id));

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

        songs = songs.map(song => {
            if (song.id === activeIcon) {
                return {
                    ...song,
                    position: {
                        x: song.position.x + deltaX,
                        y: song.position.y + deltaY
                    }
                };
            }
            return song;
        });

        const iconElement = document.getElementById(`icon-${activeIcon}`);
        if (iconElement) {
            const updatedSong = songs.find(song => song.id === activeIcon);
            if (updatedSong) {
                iconElement.style.left = `${updatedSong.position.x}px`;
                iconElement.style.top = `${updatedSong.position.y}px`;
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
            songs = songs.map(song => {
                if (song.id === activeIcon) {
                    return {
                        ...song,
                        position: {
                            x: song.position.x + deltaX,
                            y: song.position.y + deltaY
                        }
                    };
                }
                return song;
            });

            const iconElement = document.getElementById(`icon-${activeIcon}`);
            if (iconElement) {
                const updatedSong = songs.find(song => song.id === activeIcon);
                if (updatedSong) {
                    iconElement.style.left = `${updatedSong.position.x}px`;
                    iconElement.style.top = `${updatedSong.position.y}px`;
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
        const song = songs.find(s => s.id === activeIcon);
        if (song) {
            openAudioPlayer(song.id);
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
        openAudioPlayer(id);
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

// Get modal elements
const modalOverlay = document.getElementById('modalOverlay');
const modalPlayer = document.getElementById('modalPlayer');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalHeader = document.querySelector('.modal-header');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');

// Open audio player
function openAudioPlayer(songId) {
    const song = songs.find(s => s.id === songId);
    if (!song) return;
    
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
    audioElement.id = 'currentAudio';
    
    // Error handling
    audioElement.addEventListener('error', function(e) {
        console.error('Audio load error:', e);
        alert('Error loading audio file.');
    });
    
    // Try to play
    audioElement.addEventListener('loadedmetadata', function() {
        audioElement.play().catch(function(error) {
            console.log('Autoplay prevented:', error);
        });
    });
    
    // Clear previous content and add audio
    modalContent.innerHTML = '';
    modalContent.appendChild(albumArt);
    modalContent.appendChild(audioElement);
    
    // Show modal
    modalOverlay.classList.add('active');
    
    // Save to localStorage
    savePlayerState(song.id, audioElement.currentTime);
}

// Close audio player
function closeAudioPlayer() {
    modalOverlay.classList.remove('active');
    
    const audio = modalContent.querySelector('audio');
    if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
    }
    modalContent.innerHTML = '';
    
    // Clear localStorage
    localStorage.removeItem('currentAudioPlayer');
    modalPlayer.classList.remove('minimized');
}

// Toggle minimize
function toggleMinimize() {
    modalPlayer.classList.toggle('minimized');
}

// Save player state
function savePlayerState(songId, currentTime) {
    const state = {
        type: 'audio',
        songId: songId,
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
        if (state.type === 'audio') {
            const song = songs.find(s => s.id === state.songId);
            if (song) {
                openAudioPlayer(song.id);
                const audio = document.getElementById('currentAudio');
                if (audio && state.currentTime) {
                    audio.currentTime = state.currentTime;
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
        const audio = document.getElementById('currentAudio');
        if (audio && !audio.paused) {
            const currentSongId = songs.find(s => 
                modalTitle.textContent === s.title
            )?.id;
            if (currentSongId) {
                savePlayerState(currentSongId, audio.currentTime);
            }
        }
    }, 1000);
}

// Make player draggable
function makePlayerDraggable() {
    modalHeader.addEventListener('mousedown', function(e) {
        if (e.target.closest('.modal-btn')) return;
        
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
    if (playerDragState.isDragging) {
        const deltaX = e.clientX - playerDragState.startX;
        const deltaY = e.clientY - playerDragState.startY;
        
        modalPlayer.style.left = `${playerDragState.offsetX + deltaX}px`;
        modalPlayer.style.top = `${playerDragState.offsetY + deltaY}px`;
    }
});

document.addEventListener('touchmove', function(e) {
    if (playerDragState.isDragging) {
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

closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeAudioPlayer();
});

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

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeAudioPlayer();
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
    const audio = document.getElementById('currentAudio');
    if (audio && !audio.paused) {
        const currentSongId = songs.find(s => 
            modalTitle.textContent === s.title
        )?.id;
        if (currentSongId) {
            savePlayerState(currentSongId, audio.currentTime);
        }
    }
});

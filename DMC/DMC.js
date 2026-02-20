// Get the base path (parent directory of current page)
const getBasePath = () => {
    const path = window.location.pathname;
    const directory = path.substring(0, path.lastIndexOf('/'));
    return directory.substring(0, directory.lastIndexOf('/')) + '/';
};

const basePath = getBasePath();

// State - positions will be calculated responsively
let icons = [
    {
        id: 1,
        title: "Music/Videos",
        image: basePath + "public/icons/folderzip.png",
        link: "music-videos.html",
        position: { x: 0, y: 0 },
    },
    {
        id: 2,
        title: "Songs in Progress",
        image: basePath + "public/icons/folder-icon.png",
        link: "songs-in-progress.html",
        position: { x: 0, y: 0 },
    },
    {
        id: 3,
        title: "Beats",
        image: basePath + "public/icons/imac.gif",
        link: "beats.html",
        position: { x: 0, y: 0 },
    },
    {
        id: 4,
        title: "Track List",
        image: basePath + "public/icons/newfolder.png",
        link: "track-list.html",
        position: { x: 0, y: 0 },
    },
];

// Calculate responsive centered positions
function calculateResponsivePositions() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Mobile layout (portrait mode for iOS)
    if (viewportWidth <= 768) {
        // Account for header at top (approx 5rem)
        const topOffset = 80; // Header space
        const availableHeight = viewportHeight - topOffset;
        const iconHeight = 160; // Approximate icon height with title
        const totalIconsHeight = iconHeight * 4;
        const spacing = (availableHeight - totalIconsHeight) / 5;
        
        // Center icons horizontally and distribute vertically
        icons[0].position = { 
            x: centerX - 80, 
            y: topOffset + spacing + (iconHeight + spacing) * 0 
        };
        icons[1].position = { 
            x: centerX - 80, 
            y: topOffset + spacing + (iconHeight + spacing) * 1 
        };
        icons[2].position = { 
            x: centerX - 80, 
            y: topOffset + spacing + (iconHeight + spacing) * 2 
        };
        icons[3].position = { 
            x: centerX - 80, 
            y: topOffset + spacing + (iconHeight + spacing) * 3 
        };
    } else {
        // Desktop layout - 2x2 grid
        icons[0].position = { x: centerX - 220, y: centerY - 150 };
        icons[1].position = { x: centerX + 60, y: centerY - 150 };
        icons[2].position = { x: centerX - 220, y: centerY + 50 };
        icons[3].position = { x: centerX + 60, y: centerY + 50 };
    }
}

let activeIcon = null;
let startPos = { x: 0, y: 0 };
let isDragging = false;
let hasMoved = false;
let touchStartTime = 0;
let totalMovement = 0;

// Get container element
const containerRef = document.getElementById('iconsWrapper');

// Use the colors already generated in the HTML
const textColor = txtColor;
const backgroundColor = bgColor;

console.log('DMC Page - Background Color:', backgroundColor, 'Text Color:', textColor);

// Set background color and text color
document.addEventListener('DOMContentLoaded', () => {
    calculateResponsivePositions();
    renderIcons();
    attachEventListeners();
});

// Recalculate positions on window resize
window.addEventListener('resize', () => {
    calculateResponsivePositions();
    renderIcons();
});

// Render icons to DOM
function renderIcons() {
    const iconsWrapper = document.getElementById('iconsWrapper');
    if (!iconsWrapper) return;

    iconsWrapper.innerHTML = '';

    icons.forEach((icon) => {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'draggable-icon';
        iconDiv.id = `icon-${icon.id}`;
        iconDiv.style.left = `${icon.position.x}px`;
        iconDiv.style.top = `${icon.position.y}px`;
        iconDiv.dataset.iconId = icon.id.toString();

        // Create image element with error handling
        const imgElement = document.createElement('img');
        imgElement.src = icon.image;
        imgElement.alt = icon.title;
        imgElement.className = 'icon-image';
        imgElement.draggable = false;
        
        // Add error handler for debugging
        imgElement.onerror = function() {
            console.error(`Failed to load image: ${icon.image}`);
            console.log(`Current location: ${window.location.href}`);
            console.log(`Attempted path: ${this.src}`);
        };
        
        imgElement.onload = function() {
            console.log(`Successfully loaded: ${icon.image}`);
        };

        const iconContent = document.createElement('div');
        iconContent.className = 'icon-content';
        
        const iconImageWrapper = document.createElement('div');
        iconImageWrapper.className = 'icon-image-wrapper';
        iconImageWrapper.appendChild(imgElement);
        
        const iconTitle = document.createElement('span');
        iconTitle.className = 'icon-title';
        iconTitle.style.color = textColor;
        iconTitle.textContent = icon.title;
        
        iconContent.appendChild(iconImageWrapper);
        iconContent.appendChild(iconTitle);
        iconDiv.appendChild(iconContent);

        // Add mouse down event
        iconDiv.addEventListener('mousedown', (e) => handleMouseDown(icon.id, e));
        
        // Add touch start event
        iconDiv.addEventListener('touchstart', (e) => handleTouchStart(icon.id, e), { passive: false });
        
        // Add click event
        iconDiv.addEventListener('click', (e) => handleIconClick(e, icon.link));

        iconsWrapper.appendChild(iconDiv);
    });
}

// Handle mouse down to start dragging
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

// Handle touch start for mobile
function handleTouchStart(id, e) {
    // Don't prevent default immediately - let browser decide if it's a tap
    activeIcon = id;
    startPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isDragging = false; // Don't set to true yet
    hasMoved = false;
    touchStartTime = Date.now();
    totalMovement = 0;

    const iconElement = document.getElementById(`icon-${id}`);
    if (iconElement) {
        iconElement.classList.add('dragging');
    }
}

// Handle mouse move to update position
function handleMouseMove(e) {
    if (activeIcon !== null && isDragging) {
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        if (Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15) {
            hasMoved = true;
        }

        icons = icons.map(icon => {
            if (icon.id === activeIcon) {
                return {
                    ...icon,
                    position: {
                        x: icon.position.x + deltaX,
                        y: icon.position.y + deltaY
                    }
                };
            }
            return icon;
        });

        // Update DOM
        const iconElement = document.getElementById(`icon-${activeIcon}`);
        if (iconElement) {
            const updatedIcon = icons.find(icon => icon.id === activeIcon);
            if (updatedIcon) {
                iconElement.style.left = `${updatedIcon.position.x}px`;
                iconElement.style.top = `${updatedIcon.position.y}px`;
            }
        }

        startPos = { x: e.clientX, y: e.clientY };
    }
}

// Handle touch move for mobile
function handleTouchMove(e) {
    if (activeIcon !== null) {
        const deltaX = e.touches[0].clientX - startPos.x;
        const deltaY = e.touches[0].clientY - startPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        totalMovement += distance;
        
        // Only start dragging if moved more than 5px
        if (totalMovement > 5) {
            isDragging = true;
            hasMoved = true;
            e.preventDefault(); // Now prevent scrolling
        }
        
        if (isDragging) {
            icons = icons.map(icon => {
                if (icon.id === activeIcon) {
                    return {
                        ...icon,
                        position: {
                            x: icon.position.x + deltaX,
                            y: icon.position.y + deltaY
                        }
                    };
                }
                return icon;
            });

            // Update DOM
            const iconElement = document.getElementById(`icon-${activeIcon}`);
            if (iconElement) {
                const updatedIcon = icons.find(icon => icon.id === activeIcon);
                if (updatedIcon) {
                    iconElement.style.left = `${updatedIcon.position.x}px`;
                    iconElement.style.top = `${updatedIcon.position.y}px`;
                }
            }

            startPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }
}

// Handle mouse up to stop dragging
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

// Handle touch end for mobile navigation
function handleTouchEnd(e) {
    if (activeIcon !== null && !hasMoved && totalMovement < 5) {
        // This was a tap, not a drag - navigate
        const icon = icons.find(i => i.id === activeIcon);
        if (icon) {
            window.location.href = icon.link;
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

// Handle click on icon (for navigation)
function handleIconClick(e, link) {
    if (!hasMoved) {
        window.location.href = link;
    } else {
        e.preventDefault();
    }
}

// Attach event listeners
function attachEventListeners() {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
}

// State - positions will be calculated responsively
let icons = [
    {
        id: 1,
        title: "Valentina",
        image: "public/icons/avatar.svg",
        link: "Valentina.html",
        position: { x: 0, y: 0 },
    },
    {
        id: 2,
        title: "Hector",
        image: "public/icons/avatar.svg",
        link: "Hector.html",
        position: { x: 0, y: 0 },
    },
];

// Calculate responsive centered positions
function calculateResponsivePositions() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Mobile layout
    if (viewportWidth <= 768) {
        icons[0].position = { x: centerX - 80, y: centerY - 150 };
        if (icons[1]) {
            icons[1].position = { x: centerX - 80, y: centerY + 50 };
        }
    } else {
        // Desktop layout
        icons[0].position = { x: centerX - 200, y: centerY - 100 };
        if (icons[1]) {
            icons[1].position = { x: centerX + 50, y: centerY - 50 };
        }
    }
}

let activeIcon = null;
let startPos = { x: 0, y: 0 };
let isDragging = false;
let hasMoved = false;

// Get container element
const containerRef = document.getElementById('iconsWrapper');

// Use the colors already generated in the HTML
const textColor = txtColor;
const backgroundColor = bgColor;

console.log('Background Color:', backgroundColor, 'Text Color:', textColor);

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

        iconDiv.innerHTML = `
            <div class="icon-content">
                <div class="icon-image-wrapper">
                    <img 
                        src="${icon.image}" 
                        alt="${icon.title}"
                        class="icon-image"
                        draggable="false"
                    />
                </div>
                <span class="icon-title" style="color: ${textColor}">
                    ${icon.title}
                </span>
            </div>
        `;

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
    e.preventDefault();
    activeIcon = id;
    startPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isDragging = true;
    hasMoved = false;

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
    if (activeIcon !== null && isDragging) {
        e.preventDefault();
        const deltaX = e.touches[0].clientX - startPos.x;
        const deltaY = e.touches[0].clientY - startPos.y;

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

        startPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
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
    window.addEventListener('touchend', handleMouseUp);
}

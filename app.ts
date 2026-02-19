// Types
interface Position {
    x: number;
    y: number;
}

interface DraggableIcon {
    id: number;
    title: string;
    image: string;
    link: string;
    position: Position;
}

// State
let icons: DraggableIcon[] = [
    {
        id: 1,
        title: "Music",
        image: "/icons/Yeezy.png",
        link: "/music",
        position: { x: 800, y: 100 },
    },
    {
        id: 4,
        title: "Wiki",
        image: "/icons/About.png",
        link: "/about",
        position: { x: 730, y: 300 },
    },
    {
        id: 5,
        title: "Contact",
        image: "/icons/contact.png",
        link: "/contact",
        position: { x: 920, y: 350 },
    },
];

let activeIcon: number | null = null;
let startPos: Position = { x: 0, y: 0 };
let isDragging: boolean = false;
let hasMoved: boolean = false;

// Get container element
const containerRef = document.getElementById('iconsWrapper') as HTMLDivElement;
const backgroundColor = '#ffffff';
const textColor = '#000000';

// Set background color and text color
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('mainContainer') as HTMLDivElement;
    if (container) {
        container.style.backgroundColor = backgroundColor;
        container.style.color = textColor;
    }
    renderIcons();
    attachEventListeners();
});

// Render icons to DOM
function renderIcons(): void {
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
        iconDiv.addEventListener('mousedown', (e) => handleMouseDown(icon.id, e as MouseEvent));
        
        // Add touch start event
        iconDiv.addEventListener('touchstart', (e) => handleTouchStart(icon.id, e as TouchEvent), { passive: false });
        
        // Add click event
        iconDiv.addEventListener('click', (e) => handleIconClick(e as MouseEvent, icon.link));

        iconsWrapper.appendChild(iconDiv);
    });
}

// Handle mouse down to start dragging
function handleMouseDown(id: number, e: MouseEvent): void {
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
function handleTouchStart(id: number, e: TouchEvent): void {
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
function handleMouseMove(e: MouseEvent): void {
    if (activeIcon !== null && isDragging) {
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
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
function handleTouchMove(e: TouchEvent): void {
    if (activeIcon !== null && isDragging) {
        e.preventDefault();
        const deltaX = e.touches[0].clientX - startPos.x;
        const deltaY = e.touches[0].clientY - startPos.y;

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
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
function handleMouseUp(): void {
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
function handleIconClick(e: MouseEvent, link: string): void {
    if (!hasMoved) {
        window.location.href = link;
    } else {
        e.preventDefault();
    }
}

// Attach event listeners
function attachEventListeners(): void {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
}

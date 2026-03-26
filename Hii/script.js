document.addEventListener("DOMContentLoaded", () => {
    // Wait for a short duration to display the fullscreen logo prominently
    setTimeout(() => {
        document.body.classList.add("loaded");
        startHearts(); // Start floating hearts once loaded
        initBook();
    }, 1500); // 1.5 seconds visible on full screen
});

function startHearts() {
    const heartsContainer = document.getElementById("hearts-container");

    // Create a new heart every 600ms
    setInterval(() => {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "❤";

        // Randomize physical properties for a natural effect
        const leftPosition = Math.random() * 100; // 0vw to 100vw
        const animationDuration = Math.random() * 6 + 6; // 6s to 12s float time
        const fontSize = Math.random() * 1.2 + 0.8; // 0.8rem to 2rem

        // Slightly random distribution between the red and blue logo colors
        // Keep them mostly red for the romantic vibe, some blue to match theme
        const colorClass = Math.random() > 0.3 ? "var(--accent-red)" : "var(--accent-blue)";
        const shadowColor = Math.random() > 0.3 ? "rgba(250, 35, 35, 0.4)" : "rgba(28, 124, 152, 0.4)";

        heart.style.left = `${leftPosition}vw`;
        heart.style.animationDuration = `${animationDuration}s`;
        heart.style.fontSize = `${fontSize}rem`;
        heart.style.color = colorClass;
        heart.style.textShadow = `0px 0px 10px ${shadowColor}`;

        heartsContainer.appendChild(heart);

        // Automatically remove the heart element from the DOM after it floats out of view
        setTimeout(() => {
            heart.remove();
        }, animationDuration * 1000);
    }, 600);
}

// Generate romantic hearts spreading outward wherever the user clicks
document.addEventListener("click", (e) => {
    // Wait until the initial loading finishes to show click hearts
    if (!document.body.classList.contains("loaded")) return;

    const heartsContainer = document.getElementById("hearts-container");

    // Generate a beautiful burst of 3 to 5 hearts per click
    const numHearts = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < numHearts; i++) {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "❤";

        // Faster animation for click bursts (3 to 6 seconds)
        const animationDuration = Math.random() * 3 + 3;
        const fontSize = Math.random() * 1.5 + 1; // 1rem to 2.5rem size

        // Theme colors matching logo
        const colorClass = Math.random() > 0.3 ? "var(--accent-red)" : "var(--accent-blue)";
        const shadowColor = Math.random() > 0.3 ? "rgba(250, 35, 35, 0.4)" : "rgba(28, 124, 152, 0.4)";

        // Randomly offset left and right slightly so they burst instead of straight line
        const offsetX = (Math.random() - 0.5) * 80;

        // Position them precisely where the mouse clicked
        heart.style.position = "fixed";
        heart.style.left = `${e.clientX + offsetX}px`;
        heart.style.top = `${e.clientY}px`;
        heart.style.bottom = "auto"; // Override the CSS 'bottom' attribute

        heart.style.animationDuration = `${animationDuration}s`;
        heart.style.fontSize = `${fontSize}rem`;
        heart.style.color = colorClass;
        heart.style.textShadow = `0px 0px 10px ${shadowColor}`;

        heartsContainer.appendChild(heart);

        // Cleanup after floating away
        setTimeout(() => {
            heart.remove();
        }, animationDuration * 1000);
    }
});

function initBook() {
    const book = document.getElementById('ancient-book');
    const bookTransform = document.getElementById('book-transform');
    const bookContainer = document.getElementById('book-container');
    if (!book) return;

    const numLeaves = 15;
    let currentLeaf = 0;
    const thickness = 2; // pixel thickness per leaf

    for (let i = 0; i < numLeaves; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.zIndex = numLeaves - i;

        // Assign physical depth to each leaf to form a solid book
        const zClosed = -i * thickness;
        const zFlipped = - (numLeaves - 1 - i) * thickness;
        leaf.style.transform = `translateZ(${zClosed}px) rotateY(0deg)`;

        const front = document.createElement('div');
        front.className = 'page front';

        const back = document.createElement('div');
        back.className = 'page back page-paper';

        if (i === 0) {
            front.className = 'page front page-cover';
            front.innerHTML = '';
            back.className = 'page back page-cover-inner';
            back.innerHTML = '';
        } else if (i === 1) {
            front.className = 'page front page-paper';
            front.innerHTML = '<img src="ganpati.png" alt="Ganpati Bappa">';
        } else if (i >= 2 && i <= 13) {
            front.className = 'page front page-paper';
            front.innerHTML = `<h1>Letter ${i - 1}</h1>`;
        } else if (i === 14) {
            front.className = 'page front page-paper';
            front.innerHTML = '<h1>Thank You</h1>';

            back.className = 'page back page-cover-back';
            back.innerHTML = '<img src="radhakrishna.png" alt="Radha Krishna" style="max-width: 80%; border-radius:10px; box-shadow:0 0 15px rgba(0,0,0,0.8);">';
        }

        leaf.appendChild(front);
        leaf.appendChild(back);
        book.appendChild(leaf);

        // Detect click vs drag for flipping pages
        let startX, startY;
        leaf.addEventListener('pointerdown', (e) => {
            startX = e.clientX;
            startY = e.clientY;
        });

        leaf.addEventListener('pointerup', (e) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // If it's a small movement, consider it a click to flip
            if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
                if (!leaf.classList.contains('flipped')) {
                    if (i === currentLeaf) {
                        leaf.classList.add('flipped');
                        leaf.style.zIndex = i + 1;
                        leaf.style.transform = `translateZ(${zFlipped}px) rotateY(-180deg)`;
                        currentLeaf++;
                        updateBookPosition();
                    }
                } else {
                    if (i === currentLeaf - 1) {
                        leaf.classList.remove('flipped');
                        leaf.style.zIndex = numLeaves - i;
                        leaf.style.transform = `translateZ(${zClosed}px) rotateY(0deg)`;
                        currentLeaf--;
                        updateBookPosition();
                    }
                }
            }
        });
    }

    // Interactive 360-Degree Rotation & Zoom Logic
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let currentRotX = 5;
    let currentRotY = 0; // Face-on — no side tilt so back cover doesn't peek through
    let currentScale = 1;

    if (bookTransform) {
        bookTransform.style.transform = `scale(${currentScale}) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
    }

    document.addEventListener('pointerdown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
    });

    document.addEventListener('pointermove', (e) => {
        if (!isDragging || !bookTransform) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;

        currentRotY += dx * 0.4;
        currentRotX -= dy * 0.4;

        dragStartX = e.clientX;
        dragStartY = e.clientY;

        bookTransform.style.transform = `scale(${currentScale}) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
    });

    document.addEventListener('pointerup', () => {
        isDragging = false;
    });

    if (bookContainer) {
        bookContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (!bookTransform) return;
            currentScale += e.deltaY * -0.001;
            // Prevent zooming infinitely
            currentScale = Math.min(Math.max(0.4, currentScale), 3.5);
            bookTransform.style.transform = `scale(${currentScale}) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
        }, { passive: false });

        let zoomToggled = false;
        bookContainer.addEventListener('dblclick', () => {
            if (!bookTransform) return;
            zoomToggled = !zoomToggled;
            currentScale = zoomToggled ? 2.5 : 1;
            bookTransform.style.transform = `scale(${currentScale}) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
            bookTransform.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                bookTransform.style.transition = 'transform 0.1s linear';
            }, 300);
        });
    }

    function updateBookPosition() {
        if (currentLeaf === 0) {
            book.className = 'book closed-front';
        } else if (currentLeaf === numLeaves) {
            book.className = 'book closed-back';
        } else {
            book.className = 'book opened';
        }
    }
}

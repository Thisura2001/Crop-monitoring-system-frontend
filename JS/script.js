const texts = [
    "Welcome to the Crop Management System 🙋‍♂️!!",
    "Efficiently manage your fields and crops 🌵",
    "Maximize your agricultural productivity 📊",
    "Track field performance and crop health ✅",
];

let currentIndex = 0;
let intervalId;

// Function to display text with fade animation
function showText(index) {
    const textElement = document.getElementById('swiping-text');

    // Fade out the current text
    textElement.style.opacity = 0;

    setTimeout(() => {
        // Update the text and fade in
        textElement.innerHTML = `${texts[index]} <span id="next-arrow">›</span>`;
        textElement.style.opacity = 1;

        // Add event listener for manual swipe on arrow click
        document.getElementById('next-arrow').onclick = nextText;
    }, 500); // Adjust time for fade out effect
}

// Function to go to the next text in the array
function nextText() {
    currentIndex = (currentIndex + 1) % texts.length;
    showText(currentIndex);
    resetInterval();
}

// Function to start auto-swiping at a set interval
function startAutoSwipe() {
    intervalId = setInterval(nextText, 5000); // Adjust time as needed
}

// Function to reset the auto-swiping interval
function resetInterval() {
    clearInterval(intervalId);
    startAutoSwipe();
}

// Initial display and start auto-swiping
showText(currentIndex);
startAutoSwipe();

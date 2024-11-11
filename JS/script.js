const texts = [
    "Welcome to the Crop Management System.. ",
    "Efficiently manage your fields and crops.. ",
    "Maximize your agricultural productivity..",
    "Track field performance and crop  health ✅",
];

let currentIndex = 0;
let intervalId;

// Function to display text with fade animation
function showText(index) {
    const textElement = document.getElementById('swiping-text');
    textElement.innerHTML = ""; // Clear existing text

    // Create spans for each letter
    texts[index].split("").forEach((letter, i) => {
        const span = document.createElement("span");
        span.innerHTML = letter === " " ? "&nbsp;" : letter; // Preserve spaces
        span.style.opacity = 0; // Initial opacity
        span.style.transition = "opacity 0.5s ease, transform 0.5s ease"; // Add transition for opacity and transform
        span.style.display = "inline-block"; // Ensure spans are inline blocks for spacing
        textElement.appendChild(span);

        // Delay the appearance of each letter
        setTimeout(() => {
            span.style.opacity = 1; // Fade in
            span.style.transform = "translateY(0)"; // Move to original position
        }, i * 100); // Adjust delay timing (100ms) as needed
    });

    // Add event listener for manual swipe on arrow click
    setTimeout(() => {
        document.getElementById('next-arrow').onclick = nextText;
    }, texts[index].length * 100); // Delay adding the event listener until all letters are displayed
}

// Function to go to the next text in the array
function nextText() {
    currentIndex = (currentIndex + 1) % texts.length;
    showText(currentIndex);
    resetInterval();
}

// Function to start auto-swiping at a set interval
function startAutoSwipe() {
    intervalId = setInterval(nextText, 5500); // Adjust time as needed
}

// Function to reset the auto-swiping interval
function resetInterval() {
    clearInterval(intervalId);
    startAutoSwipe();
}

// Initial display and start auto-swiping
showText(currentIndex);
startAutoSwipe();
function selectRole(role) {
    document.getElementById("roleDropdown").textContent = role;
}
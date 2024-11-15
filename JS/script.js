const texts = [
    "Welcome to the Crop Management System.. ",
    "Efficiently manage your fields and crops.. ",
    "Maximize your agricultural productivity..",
    "Track field performance and crop  health ✅",
];

let currentIndex = 0;
let intervalId;

function showText(index) {
    const textElement = document.getElementById('swiping-text');
    textElement.innerHTML = "";

    // Create spans for each letter
    texts[index].split("").forEach((letter, i) => {
        const span = document.createElement("span");
        span.innerHTML = letter === " " ? "&nbsp;" : letter;
        span.style.opacity = 0; // Initial opacity
        span.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        span.style.display = "inline-block";
        textElement.appendChild(span);

        // Delay the appearance of each letter
        setTimeout(() => {
            span.style.opacity = 1;
            span.style.transform = "translateY(0)";
        }, i * 100);
    });
}

function nextText() {
    currentIndex = (currentIndex + 1) % texts.length;
    showText(currentIndex);
    resetInterval();
}

function startAutoSwipe() {
    intervalId = setInterval(nextText, 5500);
}
function resetInterval() {
    clearInterval(intervalId);
    startAutoSwipe();
}

showText(currentIndex);
startAutoSwipe();

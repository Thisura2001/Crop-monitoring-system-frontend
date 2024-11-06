function updateCurrentTime() {
    const currentTimeElement = document.getElementById("currentTime");

    setInterval(() => {
        const now = new Date();

        // Format time as HH:MM:SS
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        // Display the formatted time
        currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000); // Update every 1 second
}

// Initialize the clock
updateCurrentTime();

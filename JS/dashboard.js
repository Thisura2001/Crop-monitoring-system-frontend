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
document.addEventListener("DOMContentLoaded", fetchWeather);

async function fetchWeather() {
    // Mock data for demonstration purposes
    const mockWeather = {
        location: "Agalawatta",
        temperature: 28,
        humidity: 65,
    };

    // Display the weather data
    document.getElementById('locations').textContent = mockWeather.location;
    document.getElementById('temperature').textContent = mockWeather.temperature;
    document.getElementById('humidity').textContent = mockWeather.humidity;

    // Recommend crops based on the temperature and humidity
    const recommendation = getCropRecommendation(mockWeather.temperature, mockWeather.humidity);
    document.getElementById('crop-recommendation').textContent = recommendation;
}

function getCropRecommendation(temperature, humidity) {
    if (temperature > 25 && humidity > 60) {
        return "Rice, Sugarcane";
    } else if (temperature < 20 && humidity < 50) {
        return "Wheat, Barley";
    } else {
        return "Maize, Soybeans";
    }
}
function toggleNav() {
    const navBar = document.getElementById('navBar');
    navBar.classList.toggle('active'); // Toggle visibility
}


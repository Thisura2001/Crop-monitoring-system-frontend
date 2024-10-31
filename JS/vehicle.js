// Get the elements
const addVehicleBtn = document.getElementById('addVehicleBtn');
const vehicleFormCard = document.getElementById('vehicleFormCard');
const closeVehicleFormBtn = document.getElementById('closeVehicleForm');

// Function to show the vehicle form card
addVehicleBtn.addEventListener('click', () => {
    vehicleFormCard.style.display = 'block';
});

// Function to close the vehicle form card
function closeVehicleForm() {
    vehicleFormCard.style.display = 'none';
}

// Close button event
closeVehicleFormBtn.addEventListener('click', closeVehicleForm);

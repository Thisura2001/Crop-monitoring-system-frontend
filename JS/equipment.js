// Get the elements
const addEquipmentBtn = document.getElementById('addEquipmentBtn');
const equipmentFormCard = document.getElementById('equipmentFormCard');
const closeEquipmentFormBtn = document.getElementById('closeEquipmentForm');

// Function to show the equipment form card
addEquipmentBtn.addEventListener('click', () => {
    equipmentFormCard.style.display = 'block';
});

// Function to close the equipment form card
function closeEquipmentForm() {
    equipmentFormCard.style.display = 'none';
}

// Close button event
closeEquipmentFormBtn.addEventListener('click', closeEquipmentForm);

// Get the elements
const addCropBtn = document.getElementById('addCropBtn');
const cropFormCard = document.getElementById('cropFormCard');
const closeCropForm = document.getElementById('closeCropForm'); // Correct ID

// Show the crop card when clicking "Add New Crop"
addCropBtn.addEventListener('click', () => {
    cropFormCard.style.display = 'block';
});

// Close the crop card when clicking the close button
closeCropForm.addEventListener('click', () => {
    cropFormCard.style.display = 'none';
});

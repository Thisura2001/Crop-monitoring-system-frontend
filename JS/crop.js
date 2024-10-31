// Get the elements
const addCropBtn = document.getElementById('addCropBtn');
const cropFormCard = document.getElementById('cropFormCard');
const closeCropCard = document.getElementById('closeCropCard');

// Show the crop card when clicking "Add New Crop"
addCropBtn.addEventListener('click', () => {
    cropFormCard.style.display = 'block';
});

// Hide the crop card when clicking the close button
closeCropCard.addEventListener('click', () => {
    cropFormCard.style.display = 'none';
});

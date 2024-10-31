// Get the elements
const addFieldBtn = document.getElementById('addFieldBtn');
const fieldFormCard = document.getElementById('fieldFormCard');
const closeFieldForm = document.getElementById('closeFieldForm');

// Show the field card when clicking "Add New Field"
addFieldBtn.addEventListener('click', () => {
    fieldFormCard.style.display = 'block';
});

// Hide the field card when clicking the close button
closeFieldForm.addEventListener('click', () => {
    fieldFormCard.style.display = 'none';
});

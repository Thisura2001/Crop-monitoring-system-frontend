// Get the elements for the Staff form
const addStaffBtn = document.getElementById('addStaffBtn');
const staffFormCard = document.getElementById('staffFormCard');
const closeStaffFormBtn = document.getElementById('closeStaffForm');

// Function to show the staff form card
addStaffBtn.addEventListener('click', () => {
    staffFormCard.style.display = 'block';
});

// Function to close the staff form card
function closeStaffForm() {
    staffFormCard.style.display = 'none';
}

// Close button event for staff form
closeStaffFormBtn.addEventListener('click', closeStaffForm);

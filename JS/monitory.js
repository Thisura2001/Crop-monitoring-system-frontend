// Get the elements
const addLogBtn = document.getElementById('addLogBtn');
const logFormCard = document.getElementById('logFormCard');
const closeLogFormBtn = document.getElementById('closeLogForm');

// Function to show the log form card
addLogBtn.addEventListener('click', () => {
    logFormCard.style.display = 'block';
});

// Function to close the log form card
function closeLogForm() {
    logFormCard.style.display = 'none';
}

// Close button event
closeLogFormBtn.addEventListener('click', closeLogForm);

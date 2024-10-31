// JavaScript to toggle the form card
document.getElementById("addCropBtn").addEventListener("click", function() {
    document.getElementById("cropFormCard").style.display = "block";
});

// Handle form submission
document.getElementById("cropForm").addEventListener("submit", function(event) {
    event.preventDefault();
    alert("Crop details saved!");
    // Reset form and hide the card
    this.reset();
    document.getElementById("cropFormCard").style.display = "none";
});
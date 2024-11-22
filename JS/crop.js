// Elements
const addCropBtn = $('#addCropBtn');
const cropFormCard = $('#cropFormCard');
const closeCropForm = $('#closeCropForm');
const corpCardsContainer = $('#corpCardsContainer');
const updateCropModal = $('#updateCropModal');
const closeUpdateCropModalBtn = $('#closeUpdateCropModalBtn');

// Show crop form when clicking "Add New Crop"
addCropBtn.on('click', function () {
    cropFormCard.show();
});

// Hide the crop form when clicking close
closeCropForm.on('click', function () {
    closeCropFormModal();
});

// Function to close crop form modal
function closeCropFormModal() {
    cropFormCard.hide();
}
// Preview image function
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const imgPreview = URL.createObjectURL(file);
        $('#cropImagePreview').attr('src', imgPreview);
    }
}

// Handle crop form submission use ajax here
// Load Field IDs into the Dropdown
function loadFieldIds() {
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/field", // Adjust endpoint to fetch field IDs
        method: "GET",
        success: function (fields) {
            const fieldDropdown = $("#fieldIdInCrop");
            fieldDropdown.empty(); // Clear existing options
            fieldDropdown.append('<option selected disabled value="">Select Field...</option>');

            // Add options dynamically
            fields.forEach(field => {
                fieldDropdown.append(`<option value="${field.fieldId}">${field.fieldId}</option>`);
            });
        },
        error: function () {
            Swal.fire('Error', 'Failed to load field IDs. Please try again.', 'error');
        }
    });
}

// Call the loadFieldIds function on page load
$(document).ready(function () {
    loadFieldIds();
});

// Save Crop Data
$('#cropSaveBtn').on('click', function (e) {
    e.preventDefault();

    const cropCommonName = $('#cropCommonName').val();
    const cropScientificName = $('#cropScientificName').val();
    const cropCategory = $('#cropCategory').val();
    const cropSeason = $('#cropSeason').val();
    const fieldId = $('#fieldIdInCrop').val(); // Get selected field ID
    const cropImageFile = $('#cropImageFile')[0].files[0];

    // Validate required fields
    if (!fieldId) {
        Swal.fire('Error', 'Please select a field.', 'error');
        return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('commonName', cropCommonName);
    formData.append('scientificName', cropScientificName);
    formData.append('category', cropCategory);
    formData.append('season', cropSeason);
    formData.append('fieldId', fieldId);
    if (cropImageFile) {
        formData.append('cropImage', cropImageFile);
    }

    // Send AJAX POST request
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/crop", // Endpoint for saving crops
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            Swal.fire('Success', 'Crop saved successfully!', 'success');

            // Add the new crop card dynamically
            const cropImagePreview = cropImageFile
                ? `<img src="${URL.createObjectURL(cropImageFile)}" class="card-img crop-img" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Crop Image">`
                : '';

            const cropCard = `
                <div class="card mt-3" style="width: 300px; max-height: 500px; overflow-y: auto;">
                    <div class="card-header">
                        <h5>Crop Details</h5>
                    </div>
                    <div class="card-body">
                        ${cropImagePreview}
                        <p><strong>Scientific Name:</strong> ${cropScientificName}</p>
                        <p><strong>Common Name:</strong> ${cropCommonName}</p>
                        <p><strong>Category:</strong> ${cropCategory}</p>
                        <p><strong>Season:</strong> ${cropSeason}</p>
                        <p><strong>Field ID:</strong> ${fieldId}</p>
                        <button class="btn btn-success cropCardUpdateBtn">Update</button>
                        <button class="btn btn-danger cropCardDeleteBtn" id="deleteCrop">Delete</button>
                    </div>
                </div>
            `;

            $('#corpCardsContainer').append(cropCard);
            $('#cropForm')[0].reset(); // Reset form
            $('#cropFormCard').hide(); // Hide form card
        },
        error: function () {
            Swal.fire('Error', 'Failed to save crop data. Please try again.', 'error');
        }
    });
});


// Event listener for Delete  use ajax here
corpCardsContainer.on('click', '.cropCardDeleteBtn', function () {
    const cropCard = $(this).closest('.card'); // Find the closest card to the button

    // Show confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete this crop card?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            cropCard.remove(); // Remove the crop card from DOM
            Swal.fire('Deleted!', 'Your crop card has been deleted.', 'success');
        }
    });
});

// Event listener for Update
corpCardsContainer.on('click', '.cropCardUpdateBtn', function () {
    const cropCard = $(this).closest('.card'); // Find the closest card to the button
    openUpdateCropModal(cropCard); // Open the modal for editing
});


// Open update modal with current card data
function openUpdateCropModal(cropCard) {
    document.updateTargetCropCard = cropCard[0]; // Store the DOM element

    // Populate modal fields
    $('#updateCropCommonName').val(cropCard.find('.crop-common-name').text());
    $('#updateCropScientificName').val(cropCard.find('.crop-scientific-name').text());
    $('#updateCropCategory').val(cropCard.find('.crop-category').text());
    $('#updateCropSeason').val(cropCard.find('.crop-season').text());
    $('#updateFieldId').val(cropCard.find('.crop-field-id').text());

    updateCropModal.show();
}

// Close update modal
closeUpdateCropModalBtn.on('click', function () {
    updateCropModal.hide();
});

// Save updated crop data = use ajax here
$('#saveUpdatedCrop').on('click', function () {
    const cropCard = $(document.updateTargetCropCard); // Use jQuery to wrap the DOM element

    // Update card content with new values
    cropCard.find('.crop-common-name').text($('#updateCropCommonName').val());
    cropCard.find('.crop-scientific-name').text($('#updateCropScientificName').val());
    cropCard.find('.crop-category').text($('#updateCropCategory').val());
    cropCard.find('.crop-season').text($('#updateCropSeason').val());
    cropCard.find('.crop-field-id').text($('#updateFieldId').val());

    // Update image preview if a new one is selected
    const updatedImg = $('#updateCropImg1')[0].files[0];
    if (updatedImg) {
        cropCard.find('.crop-img').attr('src', URL.createObjectURL(updatedImg));
    }

    Swal.fire("Updated!", "Crop details have been updated.", "success");
    updateCropModal.hide();
});

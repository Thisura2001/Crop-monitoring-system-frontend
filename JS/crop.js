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
$("#cropSaveBtn").on("click", function (e) {
    e.preventDefault();

    const cropCommonName = $("#cropCommonName").val();
    const cropScientificName = $("#cropScientificName").val();
    const cropCategory = $("#cropCategory").val();
    const cropSeason = $("#cropSeason").val();
    const fieldId = $("#fieldIdInCrop").val();
    const cropImageFile = $("#cropImageFile")[0].files[0];

    // Validate required fields
    if (!cropCommonName || !cropScientificName || !cropCategory || !cropSeason || !fieldId || !cropImageFile) {
        Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Please fill in all fields and upload an image!",
        });
        return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append("commonName", cropCommonName);
    formData.append("scientificName", cropScientificName);
    formData.append("category", cropCategory);
    formData.append("season", cropSeason);
    formData.append("field", fieldId);
    formData.append("cropImg", cropImageFile);

    // AJAX POST request to save crop
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/crop", // Adjust endpoint
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Show success alert
            Swal.fire({
                icon: "success",
                title: "Crop Saved",
                text: "Crop data has been saved successfully!",
                showConfirmButton: false,
                timer: 1500,
            });

            // Add the new crop card dynamically
            const newCard = `
                <div class="card mt-3" style="width: 300px;">
                    <div class="card-header">
                        <h5>Crop Details</h5>
                    </div>
                    <div class="card-body">
                        <img src="${URL.createObjectURL(cropImageFile)}" class="card-img" style="max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Crop Image">
                        <p><strong>Common Name:</strong> ${cropCommonName}</p>
                        <p><strong>Scientific Name:</strong> ${cropScientificName}</p>
                        <p><strong>Category:</strong> ${cropCategory}</p>
                        <p><strong>Season:</strong> ${cropSeason}</p>
                        <p><strong>Field ID:</strong> ${fieldId}</p>
                        <button class="btn btn-danger cropCardDeleteBtn">Delete</button>
                        <button class="btn btn-primary cropCardUpdateBtn">Update</button>
                    </div>
                </div>
            `;
            $("#corpCardsContainer").append(newCard);

            // Reset form and hide the form card
            $("#cropForm")[0].reset();
            $("#cropFormCard").hide();
        },
        error: function (xhr, status, error) {
            // Handle errors gracefully
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while saving the crop data. Please try again.",
            });
        },
    });
});
// Function to load all crops
$(document).ready(function () {
    // Function to load all crops
    function loadCrops() {
        $.ajax({
            url: "http://localhost:9090/greenShadow/api/v1/crop", // Replace with your API endpoint
            method: "GET",
            dataType: "json",
            success: function (response) {
                renderCrops(response); // Render the crops if the response is successful
            },
            error: function (xhr, status, error) {
                console.error("Error fetching crops:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An error occurred while fetching crop data. Please try again.",
                });
            },
        });
    }

    // Function to render the crops as cards
    function renderCrops(crops) {
        const container = $("#corpCardsContainer");
        container.empty(); // Clear any existing cards

        crops.forEach(function (crop) {
            // Generate card HTML dynamically
            const card = `
                <div class="card mt-3" style="width: 300px;">
                    <div class="card-header">
                        <h5>Crop Details</h5>
                    </div>
                    <div class="card-body">
                        <img src="data:image/jpeg;base64,${crop.cropImg}" class="card-img" style="max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Crop Image">
                        <p><strong>Crop Common Name:</strong> ${crop.commonName || "Not Specified"}</p>
                        <p><strong>Scientific Name:</strong> ${crop.scientificName || "Not Specified"}</p>
                        <p><strong>Category:</strong> ${crop.category || "Not Specified"}</p>
                        <p><strong>Season:</strong> ${crop.season || "Not Specified"}</p>
                        <p><strong>Field ID:</strong> ${crop.field || "Not Specified"}</p>
                        
                        <button class="btn btn-danger CropCardDeleteBtn" data-id="${crop.cropId}">Delete</button>
                        <button class="btn btn-primary CropCardUpdateBtn" data-id="${crop.cropId}">Update</button>
                    </div>
                </div>
            `;
            container.append(card);
        });
    }

    // Call the loadCrops function to fetch and display crops on page load
    loadCrops();
});


// Event listener for Delete  use ajax here
corpCardsContainer.on('click', '.CropCardDeleteBtn', function () {
    console.log("Delete btn clicked");
    const card = $(this).closest(".card");
    const cropId = $(this).data("id");  // Get the field ID from the data-id attribute

    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete this card?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            // Send AJAX DELETE request
            $.ajax({
                url: `http://localhost:9090/greenShadow/api/v1/crop/${cropId}`, // Endpoint for deleting the field
                method: 'DELETE',
                success: function (response) {
                    // If deletion is successful, remove the card from the frontend
                    card.remove();
                    Swal.fire('Deleted!', 'The card has been deleted.', 'success');
                },
                error: function (xhr, status, error) {
                    // If there is an error in deletion, show error message
                    Swal.fire('Error', 'An error occurred while deleting the crop. Please try again.', 'error');
                }
            });
        }
    });
});

// Event listener for Update
// Open update modal with current card data
$(document).ready(function () {
    const updateCropModal = $("#updateCropModal");

    // Open update modal
    $("#corpCardsContainer").on("click", ".CropCardUpdateBtn", function () {
        const card = $(this).closest(".card");

        // Store the target card globally for later reference
        document.updateTargetCropCard = card;

        // Populate modal fields with card data
        const commonName = card.find("p:contains('Common Name:')").text().replace("Common Name: ", "").trim();
        const scientificName = card.find("p:contains('Scientific Name:')").text().replace("Scientific Name: ", "").trim();
        const category = card.find("p:contains('Category:')").text().replace("Category: ", "").trim();
        const season = card.find("p:contains('Season:')").text().replace("Season: ", "").trim();
        const fieldId = card.find("p:contains('Field ID:')").text().replace("Field ID: ", "").trim();

        // Populate modal inputs
        $("#updateCropCommonName").val(commonName);
        $("#updateCropScientificName").val(scientificName);
        $("#updateCropCategory").val(category);
        $("#updateCropSeason").val(season);
        $("#updateFieldId").val(fieldId);

        // Show the modal
        updateCropModal.show();
    });

    // Close update modal
    $("#closeUpdateCropModalBtn").on("click", function () {
        updateCropModal.hide();
    });

    $(".modal-overlay").on("click", function () {
        updateCropModal.hide();
    });

    // Save updated crop data
    $("#saveUpdatedCrop").on("click", function (e) {
        e.preventDefault();

        const cropCard = $(document.updateTargetCropCard);
        const cropId = cropCard.data("id"); // Get crop ID from the card data attribute
        const commonName = $("#updateCropCommonName").val();
        const scientificName = $("#updateCropScientificName").val();
        const category = $("#updateCropCategory").val();
        const season = $("#updateCropSeason").val();
        const fieldId = $("#updateFieldId").val();
        const cropImg = $("#updateCropImg1")[0].files[0]; // Get the new image if any

        // Validate required fields
        if (!commonName || !scientificName || !category || !season || !fieldId) {
            Swal.fire("Validation Error", "Please fill in all fields!", "error");
            return;
        }

        // Prepare FormData for AJAX request
        const formData = new FormData();
        formData.append("commonName", commonName);
        formData.append("scientificName", scientificName);
        formData.append("category", category);
        formData.append("season", season);
        formData.append("field", fieldId);

        if (cropImg) {
            formData.append("cropImg", cropImg);
        }

        // AJAX PUT request to update crop
        $.ajax({
            url: `http://localhost:9090/greenShadow/api/v1/crop/${cropId}`,
            method: "PUT",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                // Update card content with new values
                cropCard.find("p:contains('Common Name:')").text(`Common Name: ${commonName}`);
                cropCard.find("p:contains('Scientific Name:')").text(`Scientific Name: ${scientificName}`);
                cropCard.find("p:contains('Category:')").text(`Category: ${category}`);
                cropCard.find("p:contains('Season:')").text(`Season: ${season}`);
                cropCard.find("p:contains('Field ID:')").text(`Field ID: ${fieldId}`);

                // Update the card image preview if a new image is uploaded
                if (cropImg) {
                    cropCard.find(".crop-img").attr("src", URL.createObjectURL(cropImg));
                }

                Swal.fire("Success", "Crop updated successfully!", "success");
                updateCropModal.hide(); // Close modal
            },
            error: function () {
                Swal.fire("Error", "Failed to update the crop. Please try again.", "error");
            }
        });
    });
});

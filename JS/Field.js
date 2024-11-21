// Elements
const addFieldBtn = $('#addFieldBtn');
const fieldFormCard = $('#fieldFormCard');
const closeFieldForm = $('#closeFieldForm');
const closeUpdateModalBtn = $('#closeUpdateModalBtn');
const fieldCardsContainer = $('#fieldCardsContainer');
const updateFieldModal = $('#updateFieldModal');

// Show the field card when clicking "Add New Field"
addFieldBtn.on('click', () => {
    fieldFormCard.show();
});

// Hide the field card when clicking the close button
closeFieldForm.on('click', () => {
    fieldFormCard.hide();
});

// Close the field form modal function
function closeFiledForm() {
    fieldFormCard.hide();
}
// Function to handle form submission
$("#fieldSaveBtn").on("click", function (e) {
    e.preventDefault();

    const fieldName = $("#fieldName").val();
    const location = $("#location").val();
    const extent = $("#extent").val();
    const fieldImg1 = $("#fieldImg01")[0].files[0];
    const fieldImg2 = $("#fieldImg02")[0].files[0];

    if (fieldImg1) {
        console.log("Field Image 1:", fieldImg1);
    }
    if (fieldImg2) {
        console.log("Field Image 2:", fieldImg2);
    }

    if (!fieldName || !location || !extent || !fieldImg1 || !fieldImg2) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please fill in all fields and select both images!',
        });
        return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("fieldName", fieldName);
    formData.append("location", location);
    formData.append("extend", extent);
    formData.append("fieldImg1", fieldImg1);
    formData.append("fieldImg2", fieldImg2);

    // AJAX request
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/field", // Adjust the endpoint if necessary
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Display success message
            Swal.fire({
                icon: 'success',
                title: 'Field Saved',
                text: 'Field data has been saved successfully!',
                showConfirmButton: false,
                timer: 1500,
            });

            // Optionally display the added field in the frontend
            const newCard = `
                <div class="card mt-3" style="width: 300px;">
                    <div class="card-header">
                        <h5>Field Details</h5>
                    </div>
                    <div class="card-body">
                        <img src="${URL.createObjectURL(fieldImg1)}" class="card-img" style="max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Image 1">
                        <img src="${URL.createObjectURL(fieldImg2)}" class="card-img" style="max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Image 2">
                        <p><strong>Field Name:</strong> ${fieldName}</p>
                        <p><strong>Location:</strong> ${location}</p>
                        <p><strong>Extent Size:</strong> ${extent}</p>
                        <button class="btn btn-danger FieldCardDeleteBtn">Delete</button>
                        <button class="btn btn-primary fieldCardUpdateBtn">Update</button>
                    </div>
                </div>
            `;
            $("#fieldCardsContainer").append(newCard);

            // Reset the form
            $("#FieldForm")[0].reset();
        },
        error: function (xhr, status, error) {
            // Display error message
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while saving the field data. Please try again.',
            });
        },
    });
});

$(document).ready(function () {
    // Function to load all fields
    function loadFields() {
        $.ajax({
            url: "http://localhost:9090/greenShadow/api/v1/field", // Replace with your API endpoint
            method: "GET",
            dataType: "json",
            success: function (response) {
                renderFields(response); // Render the fields if the response is successful
            },
            error: function (xhr, status, error) {
                console.error("Error fetching fields:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An error occurred while fetching field data. Please try again.",
                });
            },
        });
    }

    // Function to render the fields as cards
    function renderFields(fields) {
        const container = $("#fieldCardsContainer");
        container.empty(); // Clear any existing cards

        fields.forEach(function (field) {
            // Generate card HTML dynamically
            const card = `
                <div class="card mt-3" style="width: 300px;">
                    <div class="card-header">
                        <h5>Field Details</h5>
                    </div>
                    <div class="card-body">
                        <img src="data:image/jpeg;base64,${field.fieldImg1}" class="card-img" style="max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Image 1">
                        <img src="data:image/jpeg;base64,${field.fieldImg2}" class="card-img" style="max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Image 2">
                        <p><strong>Field ID:</strong> ${field.fieldId || "Not Specified"}</p> 
                        <p><strong>Field Name:</strong> ${field.fieldName || "Not Specified"}</p>
                        <p><strong>Location:</strong> ${field.location || "Not Specified"}</p>
                        <p><strong>Extent:</strong> ${field.extend || "Not Specified"}</p>
                        
                        <button class="btn btn-danger FieldCardDeleteBtn" data-id="${field.fieldId}">Delete</button>
                        <button class="btn btn-primary FieldCardUpdateBtn" data-id="${field.id}">Update</button>
                    </div>
                </div>
            `;
            container.append(card);
        });
    }

    // Fetch all fields on page load
    loadFields();
});

// Event listener for delete and update buttons with event delegation
fieldCardsContainer.on("click", ".FieldCardDeleteBtn", function () {
    console.log("Delete btn clicked");
    const card = $(this).closest(".card");
    const fieldId = $(this).data("id");  // Get the field ID from the data-id attribute

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
                url: `http://localhost:9090/greenShadow/api/v1/field/${fieldId}`, // Endpoint for deleting the field
                method: 'DELETE',
                success: function (response) {
                    // If deletion is successful, remove the card from the frontend
                    card.remove();
                    Swal.fire('Deleted!', 'The card has been deleted.', 'success');
                },
                error: function (xhr, status, error) {
                    // If there is an error in deletion, show error message
                    Swal.fire('Error', 'An error occurred while deleting the field. Please try again.', 'error');
                }
            });
        }
    });
});
$(document).ready(function () {
    const updateFieldModal = $("#updateFieldModal");

    // Open update modal
    $("#fieldCardsContainer").on("click", ".FieldCardUpdateBtn", function () {
        console.log("Update button clicked");
        const card = $(this).closest(".card");

        // Store the target card globally for later reference
        document.updateTargetCard = card;

        // Populate modal fields with card data
        $("#updateName").val(card.find("p:contains('Field Name:')").text().replace("Field Name: ", "").trim());
        $("#updateLocation").val(card.find("p:contains('Location:')").text().replace("Location: ", "").trim());
        $("#updateExtent").val(card.find("p:contains('Extent:')").text().replace("Extent: ", "").trim());

        // Show the modal
        updateFieldModal.show();
    });

    // Close update modal
    $("#closeUpdateModalBtn, .modal-overlay").on("click", function () {
        closeUpdateModal();
    });

    // Save updated data and send AJAX request
    $("#saveUpdatedField").on("click", function (e) {
        e.preventDefault();
        const card = document.updateTargetCard;

        // Get updated values from the modal
        const updatedField = {
            name: $("#updateName").val(),
            location: $("#updateLocation").val(),
            extent: $("#updateExtent").val(),
        };

        const fieldId = card.find(".FieldCardUpdateBtn").data("id"); // Get the ID of the field

        // Send AJAX request to update the field in the backend
        $.ajax({
            url: `http://localhost:9090/greenShadow/api/v1/field/${fieldId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedField),
            success: function (response) {
                // Update card content with new values
                card.find("p:contains('Field Name:')").text(`Field Name: ${updatedField.name}`);
                card.find("p:contains('Location:')").text(`Location: ${updatedField.location}`);
                card.find("p:contains('Extent:')").text(`Extent: ${updatedField.extent}`);

                Swal.fire("Update Successful!", "Field details have been updated.", "success");
                closeUpdateModal();
            },
            error: function (xhr, status, error) {
                Swal.fire("Error", "An error occurred while updating the field. Please try again.", "error");
            },
        });
    });

    // Function to close the update modal
    function closeUpdateModal() {
        updateFieldModal.hide();
    }
});

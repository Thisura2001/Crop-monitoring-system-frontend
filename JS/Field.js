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
                        <button class="btn btn-primary FieldCardUpdateBtn" data-id="${field.fieldId}">Update</button>
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

let editingFieldId = null;
$(document).ready(function () {
    const updateFieldModal = $("#updateFieldModal");

    // Open update modal
    $("#fieldCardsContainer").on("click", ".FieldCardUpdateBtn", function () {
        console.log("Update button clicked");
        const card = $(this).closest(".card");

        editingFieldId = $(this).data("id");
        // Store the target card globally for later reference
        document.updateTargetCard = card;

        // Populate modal fields with card data
        const fieldName = card.find("p:contains('Field Name:')").text().replace("Field Name: ", "").trim();
        const location = card.find("p:contains('Location:')").text().replace("Location: ", "").trim();
        const extent = card.find("p:contains('Extent:')").text().replace("Extent: ", "").trim();

        // Populate the fields in the modal
        $("#updateName").val(fieldName);
        $("#updateLocation").val(location);
        $("#updateExtent").val(extent);

        // Show the modal
        updateFieldModal.show();
    });

    // Close update modal
    $("#closeUpdateModalBtn, .modal-overlay").on("click", function () {
        closeUpdateModal();
    });

// Handle the update field functionality
    $("#saveUpdatedField").on("click", function (e) {
        e.preventDefault();
        const fieldId = $(this).data("id");

        const fieldName = $("#updateName").val();
        console.log(fieldName);
        const fieldLocation = $("#updateLocation").val();
        const fieldExtend = $("#updateExtent").val();
        let fieldImg1 = $("#updateFieldImg1")[0].files[0];
        let fieldImg2 = $("#updateFieldImg2")[0].files[0];

// Prepare FormData object for image upload
        const formData = new FormData();
        formData.append("fieldName", fieldName);
        formData.append("location", fieldLocation);
        formData.append("extend", fieldExtend);

// Append files if they are selected
        if (fieldImg1) {
            formData.append("fieldImg1", fieldImg1);
        }

        if (fieldImg2) {
            formData.append("fieldImg2", fieldImg2);
        }


        // Send the update request
        $.ajax({
            url: `http://localhost:9090/greenShadow/api/v1/field/`+editingFieldId,  // Endpoint for updating the field
            method: 'PUT',
            data: formData,
            processData: false,  // Important for sending FormData
            contentType: false,  // Let the browser set the correct content type
            success: function (response) {
                // Update the field card with the new values
                const card = $(`.card[data-id="${fieldId}"]`);  // Find the field card by ID
                card.find(".card-body p:nth-child(3)").text(`Location: ${fieldLocation}`);
                card.find(".card-body p:nth-child(4)").text(`Extent: ${fieldExtend}`);

                // If images are updated, update image previews
                if (fieldImg1) {
                    card.find(".card-img:first").attr("src", URL.createObjectURL(fieldImg1));
                }
                if (fieldImg2) {
                    card.find(".card-img:last").attr("src", URL.createObjectURL(fieldImg2));
                }

                // Show success alert
                Swal.fire('Success', 'Field updated successfully!', 'success');
                $("#updateFieldModal").modal("hide");  // Close the modal
            },
            error: function () {
                Swal.fire('Error', 'An error occurred while updating the field.', 'error');
            }
        });
    });



    // Function to close the update modal
    function closeUpdateModal() {
        updateFieldModal.hide();
    }
});

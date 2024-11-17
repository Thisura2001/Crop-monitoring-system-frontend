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
                        <p><strong>Field Name:</strong> ${field.fieldName || "Not Specified"}</p>
                        <p><strong>Location:</strong> ${field.location || "Not Specified"}</p>
                        <p><strong>Extent:</strong> ${field.extend || "Not Specified"}</p>
                        
                        <button class="btn btn-danger FieldCardDeleteBtn" data-id="${field.id}">Delete</button>
                        <button class="btn btn-primary FieldCardUpdateBtn" data-id="${field.id}">Update</button>
                    </div>
                </div>
            `;
            container.append(card); // Append card to container
        });

        // // Attach event listeners to dynamically created buttons
        // $(".FieldCardDeleteBtn").on("click", function () {
        //     const fieldId = $(this).data("id");
        //     deleteField(fieldId); // Call delete function
        // });
        //
        // $(".FieldCardUpdateBtn").on("click", function () {
        //     const fieldId = $(this).data("id");
        //     updateField(fieldId); // Call update function
        // });
    }

    // Fetch all fields on page load
    loadFields();
});


// Function to handle form submission
$("#fieldSaveBtn").on("click", function (e) {
    e.preventDefault();

    // Collect form values
    const fieldName = $("#fieldName").val();
    const location = $("#location").val();
    const extent = $("#extent").val();
    // Get the file objects
    const fieldImg1 = $("#fieldImg01")[0].files[0]; // Access the first file for fieldImg01
    const fieldImg2 = $("#fieldImg02")[0].files[0]; // Access the first file for fieldImg02

// Check if files are selected
    if (fieldImg1) {
        console.log("Field Image 1:", fieldImg1);
    }
    if (fieldImg2) {
        console.log("Field Image 2:", fieldImg2);
    }


    // Validate inputs
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
        processData: false, // Required for FormData
        contentType: false, // Required for FormData
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


// Event listener for delete and update buttons with event delegation
fieldCardsContainer.on("click", ".FieldCardDeleteBtn", function () {
    const card = $(this).closest(".card");
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
            card.remove();
            Swal.fire('Deleted!', 'The card has been deleted.', 'success');
        }
    });
});

// Handle Update button
fieldCardsContainer.on("click", ".fieldCardUpdateBtn", function () {
    const card = $(this).closest(".card");
    openUpdateModal(card);
});

// Function to open the update modal and populate it with the current card data
function openUpdateModal(card) {
    document.updateTargetCard = card;

    // Populate modal fields with current card data
    $("#updateCode").val(card.find(".field-code").text());
    $("#updateName").val(card.find(".field-name").text());
    $("#updateLocation").val(card.find(".field-location").text());
    $("#updateExtent").val(card.find(".field-extent").text());

    // Show the modal
    updateFieldModal.show();
}

// Close update modal
closeUpdateModalBtn.on("click", function () {
    updateFieldModal.hide();
});

// Function to save updated data to the card
$("#saveUpdatedField").on('click', function () {
    const card = document.updateTargetCard;

    // Update card content with new values from the modal
    card.find(".field-code").text($("#updateCode").val());
    card.find(".field-name").text($("#updateName").val());
    card.find(".field-location").text($("#updateLocation").val());
    card.find(".field-extent").text($("#updateExtent").val());

    // Handle image updates
    const img1 = $("#updateFieldImg1")[0].files[0];
    const img2 = $("#updateFieldImg2")[0].files[0];

    if (img1) {
        const img1Preview = `<img src="${URL.createObjectURL(img1)}" class="card-img field-img1" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Field Image 1">`;
        card.find(".field-img1").replaceWith(img1Preview);
    }
    if (img2) {
        const img2Preview = `<img src="${URL.createObjectURL(img2)}" class="card-img field-img2" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Field Image 2">`;
        card.find(".field-img2").replaceWith(img2Preview);
    }

    // Show success message using SweetAlert
    Swal.fire("Update Successful!", "Field details have been updated.", "success");

    // Close the modal
    closeUpdateModal();
});

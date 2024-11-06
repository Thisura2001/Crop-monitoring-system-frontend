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
$("#fieldSaveBtn").on('click', function (e) {
    e.preventDefault();

    // Get form field values
    const code = $("#filedCode").val();
    const name = $("#fieldName").val();
    const location = $("#location").val();
    const extent = $("#extent").val();
    const staff = $("#cmbStaffId option:selected").text();
    const crop = $("#cmbCropId option:selected").text();

    // Get the uploaded images and create previews
    const img1 = $("#fieldImg01")[0].files[0];
    const img2 = $("#fieldImg02")[0].files[0];
    let img1Preview = '', img2Preview = '';

    if (img1) {
        img1Preview = `<img src="${URL.createObjectURL(img1)}" class="card-img field-img1" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Field Image 1">`;
    }

    if (img2) {
        img2Preview = `<img src="${URL.createObjectURL(img2)}" class="card-img field-img2" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Field Image 2">`;
    }

    // Create a new card
    const card = $(`
        <div class="card mt-3" style="width: 300px; max-height: 500px; overflow-y: auto;">
            <div class="card-header">
                <h5>Field Details</h5>
            </div>
            <div class="card-body">
                ${img1Preview}
                ${img2Preview}
                <p><strong>Code:</strong> <span class="field-code">${code}</span></p>
                <p><strong>Name:</strong> <span class="field-name">${name}</span></p>
                <p><strong>Location:</strong> <span class="field-location">${location}</span></p>
                <p><strong>Extent Size:</strong> <span class="field-extent">${extent}</span></p>
                <p><strong>Staff:</strong> <span class="field-staff">${staff}</span></p>
                <button class="btn btn-success fieldCardUpdateBtn">Update</button>
                <button class="btn btn-danger FieldCardDeleteBtn">Delete</button>
            </div>
        </div>
    `);

    // Append the new card to the container
    fieldCardsContainer.append(card);

    // Reset the form and close it if necessary
    $("#FieldForm")[0].reset();
    closeFiledForm();
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
    document.updateTargetCard = card; // Store reference to the target card for updating

    // Populate modal fields with current card data
    $("#updateCode").val(card.find(".field-code").text());
    $("#updateName").val(card.find(".field-name").text());
    $("#updateLocation").val(card.find(".field-location").text());
    $("#updateExtent").val(card.find(".field-extent").text());
    $("#updateStaff").val(card.find(".field-staff").text());
    // $("#updateCrop").val(card.find(".field-crop").text());

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
    card.find(".field-staff").text($("#updateStaff").val());
    // card.find(".field-crop").text($("#updateCrop").val());

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

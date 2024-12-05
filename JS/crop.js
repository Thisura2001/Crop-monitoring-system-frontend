
const addCropBtn = $('#addCropBtn');
const cropFormCard = $('#cropFormCard');
const closeCropForm = $('#closeCropForm');
const corpCardsContainer = $('#corpCardsContainer');
const updateCropModal = $('#updateCropModal');
const closeUpdateCropModalBtn = $('#closeUpdateCropModalBtn');

addCropBtn.on('click', function () {
    cropFormCard.show();
});

closeCropForm.on('click', function () {
    closeCropFormModal();
});

function closeCropFormModal() {
    cropFormCard.hide();
}
function loadFieldIds() {
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/field",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (fields) {
            const fieldDropdown = $("#fieldIdInCrop");
            fieldDropdown.empty(); // Clear existing options
            fieldDropdown.append('<option selected disabled value="">Select Field...</option>');

            fields.forEach(field => {

                fieldDropdown.append(`<option value="${field.fieldId}">${field.fieldId}</option>`);
            });
        },
        error: function () {
            Swal.fire('Error', 'Failed to load field IDs. Please try again.', 'error');
        }
    });
}

$(document).ready(function () {
    loadFieldIds();
    loadCrops();
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

    if (!cropCommonName || !cropScientificName || !cropCategory || !cropSeason || !fieldId || !cropImageFile) {
        Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Please fill in all fields !",
        });
        return;
    }

    const formData = new FormData();
    formData.append("commonName", cropCommonName);
    formData.append("scientificName", cropScientificName);
    formData.append("category", cropCategory);
    formData.append("season", cropSeason);
    formData.append("field", fieldId);
    formData.append("cropImg", cropImageFile);

    // AJAX POST request to save crop
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/crop",
        type: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
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
            loadCrops();
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while saving the crop data. Please try again.",
            });
        },
    });
});
function loadCrops() {
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/crop",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        dataType: "json",
        success: function (response) {
            renderCrops(response);
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
                        <p><strong>Crop ID:</strong> ${crop.cropId || "Not Specified"}</p>
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
loadCrops();

corpCardsContainer.on('click', '.CropCardDeleteBtn', function () {
    console.log("Delete btn clicked");
    const card = $(this).closest(".card");
    const cropId = $(this).data("id");

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
                url: `http://localhost:9090/greenShadow/api/v1/crop/${cropId}`,
                method: 'DELETE',
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                success: function (response) {
                    card.remove();
                    Swal.fire('Deleted!', 'The card has been deleted.', 'success');
                },
                error: function (xhr, status, error) {
                    Swal.fire('Error', 'An error occurred while deleting the crop. Please try again.', 'error');
                }
            });
        }
    });
});

// Open update modal with current card data
$(document).ready(function () {
    $("#addCropBtn").on("click", function () {
        $("#cropFormCard").show();
    });

    $("#closeCropForm").on("click", function () {
        $("#cropFormCard").hide();
        $("#cropForm")[0].reset();
    });

    function closeUpdateCropModal() {
        $("#updateCropModal").hide();
    }
    $("#closeUpdateCropModalBtn").on("click", closeUpdateCropModal);

    let editCropId = null;
    $("#corpCardsContainer").on("click", ".CropCardUpdateBtn", function () {
        const card = $(this).closest(".card");
        editCropId = card.data("id");

        editCropId = $(this).data("id");
        $("#updateCropCommonName").val(card.find("p:contains('Common Name:')").text().replace("Common Name: ", "").trim());
        $("#updateCropScientificName").val(card.find("p:contains('Scientific Name:')").text().replace("Scientific Name: ", "").trim());
        $("#updateCropCategory").val(card.find("p:contains('Category:')").text().replace("Category: ", "").trim());
        $("#updateCropSeason").val(card.find("p:contains('Season:')").text().replace("Season: ", "").trim());
        $("#updateFieldId").val(card.find("p:contains('Field ID:')").text().replace("Field ID: ", "").trim());

        $("#saveUpdatedCrop").off("click").on("click", function () {
            const commonName = $("#updateCropCommonName").val();
            const scientificName = $("#updateCropScientificName").val();
            const category = $("#updateCropCategory").val();
            const season = $("#updateCropSeason").val();
            const fieldId = $("#updateFieldId").val();
            const cropImgInput = $("#updateCropImg1")[0];
            const cropImg = cropImgInput.files.length > 0 ? cropImgInput.files[0] : null;

            const formData = new FormData();
            formData.append("commonName", commonName);
            formData.append("scientificName", scientificName);
            formData.append("category", category);
            formData.append("season", season);
            formData.append("field", fieldId);
            if (cropImg) {
                formData.append("cropImg", cropImg);
            }

            // AJAX request to update crop data
            $.ajax({
                url: `http://localhost:9090/greenShadow/api/v1/crop/`+ editCropId,
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                    card.find("p:contains('Common Name:')").text(`Common Name: ${commonName}`);
                    card.find("p:contains('Scientific Name:')").text(`Scientific Name: ${scientificName}`);
                    card.find("p:contains('Category:')").text(`Category: ${category}`);
                    card.find("p:contains('Season:')").text(`Season: ${season}`);
                    card.find("p:contains('Field ID:')").text(`Field ID: ${fieldId}`);
                    if (cropImg) {
                        card.find(".crop-img").attr("src", URL.createObjectURL(cropImg));
                    }
                    Swal.fire("Success", "Crop updated successfully!", "success");
                    closeUpdateCropModal();
                },
                error: function () {
                    Swal.fire("Error", "Failed to update crop. Please try again.", "error");
                }
            });
        });

        $("#updateCropModal").show();
    });
});


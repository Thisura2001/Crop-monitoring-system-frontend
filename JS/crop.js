// Elements
const addCropBtn = document.getElementById('addCropBtn');
const cropFormCard = document.getElementById('cropFormCard');
const closeCropForm = document.getElementById('closeCropForm');
const corpCardsContainer = document.getElementById("corpCardsContainer");
const updateCropModal = document.getElementById("updateCropModal");
const closeUpdateCropModalBtn = document.getElementById("closeUpdateCropModalBtn");

// Show crop form when clicking "Add New Crop"
addCropBtn.addEventListener('click', () => {
    cropFormCard.style.display = 'block';
});

// Hide the crop form when clicking close
closeCropForm.addEventListener('click', () => {
    cropFormCard.style.display = 'none';
});

// Function to close crop form modal
function closeCropFormModal() {
    cropFormCard.style.display = "none";
}

// Preview image function
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const imgPreview = URL.createObjectURL(file);
        document.getElementById("cropImagePreview").src = imgPreview;
    }
}

// Handle crop form submission
$("#cropForm").on('submit', function (e) {
    e.preventDefault();

    // Get form data
    const cropCode = document.getElementById("cropCode").value;
    const cropCommonName = document.getElementById("cropCommonName").value;
    const cropScientificName = document.getElementById("cropScientificName").value;
    const cropCategory = document.getElementById("cropCategory").value;
    const cropSeason = document.getElementById("cropSeason").value;
    const fieldId = document.getElementById("fieldId").value;
    const cropImageFile = document.getElementById("cropImageFile").files[0];
    let cropImagePreview = "";

    if (cropImageFile) {
        cropImagePreview = `<img src="${URL.createObjectURL(cropImageFile)}" class="card-img crop-img" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Crop Image">`;
    }

    // Create crop card
    const cropCard = document.createElement("div");
    cropCard.className = "card mt-3";
    cropCard.style.width = "300px";
    cropCard.style.maxHeight = "500px";
    cropCard.style.overflowY = "auto";
    cropCard.innerHTML = `
        <div class="card-header">
            <h5>${cropCommonName}</h5>
        </div>
        <div class="card-body">
            ${cropImagePreview}
            <p><strong>Code:</strong> <span class="crop-code">${cropCode}</span></p>
            <p><strong>Scientific Name:</strong> <span class="crop-scientific-name">${cropScientificName}</span></p>
            <p><strong>Category:</strong> <span class="crop-category">${cropCategory}</span></p>
            <p><strong>Season:</strong> <span class="crop-season">${cropSeason}</span></p>
            <p><strong>Field ID:</strong> <span class="crop-field-id">${fieldId}</span></p>
            <button class="btn btn-success cropCardUpdateBtn">Update</button>
            <button class="btn btn-danger cropCardDeleteBtn">Delete</button>
        </div>
    `;

    corpCardsContainer.appendChild(cropCard);
    document.getElementById("cropForm").reset();
    closeCropFormModal();
});

// Event listener for delete and update
corpCardsContainer.addEventListener("click", function (e) {
    const cropCard = e.target.closest(".card");

    // Delete button
    if (e.target.classList.contains("cropCardDeleteBtn")) {
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
                cropCard.remove();
                Swal.fire('Deleted!', 'Your crop card has been deleted.', 'success');
            }
        });
    }

    // Update button
    if (e.target.classList.contains("cropCardUpdateBtn")) {
        openUpdateCropModal(cropCard);
    }
});

// Open update modal with current card data
function openUpdateCropModal(cropCard) {
    document.updateTargetCropCard = cropCard;

    // Populate modal fields
    document.getElementById("updateCropCode").value = cropCard.querySelector(".crop-code").textContent;
    document.getElementById("updateCropCommonName").value = cropCard.querySelector("h5").textContent;
    document.getElementById("updateCropScientificName").value = cropCard.querySelector(".crop-scientific-name").textContent;
    document.getElementById("updateCropCategory").value = cropCard.querySelector(".crop-category").textContent;
    document.getElementById("updateCropSeason").value = cropCard.querySelector(".crop-season").textContent;
    document.getElementById("updateFieldId").value = cropCard.querySelector(".crop-field-id").textContent;

    updateCropModal.style.display = "block";
}

// Close update modal
closeUpdateCropModalBtn.addEventListener("click", function () {
    updateCropModal.style.display = "none";
});

// Save updated crop data
$("#saveUpdatedCrop").on('click', function () {
    const cropCard = document.updateTargetCropCard;

    // Update card content with new values
    cropCard.querySelector(".crop-code").textContent = document.getElementById("updateCropCode").value;
    cropCard.querySelector("h5").textContent = document.getElementById("updateCropCommonName").value;
    cropCard.querySelector(".crop-scientific-name").textContent = document.getElementById("updateCropScientificName").value;
    cropCard.querySelector(".crop-category").textContent = document.getElementById("updateCropCategory").value;
    cropCard.querySelector(".crop-season").textContent = document.getElementById("updateCropSeason").value;
    cropCard.querySelector(".crop-field-id").textContent = document.getElementById("updateFieldId").value;

    // Update image preview if a new one is selected
    const updatedImg = document.getElementById("updateCropImg1").files[0];
    if (updatedImg) {
        cropCard.querySelector(".crop-img").src = URL.createObjectURL(updatedImg);
    }

    Swal.fire("Updated!", "Crop details have been updated.", "success");
    updateCropModal.style.display = "none";
});

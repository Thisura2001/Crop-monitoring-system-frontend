// Get the elements
const addFieldBtn = document.getElementById('addFieldBtn');
const fieldFormCard = document.getElementById('fieldFormCard');
const closeFieldForm = document.getElementById('closeFieldForm');
const closeUpdateModalBtn = document.getElementById('closeUpdateModalBtn');

// Show the field card when clicking "Add New Field"
addFieldBtn.addEventListener('click', () => {
    fieldFormCard.style.display = 'block';
});

// Hide the field card when clicking the close button
closeFieldForm.addEventListener('click', () => {
    fieldFormCard.style.display = 'none';
});

///////////////////////////////////////////////////

// Close the field form modal function
function closeFiledForm() {
    document.getElementById("fieldFormCard").style.display = "none";
}

// Function to handle form submission
$("#fieldSaveBtn").on('click',function (e) {
    e.preventDefault();

    // Get form field values
    const code = document.getElementById("filedCode").value;
    const name = document.getElementById("fieldName").value;
    const location = document.getElementById("location").value;
    const extent = document.getElementById("extent").value;
    const staff = document.getElementById("cmbStaffId").selectedOptions[0].text;
    const crop = document.getElementById("cmbCropId").selectedOptions[0].text;

    // Get the uploaded images and create previews
    const img1 = document.getElementById("fieldImg01").files[0];
    const img2 = document.getElementById("fieldImg02").files[0];
    let img1Preview = '', img2Preview = '';

    if (img1) {
        img1Preview = `<img src="${URL.createObjectURL(img1)}" class="card-img field-img1" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Field Image 1">`;
    }

    if (img2) {
        img2Preview = `<img src="${URL.createObjectURL(img2)}" class="card-img field-img2" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Field Image 2">`;
    }

    // Create a new card
    const card = document.createElement("div");
    card.className = "card mt-3";
    card.style.width = "300px";
    card.style.maxHeight = "500px";
    card.style.overflowY = "auto";
    card.innerHTML = `
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
            <p><strong>Crop:</strong> <span class="field-crop">${crop}</span></p>
            <button class="btn btn-success fieldCardUpdateBtn">Update</button>
            <button class="btn btn-danger FieldCardDeleteBtn">Delete</button>
        </div>
    `;

    // Append the new card to the container
    document.getElementById("fieldCardsContainer").appendChild(card);

    // Reset the form and close it if necessary
    document.getElementById("FieldForm").reset();
    closeFiledForm();
});

// Event listener for delete and update buttons with event delegation
document.getElementById("fieldCardsContainer").addEventListener("click", function (e) {
    const card = e.target.closest(".card");

    // Handle Delete button
    if (e.target.classList.contains("FieldCardDeleteBtn")) {
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
    }

    // Handle Update button
    if (e.target.classList.contains("fieldCardUpdateBtn")) {
        openUpdateModal(card);
    }
});

// Function to open the update modal and populate it with the current card data
function openUpdateModal(card) {
    document.updateTargetCard = card; // Store reference to the target card for updating

    // Populate modal fields with current card data
    document.getElementById("updateCode").value = card.querySelector(".field-code").textContent;
    document.getElementById("updateName").value = card.querySelector(".field-name").textContent;
    document.getElementById("updateLocation").value = card.querySelector(".field-location").textContent;
    document.getElementById("updateExtent").value = card.querySelector(".field-extent").textContent;
    document.getElementById("updateStaff").value = card.querySelector(".field-staff").textContent;
    document.getElementById("updateCrop").value = card.querySelector(".field-crop").textContent;

    // Show the modal
    document.getElementById("updateFieldModal").style.display = "block";
}

// Close update modal
closeUpdateModalBtn.addEventListener("click", function () {
    document.getElementById("updateFieldModal").style.display = "none";
})

// Function to save updated data to the card
$("#saveUpdatedField").on('click', function () {
    const card = document.updateTargetCard;

    // Update card content with new values from the modal
    card.querySelector(".field-code").textContent = document.getElementById("updateCode").value;
    card.querySelector(".field-name").textContent = document.getElementById("updateName").value;
    card.querySelector(".field-location").textContent = document.getElementById("updateLocation").value;
    card.querySelector(".field-extent").textContent = document.getElementById("updateExtent").value;
    card.querySelector(".field-staff").textContent = document.getElementById("updateStaff").value;
    card.querySelector(".field-crop").textContent = document.getElementById("updateCrop").value;

    // Handle image updates
    const img1 = document.getElementById("updateFieldImg1").files[0];
    const img2 = document.getElementById("updateFieldImg2").files[0];

    if (img1) {
        const img1Preview = `<img src="${URL.createObjectURL(img1)}" class="card-img" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Field Image 1">`;
        card.querySelector(".field-img1").innerHTML = img1Preview;
    }
    if (img2) {
        const img2Preview = `<img src="${URL.createObjectURL(img2)}" class="card-img" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Field Image 2">`;
        card.querySelector(".field-img2").innerHTML = img2Preview;
    }

    // Show success message using SweetAlert
    Swal.fire("Update Successful!", "Field details have been updated.", "success");

    // Close the modal
    closeUpdateModal();
});

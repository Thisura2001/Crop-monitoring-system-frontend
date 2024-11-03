// Get the elements
const addFieldBtn = document.getElementById('addFieldBtn');
const fieldFormCard = document.getElementById('fieldFormCard');
const closeFieldForm = document.getElementById('closeFieldForm');

// Show the field card when clicking "Add New Field"
addFieldBtn.addEventListener('click', () => {
    fieldFormCard.style.display = 'block';
});

// Hide the field card when clicking the close button
closeFieldForm.addEventListener('click', () => {
    fieldFormCard.style.display = 'none';
});

///////////////////////////////////////////////////

function closeFiledForm() {
    document.getElementById("fieldFormCard").style.display = "none";
}

// Function to handle form submission
document.getElementById("FieldForm").addEventListener("submit", function (e) {
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
        img1Preview = `<img src="${URL.createObjectURL(img1)}" class="card-img" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Field Image 1">`;
    }

    if (img2) {
        img2Preview = `<img src="${URL.createObjectURL(img2)}" class="card-img" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Field Image 2">`;
    }

    // Create a new card with fixed width and limited height
    const card = document.createElement("div");
    card.className = "card mt-3";
    card.style.width = "300px"; // Set fixed width
    card.style.maxHeight = "500px"; // Limit card height to avoid it being too tall
    card.style.overflowY = "auto"; // Enable scrolling if content overflows

    card.innerHTML = `
            <div class="card-header">
                <h5>Field Details</h5>
            </div>
            <div class="card-body">
                ${img1Preview}
                ${img2Preview}
                <p><strong>Code:</strong> ${code}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Extent Size:</strong> ${extent}</p>
                <p><strong>Staff:</strong> ${staff}</p>
                <p><strong>Crop:</strong> ${crop}</p>
                <button class="btn btn-success">Update</button>
                <button class="btn btn-danger" id="FieldCardDeleteBtn">Delete</button>
            </div>
        `;

    // Append the new card to the container
    document.getElementById("fieldCardsContainer").appendChild(card);

    // Reset the form and close it if necessary
    document.getElementById("FieldForm").reset();
    closeFiledForm();
    // Add event listener to the Delete button
    card.querySelector("#FieldCardDeleteBtn").addEventListener("click", function () {
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
                Swal.fire(
                    'Deleted!',
                    'The card has been deleted.',
                    'success'
                );
            }
        });
    });
});
// Elements
const $addLogBtn = $('#addLogBtn');
const $logFormCard = $('#logFormCard');
const $closeLogForm = $('#closeLogForm');
const $logCardsContainer = $('#logCardsContainer');
const $updateLogModal = $('#updateLogModal');
const $closeUpdateLogModalBtn = $('#closeUpdateLogModalBtn');
let updateTargetLogCard = null; // Track the current log card for updating

// Show log form when clicking "Add New Log"
$addLogBtn.on('click', function () {
    $logFormCard.show();
});

// Hide the log form when clicking close
$closeLogForm.on('click', function () {
    closeLogFormModal();
});

// Function to close log form modal
function closeLogFormModal() {
    $logFormCard.hide();
}

// Preview image function
function previewLogImage(event) {
    const file = event.target.files[0];
    if (file) {
        const imgPreview = URL.createObjectURL(file);
        $('#observedImagePreview').attr('src', imgPreview);
    }
}

// Handle the case where the select field may allow multiple selections or single selection
function getSelectValues(selectId) {
    const select = $(selectId);
    const values = select.val();
    return Array.isArray(values) ? values.join(', ') : values;
}

// Handle log form submission
$('#saveLogBtn').on('click', function (e) {
    e.preventDefault();

    // Get form data
    const header = $('#logFormTitle').text();
    const logCode = $('#logCode').val();
    const logDate = $('#logDate').val();
    const logDetails = $('#logDetails').val();
    const fieldList = getSelectValues('#fieldList');
    const cropList = getSelectValues('#cropList');
    const staffList = getSelectValues('#staffList');
    const observedImageFile = $('#observedImage')[0].files[0];
    let observedImagePreview = "";

    if (observedImageFile) {
        observedImagePreview = `<img src="${URL.createObjectURL(observedImageFile)}" class="card-img log-img" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Observed Image">`;
    }

    // Create log card
    const $logCard = $(`
        <div class="card mt-3" style="width: 300px; max-height: 500px; overflow-y: auto;">
            <div class="card-header">
                <h5>${header}</h5>
            </div>
            <div class="card-body">
                ${observedImagePreview}
                <p><strong>Code:</strong> <span class="log-code">${logCode}</span></p>
                <p><strong>Date:</strong> <span class="log-date">${logDate}</span></p>
                <p><strong>Details:</strong> <span class="log-details">${logDetails}</span></p>
                <p><strong>Field List:</strong> <span class="log-field-list">${fieldList}</span></p>
                <p><strong>Crop List:</strong> <span class="log-crop-list">${cropList}</span></p>
                <p><strong>Staff List:</strong> <span class="log-staff-list">${staffList}</span></p>
                <button class="btn btn-success" id="logCardUpdateBtn">Update</button>
                <button class="btn btn-danger" id="logCardDeleteBtn">Delete</button>
            </div>
        </div>
    `);

    $logCardsContainer.append($logCard);
    $('#logForm')[0].reset(); // Reset form
    $('#observedImagePreview').attr('src', ''); // Clear image preview
    closeLogFormModal();
});

// Event listener for delete
$('#logCardDeleteBtn').on('click', function (e){
    const $logCard = $(this).closest('.card');

    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete this log card?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $logCard.remove();
            Swal.fire('Deleted!', 'Your log card has been deleted.', 'success');
        }
    });
});

// Event listener for update
$logCardsContainer.on('click', '.logCardUpdateBtn', function (e) {
    const $logCard = $(this).closest('.card');
    openUpdateLogModal($logCard);
});

// Open update modal with current card data
function openUpdateLogModal($logCard) {
    updateTargetLogCard = $logCard; // Store the jQuery log card element for updating

    // Populate modal fields
    $('#updateLogCode').val($logCard.find('.log-code').text());
    $('#updateLogDate').val($logCard.find('.log-date').text());
    $('#updateLogDetails').val($logCard.find('.log-details').text());
    $('#updateFieldList').val($logCard.find('.log-field-list').text().split(', '));
    $('#updateCropList').val($logCard.find('.log-crop-list').text().split(', '));
    $('#updateStaffList').val($logCard.find('.log-staff-list').text().split(', '));

    // Clear the image upload field
    $('#updateObservedImage').val('');

    $updateLogModal.show();
}

// Close update modal
$closeUpdateLogModalBtn.on('click', function () {
    $updateLogModal.hide();
});

// Save updated log data
$('#saveUpdatedLog').on('click', function () {
    if (!updateTargetLogCard) return;

    // Update card content with new values
    updateTargetLogCard.find('.log-code').text($('#updateLogCode').val());
    updateTargetLogCard.find('.log-date').text($('#updateLogDate').val());
    updateTargetLogCard.find('.log-details').text($('#updateLogDetails').val());

    // Ensure join() is used for array fields (multiple items)
    updateTargetLogCard.find('.log-field-list').text($('#updateFieldList').val().join(', '));
    updateTargetLogCard.find('.log-crop-list').text($('#updateCropList').val().join(', '));
    updateTargetLogCard.find('.log-staff-list').text($('#updateStaffList').val().join(', '));

    Swal.fire("Updated!", "Log details have been updated.", "success");
    $updateLogModal.hide();
});

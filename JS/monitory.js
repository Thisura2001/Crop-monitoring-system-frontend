// Elements
const addLogBtn = $('#addLogBtn');
const logFormCard = $('#logFormCard');
const closeLogForm = $('#closeLogForm');
const logCardsContainer = $('#logCardsContainer');
const updateLogModal = $('#updateLogModal');
const closeUpdateLogModalBtn = $('#closeUpdateLogModalBtn');

addLogBtn.on('click', function () {
    logFormCard.show();
});
closeLogForm.on('click', function () {
    closeLogFormModal();
});
function closeLogFormModal() {
    logFormCard.hide();
}
$('#logForm').on('submit', function (e) {
    e.preventDefault();

    const header = $('#logFormTitle').text();
    const logCode = $('#logCode').val();
    const logDate = $('#logDate').val();
    const logDetails = $('#logDetails').val();
    const observedImageFile = $('#observedImage')[0].files[0];
    const fieldId = $('#fieldList').val();
    const cropId = $('#cropList').val();
    const staffId = $('#staffList').val();
    let observedImagePreview = "";

    if (observedImageFile) {
        observedImagePreview = `<img src="${URL.createObjectURL(observedImageFile)}" class="log-img" style="width: 100%; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Observed Image">`;
    }

    // Create log card
    const logCard = $(`
        <div class="card mt-3" style="width: 300px; max-height: 500px; overflow-y: auto;">
            <div class="card-header">
                <h5>Log Details</h5>
            </div>
            <div class="card-body">
                ${observedImagePreview}
                 <p><strong>Log ID:</strong> <span class="log-code">${logCode}</span></p>
                <p><strong>Log Date:</strong> <span class="log-date">${logDate}</span></p>
                <p><strong>Details:</strong> <span class="log-details">${logDetails}</span></p>
                <p><strong>Field ID:</strong> <span class="log-field-id">${fieldId}</span></p>
                <p><strong>Crop ID:</strong> <span class="log-crop-id">${cropId}</span></p>
                <p><strong>Staff ID:</strong> <span class="log-staff-id">${staffId}</span></p>
                <button class="btn btn-success logCardUpdateBtn">Update</button>
                <button class="btn btn-danger logCardDeleteBtn">Delete</button>
            </div>
        </div>
    `);
    logCardsContainer.append(logCard);
    $('#logForm')[0].reset();
    closeLogFormModal();
});

logCardsContainer.on('click', '.logCardDeleteBtn', function () {
    const logCard = $(this).closest('.card');

    // Show confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete this log?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            logCard.remove();
            Swal.fire('Deleted!', 'Your log has been deleted.', 'success');
        }
    });
});

logCardsContainer.on('click', '.logCardUpdateBtn', function () {
    const logCard = $(this).closest('.card');
    openUpdateLogModal(logCard);
});

function openUpdateLogModal(logCard) {
    document.updateTargetLogCard = logCard[0];

    // Populate modal fields
    $('#updateLogCode').val(logCard.find('.log-code').text().replace('Log: ', ''));
    $('#updateLogDate').val(logCard.find('.log-date').text());
    $('#updateLogDetails').val(logCard.find('.log-details').text());
    $('#updateFieldList').val(logCard.find('.log-field-id').text());
    $('#updateCropList').val(logCard.find('.log-crop-id').text());
    $('#updateStaffList').val(logCard.find('.log-staff-id').text());

    updateLogModal.show();
}

closeUpdateLogModalBtn.on('click', function () {
    updateLogModal.hide();
});

$('#saveUpdatedLog').on('click', function () {
    const logCard = $(document.updateTargetLogCard);

    logCard.find('.log-code').text($('#updateLogCode').val());
    logCard.find('.log-date').text($('#updateLogDate').val());
    logCard.find('.log-details').text($('#updateLogDetails').val());
    logCard.find('.log-field-id').text($('#updateFieldList').val());
    logCard.find('.log-crop-id').text($('#updateCropList').val());
    logCard.find('.log-staff-id').text($('#updateStaffList').val());
    const updatedImg = $('#updateObservedImage')[0].files[0];

    if (updatedImg) {
        logCard.find('.log-img').attr('src', URL.createObjectURL(updatedImg));
    }

    Swal.fire("Updated!", "Log details have been updated.", "success");
    updateLogModal.hide();
});

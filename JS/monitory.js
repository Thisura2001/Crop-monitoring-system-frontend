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
// $(document).ready(function () {
//     loadCrops();
//     loadFields();
//     loadStaff();
// });
//
// function loadCrops() {
//     $.ajax({
//         url: "http://localhost:9090/greenShadow/api/v1/crop",
//         method: "GET",
//         success: function (crops) {
//             const cropDropdown = $("#cropInLog"); // Correct ID
//             cropDropdown.empty();
//             cropDropdown.append('<option selected disabled value="">Select Crop...</option>');
//             crops.forEach(crop => {
//                 cropDropdown.append(`<option value="${crop.cropId}">${crop.cropId}</option>`);
//             });
//         },
//         error: function () {
//             Swal.fire('Error', 'Failed to load crop IDs. Please try again.', 'error');
//         }
//     });
// }
//
// function loadFields() {
//     $.ajax({
//         url: "http://localhost:9090/greenShadow/api/v1/field",
//         method: "GET",
//         success: function (fields) {
//             const fieldDropdown = $("#fieldList"); // Correct ID
//             fieldDropdown.empty();
//             fieldDropdown.append('<option selected disabled value="">Select Field...</option>');
//             fields.forEach(field => {
//                 fieldDropdown.append(`<option value="${field.fieldId}">${field.fieldId}</option>`);
//             });
//         },
//         error: function () {
//             Swal.fire('Error', 'Failed to load field IDs. Please try again.', 'error');
//         }
//     });
// }
// function loadStaff() {
//     $.ajax({
//         url: "http://localhost:9090/greenShadow/api/v1/staff",
//         method: "GET",
//         success: function (staff) {
//             const staffIdDropdown = $("#staffInLog"); // Correct ID
//             staffIdDropdown.empty();
//             staffIdDropdown.append('<option selected disabled value="">Select Staff...</option>');
//             staff.forEach(staff => {
//                 staffIdDropdown.append(`<option value="${staff.id}">${staff.id}</option>`);
//             });
//         },
//         error: function () {
//             Swal.fire('Error', 'Failed to load staff IDs. Please try again.', 'error');
//         }
//     })
// }
function loadLogData() {
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/log",
        method: "GET",
        success: function (logs) {
            renderLogs(logs); // Pass the fetched logs to renderLogs
        },
        error: function () {
            Swal.fire('Error', 'Failed to load log data. Please try again.', 'error');
        }
    });
}

function renderLogs(logs) {
    const logCardsContainer = $("#logCardsContainer");
    logCardsContainer.empty(); // Clear any existing cards

    logs.forEach(function (log) {
        // Generate log card HTML dynamically
        const logCard = `
            <div class="card mt-3" style="width: 300px; max-height: 500px; overflow-y: auto;">
                <div class="card-header">
                    <h5>Log Details</h5>
                </div>
                <div class="card-body">
                    <img src="data:image/jpeg;base64,${log.observed_image}" class="log-img" style="width: 100%; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Observed Image">
                    <p><strong>Log ID:</strong> ${log.id || "Not Specified"}</p>
                    <p><strong>Log Date:</strong> ${log.log_date || "Not Specified"}</p>
                    <p><strong>Details:</strong> ${log.log_details || "Not Specified"}</p>

                    <button class="btn btn-danger logCardDeleteBtn" data-id="${log.id}">Delete</button>
                    <button class="btn btn-primary logCardUpdateBtn" data-id="${log.id}">Update</button>
                </div>
            </div>
        `;
        logCardsContainer.append(logCard);
    });
}

// Call loadLogData to fetch and display logs on page load
loadLogData();


$("#saveLogBtn").on("click", function (e) {
    e.preventDefault();

    const logDate = $("#logDate").val();
    const logDetails = $("#logDetails").val();
    const observedImageFile = $("#observedImage")[0].files[0];
    // const fieldId = $("#fieldList").val();
    // const cropId = $("#cropInLog").val();
    // const staffId = $("#staffInLog").val();


    // Prepare FormData for submission
    const formData = new FormData();
    formData.append("log_date", logDate);
    formData.append("log_details", logDetails);
    // formData.append("fields", fieldId);
    // formData.append("crops", cropId);
    // formData.append("staff", staffId);
    formData.append("observed_image", observedImageFile);

    // AJAX POST request to save log
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/log", // Adjust endpoint
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            Swal.fire({
                icon: "success",
                title: "Log Saved",
                text: "Log has been saved successfully!",
                showConfirmButton: false,
                timer: 1500,
            });

            // Dynamically create log card using server response
            const newLogCard = `
                <div class="card mt-3" style="width: 300px; max-height: 500px; overflow-y: auto;">
                    <div class="card-header">
                        <h5>Log Details</h5>
                    </div>
                    <div class="card-body">
                        <img src="${response.observed_image}" class="log-img" style="width: 100%; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Observed Image">
                        <p><strong>Log ID:</strong> ${response.id}</p>
                        <p><strong>Log Date:</strong> ${response.log_date}</p>
                        <p><strong>Details:</strong> ${response.log_details}</p>
                        <button class="btn btn-danger logCardDeleteBtn">Delete</button>
                        <button class="btn btn-primary logCardUpdateBtn">Update</button>
                    </div>
                </div>
            `;

            $("#logCardsContainer").append(newLogCard);

            // Reset form and hide the modal
            $("#logForm")[0].reset();
            closeLogFormModal();
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while saving the log. Please try again.",
            });
        },
    });
});


logCardsContainer.on('click', '.logCardDeleteBtn', function () {
    const logCard = $(this).closest('.card'); // Select the parent card
    const logId = $(this).data('id'); // Retrieve the log ID from the button's data-id attribute

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
            // AJAX DELETE request to the backend API
            $.ajax({
                url: `http://localhost:9090/greenShadow/api/v1/log/${logId}`, // Adjust API endpoint
                type: 'DELETE',
                success: function () {
                    // Remove the card on success
                    logCard.remove();

                    // Show success message
                    Swal.fire('Deleted!', 'Your log has been deleted.', 'success');
                },
                error: function () {
                    // Show error message if the request fails
                    Swal.fire('Error', 'Failed to delete the log. Please try again.', 'error');
                }
            });
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

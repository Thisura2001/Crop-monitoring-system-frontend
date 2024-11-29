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

let editLogCard = null;
logCardsContainer.on('click', '.logCardUpdateBtn', function () {
    const logCard = $(this).closest('.card');
    openUpdateLogModal(logCard);
    editLogCard = $(this).data('id');
});

function openUpdateLogModal(logCard) {
    document.updateTargetLogCard = logCard[0];

    // Populate modal fields
    $('#updateLogDate').val(logCard.find('log_date').text());
    $('#updateLogDetails').val(logCard.find('.log-details').text());
    updateLogModal.show();
}

closeUpdateLogModalBtn.on('click', function () {
    updateLogModal.hide();
});

$('#saveUpdatedLog').on('click', function () {
    const logCard = $(document.updateTargetLogCard);

    const logData = {
        log_date: $('#updateLogDate').val(),
        log_details: $('#updateLogDetails').val()
    };

    const updatedImg = $('#updateObservedImage')[0].files[0];

    if (updatedImg) {
        // Use FormData to send file data
        const formData = new FormData();
        formData.append('logData', JSON.stringify(logData));
        formData.append('updatedImg', updatedImg);

        // Send data using AJAX
        $.ajax({
            url: 'http://localhost:9090/greenShadow/api/v1/log/'+editLogCard, // Replace with your API endpoint
            type: 'POST',
            data: formData,
            processData: false,  // Important for sending FormData
            contentType: false,  // Important for sending FormData
            success: function (response) {
                if (response.success) {
                    // Update log card UI with new values
                    logCard.find('.log-code').text(logData.id);
                    logCard.find('.log-date').text(logData.log_date);
                    logCard.find('.log-details').text(logData.log_details);

                    if (updatedImg) {
                        logCard.find('.log-img').attr('src', URL.createObjectURL(updatedImg));
                    }

                    // Show success message
                    Swal.fire("Updated!", "Log details have been updated.", "success");

                    // Hide modal
                    updateLogModal.hide();
                } else {
                    Swal.fire("Error!", "There was a problem updating the log.", "error");
                }
            },
            error: function () {
                Swal.fire("Error!", "There was a problem processing your request.", "error");
            }
        });
    }
});

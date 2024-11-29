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

    // Validate required fields
    if (!logDate || !logDetails || !observedImageFile) {
        Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Please fill in all fields and upload an image!",
        });
        return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append("log_date", logDate);
    formData.append("log_details", logDetails);
    formData.append("observed_image", observedImageFile);

    // AJAX POST request to save log
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/log", // Adjust endpoint
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Show success alert
            Swal.fire({
                icon: "success",
                title: "Log Saved",
                text: "Log data has been saved successfully!",
                showConfirmButton: false,
                timer: 1500,
            });

            // Add the new log card dynamically
            const newCard = `
                <div class="card mt-3" style="width: 300px; max-height: 500px; overflow-y: auto;">
                    <div class="card-header">
                        <h5>Log Details</h5>
                    </div>
                    <div class="card-body">
                        <img src="${URL.createObjectURL(observedImageFile)}" class="log-img" style="width: 100%; max-height: 150px; object-fit: cover; margin-bottom: 10px;" alt="Observed Image">
                        <p><strong>Log ID:</strong> Pending...</p>
                        <p><strong>Log Date:</strong> ${logDate}</p>
                        <p><strong>Details:</strong> ${logDetails}</p>
                        <button class="btn btn-danger logCardDeleteBtn">Delete</button>
                        <button class="btn btn-primary logCardUpdateBtn">Update</button>
                    </div>
                </div>
            `;
            $("#logCardsContainer").append(newCard);

            // Reset form and hide the form modal
            $("#logForm")[0].reset();
            closeLogFormModal();
            loadLogData();
        },
        error: function (xhr, status, error) {
            // Handle errors gracefully
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while saving the log data. Please try again.",
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
    editLogCard = $(this).data('id'); // Store the log ID for the update
});

function openUpdateLogModal(logCard) {
    document.updateTargetLogCard = logCard[0];

    // Populate modal fields with the data from the selected card
    $('#updateLogDate').val(logCard.find('.log-date').text()); // Fixed: Added proper class selector
    $('#updateLogDetails').val(logCard.find('.log-details').text()); // Fixed: Added proper class selector
    updateLogModal.show();
}

closeUpdateLogModalBtn.on('click', function () {
    updateLogModal.hide();
});

$("#saveUpdatedLog").off("click").on("click", function () {
    // Get values from modal fields
    const logDate = $("#updateLogDate").val();
    const logDetails = $("#updateLogDetails").val();
    const logImgInput = $("#updateObservedImage")[0];
    const logImg = logImgInput.files.length > 0 ? logImgInput.files[0] : null;

    const formData = new FormData();
    formData.append("log_date", logDate);
    formData.append("log_details", logDetails);
    if (logImg) {
        formData.append("logImg", logImg);
    }

    // AJAX request to update log data
    $.ajax({
        url: `http://localhost:9090/greenShadow/api/v1/log/` + editLogCard,
        method: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        success: function () {
            const logCard = $(document.updateTargetLogCard);

            // Update log card dynamically
            logCard.find("p:contains('Date:')").text(`Date: ${logDate}`);
            logCard.find("p:contains('Details:')").text(`Details: ${logDetails}`);
            if (logImg) {
                logCard.find(".log-img").attr("src", URL.createObjectURL(logImg));
            }

            Swal.fire("Success", "Log updated successfully!", "success");
            closeUpdateLogModal(); // Close modal after success
        },
        error: function () {
            Swal.fire("Error", "Failed to update log. Please try again.", "error");
        }
    });
});

// Function to close the update log modal
function closeUpdateLogModal() {
    $("#updateLogModal").hide();
}

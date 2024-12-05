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
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (logs) {
            renderLogs(logs);
        },
        error: function () {
            Swal.fire('Error', 'Failed to load log data. Please try again.', 'error');
        }
    });
}

function renderLogs(logs) {
    const logCardsContainer = $("#logCardsContainer");
    logCardsContainer.empty();

    logs.forEach(function (log) {
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

    const formData = new FormData();
    formData.append("log_date", logDate);
    formData.append("log_details", logDetails);
    formData.append("observed_image", observedImageFile);

    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/log", // Adjust endpoint
        type: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
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

            $("#logForm")[0].reset();
            closeLogFormModal();
            loadLogData();
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while saving the log data. Please try again.",
            });
        },
    });
});


logCardsContainer.on('click', '.logCardDeleteBtn', function () {
    const logCard = $(this).closest('.card');
    const logId = $(this).data('id');

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
            $.ajax({
                url: `http://localhost:9090/greenShadow/api/v1/log/${logId}`,
                type: 'DELETE',
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                success: function () {
                    logCard.remove();
                    Swal.fire('Deleted!', 'Your log has been deleted.', 'success');
                },
                error: function () {
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

    $('#updateLogDate').val(logCard.find('.log-date').text().trim());
    $('#updateLogDetails').val(logCard.find('.log-details').text().trim());

    const logImgSrc = logCard.find('.log-img').attr('src');
    if (logImgSrc) {
        $('#updateObservedImagePreview').attr('src', logImgSrc).show();
    } else {
        $('#updateObservedImagePreview').hide();
    }

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
a
    $.ajax({
        url: `http://localhost:9090/greenShadow/api/v1/log/` + editLogCard,
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function () {
            const logCard = $(document.updateTargetLogCard);

            // Update log card dynamically
            logCard.find(".log-date").text(logDate);
            logCard.find(".log-details").text(logDetails);

            if (logImg) {
                logCard.find(".log-img").attr("src", URL.createObjectURL(logImg));
            }

            Swal.fire("Success", "Log updated successfully!", "success");
            closeUpdateLogModal();
        },
        error: function () {
            Swal.fire("Error", "Failed to update log. Please try again.", "error");
        }
    });
});
function closeUpdateLogModal() {
    $("#updateLogModal").hide();
}

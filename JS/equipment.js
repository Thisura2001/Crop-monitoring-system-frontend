// Get elements
const addEquipmentBtn = document.getElementById('addEquipmentBtn');
const equipmentFormCard = document.getElementById('equipmentFormCard');
const closeEquipmentFormBtn = document.getElementById('closeEquipmentForm');
let editingRow = null;

// Show the equipment form card for adding new equipment
addEquipmentBtn.addEventListener('click', () => {
    equipmentFormCard.style.display = 'block';
    editingRow = null;
    $("#equipmentForm")[0].reset();
});

// Close the equipment form card
function closeEquipmentForm() {
    equipmentFormCard.style.display = 'none';
    $("#equipmentForm")[0].reset();
}

// Close button event
closeEquipmentFormBtn.addEventListener('click', closeEquipmentForm);
$(document).ready(function () {
   loadStaff();
   loadFields();
});
function loadFields() {
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/field", // Adjust endpoint to fetch field IDs
        method: "GET",
        success: function (fields) {
            const fieldDropdown = $("#assignedField");
            fieldDropdown.empty();
            fieldDropdown.append('<option selected disabled value="">Select Field...</option>');

            // Add options dynamically
            fields.forEach(field => {
                fieldDropdown.append(`<option value="${field.fieldId}">${field.fieldId}</option>`);
            });
        },
        error: function () {
            Swal.fire('Error', 'Failed to load field IDs. Please try again.', 'error');
        }
    });
}
function loadStaff() {
    $.ajax(
        {
            url: "http://localhost:9090/greenShadow/api/v1/staff",
            method: "GET",
            success: function (staff) {
                const staffIdDropdown = $("#assignedStaff");
                staffIdDropdown.empty();
                staffIdDropdown.append('<option selected disabled value="">Select Staff...</option>');
                staff.forEach(staff => {
                    staffIdDropdown.append(`<option value="${staff.id}">${staff.id}</option>`);
                });
            },
            error: function () {
                Swal.fire('Error', 'Failed to load staff IDs. Please try again.', 'error');
            }
        }
    );
}
$(document).ready(function() {
    let editingRow = null;

    // Show the equipment form card when "Add New Equipment" button is clicked
    $("#addEquipmentBtn").on("click", function() {
        $("#equipmentFormCard").show();
        $("#btnEquipmentSave").show();
        $("#btnEquipmentUpdate").hide();
        $("#equipmentForm")[0].reset();
        editingRow = null;
    });

    // Close the equipment form card
    $("#closeEquipmentForm").on("click", function() {
        $("#equipmentFormCard").hide();
        $("#equipmentForm")[0].reset();
        editingRow = null;
    });

    // Handle Save button click for adding new equipment
    $("#btnEquipmentSave").on("click", function(event) {
        event.preventDefault();

        // Get form values
        const equipmentData = {
            name: $("#equipmentName").val(),
            equipmentType: $("#equipmentType").val(),
            status: $("#equipmentStatus").val(),
            staff: $("#assignedStaff").val(),
            field: $("#assignedField").val()
        };

        // Send the data to the backend using AJAX
        $.ajax({
            url: "http://localhost:9090/greenShadow/api/v1/equipment", // Replace with your API endpoint
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(equipmentData),
            success: function(response) {
                console.log(response);

                // Show success alert
                Swal.fire({
                    title: "Saved!",
                    text: "The equipment has been saved successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                // Hide the form card and reset the form
                $("#equipmentFormCard").hide();
                $("#equipmentForm")[0].reset();
            },
            error: function(xhr, status, error) {
                // Handle errors
                Swal.fire({
                    title: "Error!",
                    text: "Failed to save the equipment. Please try again.",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false
                });
                console.error("Error:", xhr.responseText); // Log the error for debugging
            }
        });
    });


    // Handle Update button click for editing existing equipment
    $("#btnEquipmentUpdate").on("click", function(event) {
        event.preventDefault();

        if (editingRow) {
            // Get updated values
            const equipmentId = $("#equipmentId").val();
            const equipmentName = $("#equipmentName").val();
            const equipmentType = $("#equipmentType").val();
            const equipmentStatus = $("#equipmentStatus").val();
            const assignedStaff = $("#assignedStaff").val();
            const assignedField = $("#assignedField").val();

            // Update the selected row's values
            $(editingRow).find("td:eq(0)").text(equipmentId);
            $(editingRow).find("td:eq(1)").text(equipmentName);
            $(editingRow).find("td:eq(2)").text(equipmentType);
            $(editingRow).find("td:eq(3)").text(equipmentStatus);
            $(editingRow).find("td:eq(4)").text(assignedStaff);
            $(editingRow).find("td:eq(5)").text(assignedField);

            // Success message and reset form
            Swal.fire({
                title: "Updated!",
                text: "The equipment details have been updated.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });

            editingRow = null; // Reset editingRow
            $("#equipmentFormCard").hide();
            $("#equipmentForm")[0].reset();
        }
    });

    // Delete row event
    $("#equipmentTbody").on("click", ".delete-row", function() {
        const row = $(this).closest("tr");

        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the equipment entry.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                row.remove();
                Swal.fire({
                    title: "Deleted!",
                    text: "The equipment entry has been deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    });

    // Edit row event
    $("#equipmentTbody").on("click", ".update-row", function() {
        // Show the form card for updating
        $("#equipmentFormCard").show();

        // Set the selected row to be edited
        editingRow = $(this).closest("tr");

        // Populate form fields with the selected row's data
        $("#equipmentId").val(editingRow.find("td:eq(0)").text());
        $("#equipmentName").val(editingRow.find("td:eq(1)").text());
        $("#equipmentType").val(editingRow.find("td:eq(2)").text());
        $("#equipmentStatus").val(editingRow.find("td:eq(3)").text());
        $("#assignedStaff").val(editingRow.find("td:eq(4)").text());
        $("#assignedField").val(editingRow.find("td:eq(5)").text());

        $("#btnEquipmentSave").hide();
        $("#btnEquipmentUpdate").show();
    });
});

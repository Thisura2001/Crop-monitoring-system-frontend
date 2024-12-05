
const addEquipmentBtn = document.getElementById('addEquipmentBtn');
const equipmentFormCard = document.getElementById('equipmentFormCard');
const closeEquipmentFormBtn = document.getElementById('closeEquipmentForm');
let editingRow = null;

addEquipmentBtn.addEventListener('click', () => {
    equipmentFormCard.style.display = 'block';
    editingRow = null;
    $("#equipmentForm")[0].reset();
});

function closeEquipmentForm() {
    equipmentFormCard.style.display = 'none';
    $("#equipmentForm")[0].reset();
}

closeEquipmentFormBtn.addEventListener('click', closeEquipmentForm);
initializeEquipment()
export function initializeEquipment () {
   loadStaff();
   loadFields();
}
function loadFields() {
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/field", // Adjust endpoint to fetch field IDs
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
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
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
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

$(document).ready(function (){
    loadEquipments();
})
    function loadEquipments() {
        $.ajax({
            url: "http://localhost:9090/greenShadow/api/v1/equipment",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function (equipments) {
                renderEquipments(equipments);
            },
            error: function () {
                Swal.fire('Error', 'Failed to load equipment. Please try again.', 'error');
            }
        })
    }

    function renderEquipments(equipments) {
        $("#equipmentTbody").empty();
        equipments.forEach(function (data) {
            const row = `<tr>
                            <td>${data.eqId}</td>
                            <td>${data.name}</td>
                            <td>${data.equipmentType}</td>
                            <td>${data.status}</td>
                            <td>${data.field}</td>
                            <td>${data.staff}</td>
                            <td><button class='btn btn-danger btn-sm delete-row'><i class='fa-solid fa-trash'></i></button></td>
                            <td><button class='btn btn-warning btn-sm update-row'><i class='fa-solid fa-pen-to-square'></i></button></td>
                        </tr>`;
            $("#equipmentTbody").append(row);
        })
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

        // Validate form fields
        if ($("#equipmentName").val() === "" || $("#equipmentType").val() === "" || $("#equipmentStatus").val() === "" || $("#assignedField").val() === "" || $("#assignedStaff").val() === "") {
            Swal.fire({
                title: "Error!",
                text: "Please fill in all required fields.",
                icon: "error",
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

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
            url: "http://localhost:9090/greenShadow/api/v1/equipment",
            type: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
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
                loadEquipments();
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
                console.error("Error:", xhr.responseText);
            }
        });
    });

    let editingEquipmentRow = null;

    $("#equipmentTbody").on("click", ".update-row", function() {
        $("#equipmentFormCard").show();

        editingEquipmentRow = $(this).closest("tr");

        $("#equipmentId").val(editingEquipmentRow.find("td:eq(0)").text());
        $("#equipmentName").val(editingEquipmentRow.find("td:eq(1)").text());
        $("#equipmentType").val(editingEquipmentRow.find("td:eq(2)").text());
        $("#equipmentStatus").val(editingEquipmentRow.find("td:eq(3)").text());
        $("#assignedStaff").val(editingEquipmentRow.find("td:eq(4)").text());
        $("#assignedField").val(editingEquipmentRow.find("td:eq(5)").text());

        $("#btnEquipmentSave").hide();
        $("#btnEquipmentUpdate").show();
    });

    $("#btnEquipmentUpdate").on("click", function(event) {
        event.preventDefault();

            const equipmentId = $(editingEquipmentRow).find("td:eq(0)").text();
            const equipmentName = $("#equipmentName").val();
            const equipmentType = $("#equipmentType").val();
            const equipmentStatus = $("#equipmentStatus").val();
            const assignedStaff = $("#assignedStaff").val();
            const assignedField = $("#assignedField").val();

            // Send the updated data to the backend via AJAX
            $.ajax({
                url: `http://localhost:9090/greenShadow/api/v1/equipment/${equipmentId}`,
                type: "PUT",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                data: JSON.stringify({
                    eqId: equipmentId,
                    name: equipmentName,
                    equipmentType: equipmentType,
                    status: equipmentStatus,
                    staff: assignedStaff,
                    field: assignedField
                }),
                contentType: "application/json",
                success: function(response) {
                    $(editingEquipmentRow).find("td:eq(0)").text(equipmentId);
                    $(editingEquipmentRow).find("td:eq(1)").text(equipmentName);
                    $(editingEquipmentRow).find("td:eq(2)").text(equipmentType);
                    $(editingEquipmentRow).find("td:eq(3)").text(equipmentStatus);
                    $(editingEquipmentRow).find("td:eq(4)").text(assignedStaff);
                    $(editingEquipmentRow).find("td:eq(5)").text(assignedField);

                    // Success message and reset form
                    Swal.fire({
                        title: "Updated!",
                        text: "The equipment details have been updated.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    loadEquipments();
                    editingRow = null;
                    $("#equipmentFormCard").hide();
                    $("#equipmentForm")[0].reset();
                },
                error: function(xhr, status, error) {
                    Swal.fire({
                        title: "Error!",
                        text: "There was an issue updating the equipment details.",
                        icon: "error",
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
    });

    $("#equipmentTbody").on("click", ".delete-row", function () {
        const row = $(this).closest("tr");
        const equipmentId = row.find("td").eq(0).text();

        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the equipment entry.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `http://localhost:9090/greenShadow/api/v1/equipment/${equipmentId}`,
                    type: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    success: function (response) {
                        row.remove();
                        Swal.fire({
                            title: "Deleted!",
                            text: "The equipment entry has been deleted.",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                    error: function (xhr, status, error) {
                        // Handle errors
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to delete the equipment entry. Please try again.",
                            icon: "error",
                        });
                    },
                });
            }
        });
    });
});

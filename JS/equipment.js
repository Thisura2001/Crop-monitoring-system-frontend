// Get elements
const addEquipmentBtn = document.getElementById('addEquipmentBtn');
const equipmentFormCard = document.getElementById('equipmentFormCard');
const closeEquipmentFormBtn = document.getElementById('closeEquipmentForm');
let editingRow = null; // Track the row being edited

// Show the equipment form card for adding new equipment
addEquipmentBtn.addEventListener('click', () => {
    equipmentFormCard.style.display = 'block';
    editingRow = null; // Reset editingRow when adding new entry
    $("#equipmentForm")[0].reset(); // Clear form fields
});

// Close the equipment form card
function closeEquipmentForm() {
    equipmentFormCard.style.display = 'none';
    $("#equipmentForm")[0].reset(); // Clear form fields
}

// Close button event
closeEquipmentFormBtn.addEventListener('click', closeEquipmentForm);

$(document).ready(function() {
    let editingRow = null; // Track the row being edited

    // Show the equipment form card when "Add New Equipment" button is clicked
    $("#addEquipmentBtn").on("click", function() {
        $("#equipmentFormCard").show();
        $("#btnEquipmentSave").show();
        $("#btnEquipmentUpdate").hide();
        $("#equipmentForm")[0].reset(); // Clear form fields
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
        const equipmentId = $("#equipmentId").val();
        const equipmentName = $("#equipmentName").val();
        const equipmentType = $("#equipmentType").val();
        const equipmentStatus = $("#equipmentStatus").val();
        const assignedStaff = $("#assignedStaff").val();
        const assignedField = $("#assignedField").val();

        // Add a new row to the table
        const newRow = `
            <tr>
                <td>${equipmentId}</td>
                <td>${equipmentName}</td>
                <td>${equipmentType}</td>
                <td>${equipmentStatus}</td>
                <td>${assignedStaff}</td>
                <td>${assignedField}</td>
                <td><button class="btn btn-danger btn-sm delete-row"><i class="fa-solid fa-trash"></i></button></td>
                <td><button class="btn btn-warning btn-sm update-row"><i class="fa-solid fa-pen-to-square"></i></button></td>
            </tr>
        `;

        // Append the new row to the table
        $("#equipmentTbody").append(newRow);

        // Hide the form card and clear form fields
        $("#equipmentFormCard").hide();
        $("#equipmentForm")[0].reset();
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

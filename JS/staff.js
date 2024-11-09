// Get the elements for the Staff form
const addStaffBtn = document.getElementById('addStaffBtn');
const staffFormCard = document.getElementById('staffFormCard');
const closeStaffFormBtn = document.getElementById('closeStaffForm');

// Function to show the staff form card
addStaffBtn.addEventListener('click', () => {
    staffFormCard.style.display = 'block';
});

// Function to close the staff form card
function closeStaffForm() {
    staffFormCard.style.display = 'none';
}

// Close button event for staff form
closeStaffFormBtn.addEventListener('click', closeStaffForm);

/////////////////////////////////////////////////
$(document).ready(function() {
    let editingRow = null;

    // Show the staff form card when "Add New Staff" button is clicked
    $("#addStaffBtn").on("click", function() {
        $("#staffFormCard").show();
        $("#btnStaffSave").show();
        $("#btnStaffUpdate").hide();
        $("#staffForm")[0].reset(); // Clear form fields
        editingRow = null;
    });

    // Close the staff form card
    $("#closeStaffForm").on("click", function() {
        $("#staffFormCard").hide();
        $("#staffForm")[0].reset();
        editingRow = null;
    });

    // Handle Save button click for adding new staff
    $("#btnStaffSave").on("click", function(event) {
        event.preventDefault();

        // Get form values
        const staffId = $("#staffId").val();
        const firstName = $("#StaffFirstName").val();
        const designation = $("#designation").val();
        const field = $("#staffField").val();
        const gender = $("#gender").val();
        const joinedDate = $("#joinedDate").val();
        const dob = $("#dob").val();
        const contactNo = $("#contactNo").val();
        const email = $("#StaffEmail").val();
        const role = $("#StaffRole").val();
        const city = $("#addressLine3").val();

        // Create a new row with the staff details
        const newRow = `
            <tr>
                <td>${staffId}</td>
                <td>${firstName}</td>
                <td>${designation}</td>
                <td>${field}</td>
                <td>${gender}</td>
                <td>${joinedDate}</td>
                <td>${dob}</td>
                <td>${contactNo}</td>
                <td>${email}</td>
                <td>${role}</td>
                <td>${city}</td>
                <td><button class="btn btn-danger btn-sm delete-row"><i class="fa-solid fa-trash"></i></button></td>
                <td><button class="btn btn-warning btn-sm update-row"><i class="fa-solid fa-pen-to-square"></i></button></td>
            </tr>
        `;

        // Append the new row to the table
        $("#staffTbody").append(newRow);

        // Hide the form card and reset the form
        $("#staffFormCard").hide();
        $("#staffForm")[0].reset();
    });

    // Handle Update button click to edit existing row
    $("#btnStaffUpdate").on("click", function(event) {
        event.preventDefault();

        // Get updated values from the form
        const updatedValues = {
            staffId: $("#staffId").val(),
            firstName: $("#StaffFirstName").val(),
            designation: $("#designation").val(),
            field: $("#staffField").val(),
            gender: $("#gender").val(),
            joinedDate: $("#joinedDate").val(),
            dob: $("#dob").val(),
            contactNo: $("#contactNo").val(),
            email: $("#StaffEmail").val(),
            role: $("#StaffRole").val(),
            city: $("#addressLine3").val()
        };

        // Update the editing row with the new values
        $(editingRow).find("td").each(function(index) {
            $(this).text(Object.values(updatedValues)[index]);
        });

        // Success message and reset form
        Swal.fire({
            title: "Updated!",
            text: "The staff details have been updated.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });

        // Reset the form and variables
        editingRow = null;
        $("#staffFormCard").hide();
        $("#staffForm")[0].reset();
    });

// Handle row deletion with confirmation using SweetAlert
    $(document).on("click", ".delete-row", function() {
        const rowToDelete = $(this).closest("tr");

        // Show confirmation dialog
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // Delete the row if confirmed
                rowToDelete.remove();
                Swal.fire({
                    title: "Deleted!",
                    text: "The staff record has been deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    });

    // Handle row update (Edit) button click
    $(document).on("click", ".update-row", function() {
        editingRow = $(this).closest("tr");

        // Fill form with the selected row's data
        const rowData = $(editingRow).find("td").map(function() {
            return $(this).text();
        }).get();

        $("#staffId").val(rowData[0]);
        $("#StaffFirstName").val(rowData[1]);
        $("#designation").val(rowData[2]);
        $("#staffField").val(rowData[3]);
        $("#gender").val(rowData[4]);
        $("#joinedDate").val(rowData[5]);
        $("#dob").val(rowData[6]);
        $("#contactNo").val(rowData[7]);
        $("#StaffEmail").val(rowData[8]);
        $("#StaffRole").val(rowData[9]);
        $("#addressLine3").val(rowData[10]);

        // Show the form card and toggle buttons
        $("#staffFormCard").show();
        $("#btnStaffSave").hide();
        $("#btnStaffUpdate").show();
    });
});

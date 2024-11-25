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
$(document).ready(function () {
    loadFieldIds();
    LoadStaffData();
});

function loadFieldIds() {
    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/field", // Adjust endpoint to fetch field IDs
        method: "GET",
        success: function (fields) {
            const fieldDropdown = $("#staffField");
            fieldDropdown.empty(); // Clear existing options
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
function LoadStaffData() {
    $.ajax(
        {
            url: "http://localhost:9090/greenShadow/api/v1/staff",
            method: "GET",
            contentType: "application/json",
            success: function (data) {
                appendStaff(data);
            },
            error: function (error) {
                console.log(error)
                Swal.fire('Error', 'Failed to load staff data. Please try again.', 'error');
            }
        }
    )
}
function appendStaff(staff) {
    $("#staffTbody").empty();
    staff.forEach(function (data) {
        let row = "<tr>";
        row += "<td>" + data.staffId + "</td>";
        row += "<td>" + data.firstName + "</td>";
        row += "<td>" + data.designation + "</td>";
        row += "<td>" + data.gender + "</td>";
        row += "<td>" + data.joined_date + "</td>";
        row += "<td>" + data.dob + "</td>";
        row += "<td>" + data.contact_no + "</td>";
        row += "<td>" + data.email + "</td>";
        row += "<td>" + data.address + "</td>";
        row += "<td>" + data.role + "</td>";
        row += "<td><button class='btn btn-danger btn-sm delete-row'><i class='fa-solid fa-trash'></i></button></td>";
        row += "<td><button class='btn btn-warning btn-sm update-row'><i class='fa-solid fa-pen-to-square'></i></button></td>";
        row += "</tr>";
        $("#staffTbody").append(row);
    });
}

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

    $("#btnStaffSave").on("click", function(event) {
        event.preventDefault();

        const firstName = $("#StaffFirstName").val();
        const designation = $("#designation").val();
        const field = $("#staffField").val();
        const gender = $("#gender").val();
        const joinedDate = $("#joinedDate").val();
        const dob = $("#dob").val();
        const contactNo = $("#contactNo").val();
        const email = $("#StaffEmail").val();
        const role = $("#role").val();
        const address = $("#addressLine3").val();

        const staffData = {
            firstName: firstName,
            designation: designation,
            field: field,
            gender: gender,
            joined_date: joinedDate,
            dob: dob,
            contact_no: contactNo,
            email: email,
            role: role,
            address: address
        };
        console.log(staffData);
        const staffJson = JSON.stringify(staffData);

        $.ajax({
            url: "http://localhost:9090/greenShadow/api/v1/staff",
            type: "POST",
            data: staffJson,
            contentType: "application/json",
            success: function(response) {
                LoadStaffData();
                Swal.fire({
                    title: "Saved!",
                    text: "The staff details have been saved.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                $("#staffForm")[0].reset();
                $("#staffFormCard").hide();
                loadStaffData();
            },
            error: function() {
                Swal.fire('Error', 'Failed to save staff details. Please try again.', 'error');
            }
        });
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

        $(editingRow).find("td").each(function(index) {
            $(this).text(Object.values(updatedValues)[index]);
        });

        Swal.fire({
            title: "Updated!",
            text: "The staff details have been updated.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });

        editingRow = null;
        $("#staffFormCard").hide();
        $("#staffForm")[0].reset();
    });

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

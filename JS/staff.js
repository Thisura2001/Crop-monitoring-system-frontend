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
        row += "<td>" + data.id + "</td>";
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
    $("#addStaffBtn").on("click", function () {
        $("#staffFormCard").show();
        $("#btnStaffSave").show();
        $("#btnStaffUpdate").hide();
        $("#staffForm")[0].reset(); // Clear form fields
        editingRow = null;
    });

    // Close the staff form card
    $("#closeStaffForm").on("click", function () {
        $("#staffFormCard").hide();
        $("#staffForm")[0].reset();
        editingRow = null;
    });

    $("#btnStaffSave").on("click", function (event) {
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
            success: function (response) {
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
            },
            error: function () {
                Swal.fire('Error', 'Failed to save staff details. Please try again.', 'error');
            }
        });
    });


    $('#tblStaff').on("click", ".delete-row", function () {
        const rowToDelete = $(this).closest("tr");
        const staffId = rowToDelete.find("td").eq(0).text();

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
                $.ajax({
                    url: `http://localhost:9090/greenShadow/api/v1/staff/${staffId}`,
                    type: "DELETE",
                    success: function (response) {
                        rowToDelete.remove();
                        Swal.fire({
                            title: "Deleted!",
                            text: "The staff record has been deleted.",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false
                        });
                    },
                    error: function () {
                        Swal.fire('Error', 'Failed to delete staff details. Please try again.', 'error');
                    }
                });
            }
        });
    });


    let editingStaffId = null; // Global variable to hold the current staffId being edited

    $(document).on("click", ".update-row", function () {
        const row = $(this).closest("tr"); // Get the current row

        // Retrieve the staffId and other data from the row
        editingStaffId = row.find("td:eq(0)").text(); // Assuming the staffId is in the first column
        const firstName = row.find("td:eq(1)").text();
        const designation = row.find("td:eq(2)").text();
        const gender = row.find("td:eq(3)").text();
        const joinedDate = row.find("td:eq(4)").text();
        const dob = row.find("td:eq(5)").text();
        const contactNo = row.find("td:eq(6)").text();
        const email = row.find("td:eq(7)").text();
        const address = row.find("td:eq(8)").text();
        const role = row.find("td:eq(9)").text();

        // Populate the form fields with the retrieved data
        $("#StaffFirstName").val(firstName);
        $("#designation").val(designation);
        $("#gender").val(gender);
        $("#joinedDate").val(joinedDate);
        $("#dob").val(dob);
        $("#contactNo").val(contactNo);
        $("#StaffEmail").val(email);
        $("#addressLine3").val(address);
        $("#role").val(role);

        // Show the form and switch to update mode
        $("#staffFormCard").show();
        $("#btnStaffSave").hide();
        $("#btnStaffUpdate").show();
    });

    $("#btnStaffUpdate").on("click", function (event) {
        event.preventDefault();

        const staffId = editingStaffId;  // Use the correct staffId

        // Collect the updated data from the form
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

        // Send the PUT request to update the staff data
        $.ajax({
            url: `http://localhost:9090/greenShadow/api/v1/staff/${staffId}`,
            type: "PUT",
            data: JSON.stringify(staffData),
            contentType: "application/json",
            success: function (response) {
                LoadStaffData();
                Swal.fire({
                    title: "Updated!",
                    text: "The staff details have been updated.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                $("#staffForm")[0].reset();
                $("#staffFormCard").hide();
            },
            error: function (xhr, status, error) {
                Swal.fire('Error', 'Failed to update staff details. Please try again.', 'error');
                console.error('Error:', xhr.responseText);
            }
        });
    });
});
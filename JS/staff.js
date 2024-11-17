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

    $("#btnStaffSave").on("click", function(event) {
        event.preventDefault();

        const staffData = {
            id: null,
            firstName: $("#StaffFirstName").val(),
            designation: $("#designation").val(),
            fields: [$("#staffField").val()],
            gender: $("#gender").val(),
            joined_date: $("#joinedDate").val(),
            dob: $("#dob").val(),
            contact_no: $("#contactNo").val(),
            email: $("#StaffEmail").val(),
            role: $("#StaffRole").val(),
            address: $("#addressLine3").val()
        };

        const staffJason = JSON.stringify(staffData);

        $.ajax({
            url: "http://localhost:9090/greenShadow/api/v1/staff",
            type: "POST",
            contentType: "application/json",
            data: staffJason,
            success: function(response) {
                const newRow = `
            <tr>
                <td>${staffData.firstName}</td>
                <td>${staffData.designation}</td>
                <td>${staffData.fields.join(", ")}</td>
                <td>${staffData.gender}</td>
                <td>${staffData.joined_date}</td>
                <td>${staffData.dob}</td>
                <td>${staffData.contact_no}</td>
                <td>${staffData.email}</td>
                <td>${staffData.role}</td>
                <td>${staffData.address}</td>
                <td><button class="btn btn-danger btn-sm delete-row"><i class="fa-solid fa-trash"></i></button></td>
                <td><button class="btn btn-warning btn-sm update-row"><i class="fa-solid fa-pen-to-square"></i></button></td>
            </tr>
        `;
                $("#staffTbody").append(newRow);
                $("#staffFormCard").hide();
                $("#staffForm")[0].reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Staff Added',
                    text: 'The staff member has been added successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an issue adding the staff member. Please try again.',
                });
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

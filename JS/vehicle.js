// Get the elements
const addVehicleBtn = document.getElementById('addVehicleBtn');
const vehicleFormCard = document.getElementById('vehicleFormCard');
const closeVehicleFormBtn = document.getElementById('closeVehicleForm');
let editingRow = null;

addVehicleBtn.addEventListener('click', () => {
    vehicleFormCard.style.display = 'block';
    editingRow = null;
    $("#vehicleForm")[0].reset();
});

function closeVehicleForm() {
    vehicleFormCard.style.display = 'none';
    $("#vehicleForm")[0].reset();
}

// Close button event
closeVehicleFormBtn.addEventListener('click', closeVehicleForm);

///////////////////////////////////////////////////////////////////
$(document).ready(function() {
    let editingRow = null;

    // Show the vehicle form card when "Add New Vehicle" button is clicked
    $("#addVehicleBtn").on("click", function() {
        $("#vehicleFormCard").show();
        $("#btnVehicleSave").show();
        $("#btnVehicleUpdate").hide();
        $("#vehicleForm")[0].reset();
        editingRow = null;
    });

    // Close the vehicle form card
    $("#closeVehicleForm").on("click", function() {
        $("#vehicleFormCard").hide();
        $("#vehicleForm")[0].reset();
        editingRow = null;
    });
    // Handle Save button click for adding a new vehicle
    $("#btnVehicleSave").on("click", function(event) {
        event.preventDefault();

        // Get form values
        const vehicleCode = $("#vehicleCode").val();
        const licensePlate = $("#licensePlate").val();
        const category = $("#category").val();
        const fuelType = $("#fuelType").val();
        const status = $("#status").val();
        const staffId = $("#VehicleStaffId").val();
        const newRow = `
            <tr>
                <td>${vehicleCode}</td>
                <td>${licensePlate}</td>
                <td>${category}</td>
                <td>${fuelType}</td>
                <td>${status}</td>
                <td>${staffId}</td>
                <td><button class="btn btn-danger btn-sm delete-row"><i class="fa-solid fa-trash"></i></button></td>
                <td><button class="btn btn-warning btn-sm update-row"><i class="fa-solid fa-pen-to-square"></i></button></td>
            </tr>
        `;

        // Append the new row to the table
        $("#tblVehicle tbody").append(newRow);

        // Clear the form fields and hide the form card
        $("#vehicleForm")[0].reset();
        $("#vehicleFormCard").hide();
    });

    $("#btnVehicleUpdate").on("click", function(event) {
        event.preventDefault();

        if (editingRow) {
            // Get form values
            const vehicleCode = $("#vehicleCode").val();
            const licensePlate = $("#licensePlate").val();
            const category = $("#category").val();
            const fuelType = $("#fuelType").val();
            const status = $("#status").val();
            const staffId = $("#VehicleStaffId").val();

            // Update the existing row's data
            $(editingRow).find("td:eq(0)").text(vehicleCode);
            $(editingRow).find("td:eq(1)").text(licensePlate);
            $(editingRow).find("td:eq(2)").text(category);
            $(editingRow).find("td:eq(3)").text(fuelType);
            $(editingRow).find("td:eq(4)").text(status);
            $(editingRow).find("td:eq(5)").text(staffId);

            // Show success message
            Swal.fire({
                title: "Updated!",
                text: "The row has been updated.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });

            editingRow = null;

            // Clear the form fields and hide the form card
            $("#vehicleForm")[0].reset();
            $("#vehicleFormCard").hide();
        }
    });

    // Handle delete button click for dynamically added rows
    $("#tblVehicle").on("click", ".delete-row", function() {
        const row = $(this).closest("tr");

        // Show SweetAlert confirmation dialog
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this row?",
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
                    text: "The row has been deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    });

    // Handle update button click for dynamically added rows
    $("#tblVehicle").on("click", ".update-row", function() {
        // Show the form card for updating
        vehicleFormCard.style.display = 'block';

        // Get the row data and populate form fields
        editingRow = $(this).closest("tr");
        $("#vehicleCode").val(editingRow.find("td:eq(0)").text());
        $("#licensePlate").val(editingRow.find("td:eq(1)").text());
        $("#category").val(editingRow.find("td:eq(2)").text());
        $("#fuelType").val(editingRow.find("td:eq(3)").text());
        $("#status").val(editingRow.find("td:eq(4)").text());
        $("#VehicleStaffId").val(editingRow.find("td:eq(5)").text());

        $("#btnVehicleSave").hide();
        $("#btnVehicleUpdate").show();
    });
});

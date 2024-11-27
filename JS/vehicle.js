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
$(document).ready(function () {
    loadStaffId();
    LoadVehicleData();
});
function loadStaffId() {
   $.ajax(
       {
           url: "http://localhost:9090/greenShadow/api/v1/staff",
           method: "GET",
           success: function (staff) {
               const staffIdDropdown = $("#VehicleStaffId");
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
    $.ajax(
        {
            url: "http://localhost:9090/greenShadow/api/v1/vehicle",
            method: "GET",
            success: function (vehicles) {
                LoadVehicleData(vehicles);
            },
            error: function () {
                Swal.fire('Error', 'Failed to load vehicle data. Please try again.', 'error');
            }
        }
    )
})
function LoadVehicleData(vehicles) {
    $("#tbodyVehicle").empty();
    vehicles.forEach(function (data) {
        let row = "<tr>";
        row += "<td>" + data.vehicle_code + "</td>";
        row += "<td>" + data.licensePlateNumber + "</td>";
        row += "<td>" + data.vehicleCategory + "</td>";
        row += "<td>" + data.fuelType + "</td>";
        row += "<td>" + data.status + "</td>";
        row += "<td>" + data.staff + "</td>";
        row += "<td><button class='btn btn-danger btn-sm delete-row'><i class='fa-solid fa-trash'></i></button></td>";
        row += "<td><button class='btn btn-warning btn-sm update-row'><i class='fa-solid fa-pen-to-square'></i></button></td>";
        row += "</tr>";
        $("#tbodyVehicle").append(row);
    });
}


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
        const licensePlate = $("#licensePlate").val();
        const category = $("#category").val();
        const fuelType = $("#fuelType").val();
        const status = $("#status").val();
        const staffId = $("#VehicleStaffId").val();

        // Prepare the vehicle data object
        const vehicleData = {
            licensePlateNumber: licensePlate,
            vehicleCategory: category,
            fuelType: fuelType,
            status: status,
            staff: staffId
        };

        // Send the data to the backend using AJAX
        $.ajax({
            url: "http://localhost:9090/greenShadow/api/v1/vehicle",  // Replace with your backend URL
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(vehicleData),  // Convert the object to a JSON string
            success: function(response) {
                console.log(response)
                // Optionally, show a success message or alert
                Swal.fire({
                    title: "Saved!",
                    text: "The vehicle has been saved successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                // Clear the form fields and hide the form card
                $("#vehicleForm")[0].reset();
                $("#vehicleFormCard").hide();
            },
            error: function(xhr, status, error) {
                // Handle any error that occurs during the AJAX request
                Swal.fire('Error', 'Failed to save the vehicle. Please try again.', 'error');
                console.error('Error:', xhr.responseText);  // Log the error for further inspection
            }
        });
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

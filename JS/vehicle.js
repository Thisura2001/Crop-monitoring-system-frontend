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
function LoadVehicleData(vehicles) {
    console.log(vehicles)
    $("#tbodyVehicle").empty();
    vehicles.forEach(function (data) {
        let row = "<tr>";
        row += "<td>" + data.vehicle_code + "</td>";
        row += "<td>" + data.licensePlateNumber + "</td>";
        row += "<td>" + data.vehicleCategory + "</td>";
        row += "<td>" + data.fuelType + "</td>";
        row += "<td>" + data.status + "</td>";
        row += "<td>" + data.staff || "N/A" + "</td>";
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
        let staffId = $("#VehicleStaffId").val();


        if (staffId === ""){
            staffId = null;
        }

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
            url: "http://localhost:9090/greenShadow/api/v1/vehicle",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(vehicleData),
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

                // Reload the vehicle table
                // LoadVehicleData();
            },
            error: function(xhr, status, error) {
                // Handle any error that occurs during the AJAX request
                Swal.fire('Error', 'Failed to save the vehicle. Please try again.', 'error');
                console.error('Error:', xhr.responseText);
            }
        });
    });

    let editingVehicleRow = null;
    // Handle update button click for dynamically added rows
    $("#tblVehicle").on("click", ".update-row", function() {
        editingVehicleRow = $(this).closest("tr");

        const licensePlate = $(editingVehicleRow).find("td:eq(1)").text();
        const category = $(editingVehicleRow).find("td:eq(2)").text();
        const fuelType = $(editingVehicleRow).find("td:eq(3)").text();
        const status = $(editingVehicleRow).find("td:eq(4)").text();
        const staffId = $(editingVehicleRow).find("td:eq(5)").text();


        $("#licensePlate").val(licensePlate);
        $("#category").val(category);
        $("#fuelType").val(fuelType);
        $("#status").val(status);
        $("#VehicleStaffId").val(staffId);

        // Show the form card for updating
        $("#vehicleFormCard").show();
        $("#btnVehicleSave").hide();
        $("#btnVehicleUpdate").show();
    });

    $("#btnVehicleUpdate").on("click", function(event) {
        event.preventDefault();

        // Get the Vehicle Code from the row being edited
        const vehicleCode = $(editingVehicleRow).find("td:eq(0)").text();

        // Get updated data from the form
        const licensePlate = $("#licensePlate").val();
        const category = $("#category").val();
        const fuelType = $("#fuelType").val();
        const status = $("#status").val();
        const staffId = $("#VehicleStaffId").val();

        // Prepare the data for the AJAX request
        const data = {
            licensePlateNumber: licensePlate,
            vehicleCategory: category,
            fuelType: fuelType,
            status: status,
            staff: staffId
        };

        // Send an AJAX request to the backend
        $.ajax({
            url: `http://localhost:9090/greenShadow/api/v1/vehicle/${vehicleCode}`, // Backend endpoint
            type: "PUT", // Update method
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                // Update the row in the table with the new data
                $(editingVehicleRow).find("td:eq(1)").text(licensePlate);
                $(editingVehicleRow).find("td:eq(2)").text(category);
                $(editingVehicleRow).find("td:eq(3)").text(fuelType);
                $(editingVehicleRow).find("td:eq(4)").text(status);
                $(editingVehicleRow).find("td:eq(5)").text(staffId);


                // Display success message
                Swal.fire({
                    title: "Success!",
                    text: "Vehicle updated successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                LoadVehicleData();
                // Hide the form card and reset the form
                $("#vehicleFormCard").hide();
                $("#vehicleForm")[0].reset();
                editingVehicleRow = null;
            },
            error: function (xhr, status, error) {
                // Display error message
                Swal.fire({
                    title: "Error!",
                    text: "Failed to update the vehicle. Please try again.",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false
                });
                console.error("Error:", xhr.responseText);
            }
        });
    });

    // Handle delete button click for dynamically added rows
    $("#tblVehicle").on("click", ".delete-row", function() {
        const row = $(this).closest("tr");
        const rowId = row.find("td").eq(0).text();

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
                console.log("Row ID:", rowId);

                $.ajax({
                    url: `http://localhost:9090/greenShadow/api/v1/vehicle/${rowId}`,
                    type: "DELETE",
                    success: function(response) {
                        // On success, remove the row and show a success message
                        row.remove();
                        Swal.fire({
                            title: "Deleted!",
                            text: "The row has been deleted.",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false
                        });
                    },
                    error: function(xhr, status, error) {
                        if (xhr.status === 500) {
                            // Handle 404 error
                            Swal.fire({
                                title: "Warning!",
                                text: "cannot be deleted because it is used.",
                                icon: "warning",
                                timer: 1500,
                                showConfirmButton: false
                            });
                        } else {
                        // Handle errors
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to delete the row. Please try again.",
                            icon: "error",
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                    }
                });
            }
        });
    });
});

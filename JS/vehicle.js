
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

closeVehicleFormBtn.addEventListener('click', closeVehicleForm);

///////////////////////////////////////////////////////////////////
initializeVehicle()
export function initializeVehicle() {
    loadStaffId();
    loadVehicleData();
}
function loadStaffId() {
   $.ajax(
       {
           url: "http://localhost:9090/greenShadow/api/v1/staff",
           method: "GET",
           headers: {
               "Authorization": "Bearer " + localStorage.getItem("token")
           },
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
function loadVehicleData() {
    $.ajax(
        {
            url: "http://localhost:9090/greenShadow/api/v1/vehicle",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function (vehicles) {
                renderVehicles(vehicles);
            },
            error: function () {
                Swal.fire('Error', 'Failed to load vehicle data. Please try again.', 'error');
            }
        })
}
function renderVehicles(vehicles) {
    $("#tbodyVehicle").empty();
    vehicles.forEach((vehicle) => {
        $("#tbodyVehicle").append(`
            <tr>
                <td>${vehicle.vehicle_code}</td>
                <td>${vehicle.licensePlateNumber}</td>
                <td>${vehicle.vehicleCategory}</td>
                <td>${vehicle.fuelType}</td>
                <td>${vehicle.status}</td>
                <td>${vehicle.staff}</td>
                 <td><button class='btn btn-danger btn-sm delete-row'><i class='fa-solid fa-trash'></i></button></td>
                 <td><button class='btn btn-warning btn-sm update-row'><i class='fa-solid fa-pen-to-square'></i></button></td>
            </tr>
        `);
    });
}


$(document).ready(function() {
    let editingRow = null;

    $("#addVehicleBtn").on("click", function() {
        $("#vehicleFormCard").show();
        $("#btnVehicleSave").show();
        $("#btnVehicleUpdate").hide();
        $("#vehicleForm")[0].reset();
        editingRow = null;
    });
    $("#closeVehicleForm").on("click", function() {
        $("#vehicleFormCard").hide();
        $("#vehicleForm")[0].reset();
        editingRow = null;
    });
    $("#btnVehicleSave").on("click", function(event) {
        event.preventDefault();

        const licensePlate = $("#licensePlate").val();
        const category = $("#category").val();
        const fuelType = $("#fuelType").val();
        const status = $("#status").val();
        let staffId = $("#VehicleStaffId").val();


        if (staffId === ""){
            staffId = null;
        }

        const vehicleData = {
            licensePlateNumber: licensePlate,
            vehicleCategory: category,
            fuelType: fuelType,
            status: status,
            staff: staffId
        };

        $.ajax({
            url: "http://localhost:9090/greenShadow/api/v1/vehicle",
            type: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            contentType: "application/json",
            data: JSON.stringify(vehicleData),
            success: function(response) {
                loadVehicleData();
                console.log(response)
                Swal.fire({
                    title: "Saved!",
                    text: "The vehicle has been saved successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                $("#vehicleForm")[0].reset();
                $("#vehicleFormCard").hide();
            },
            error: function(xhr, status, error) {
                Swal.fire('Error', 'Failed to save the vehicle. Please try again.', 'error');
                console.error('Error:', xhr.responseText);
            }
        });
    });

    let editingVehicleRow = null;
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

        $("#vehicleFormCard").show();
        $("#btnVehicleSave").hide();
        $("#btnVehicleUpdate").show();
    });

    $("#btnVehicleUpdate").on("click", function(event) {
        event.preventDefault();

        const vehicleCode = $(editingVehicleRow).find("td:eq(0)").text();

        const licensePlate = $("#licensePlate").val();
        const category = $("#category").val();
        const fuelType = $("#fuelType").val();
        const status = $("#status").val();
        const staffId = $("#VehicleStaffId").val();

        const data = {
            licensePlateNumber: licensePlate,
            vehicleCategory: category,
            fuelType: fuelType,
            status: status,
            staff: staffId
        };

        $.ajax({
            url: `http://localhost:9090/greenShadow/api/v1/vehicle/${vehicleCode}`,
            type: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                $(editingVehicleRow).find("td:eq(1)").text(licensePlate);
                $(editingVehicleRow).find("td:eq(2)").text(category);
                $(editingVehicleRow).find("td:eq(3)").text(fuelType);
                $(editingVehicleRow).find("td:eq(4)").text(status);
                $(editingVehicleRow).find("td:eq(5)").text(staffId);

                Swal.fire({
                    title: "Success!",
                    text: "Vehicle updated successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                LoadVehicleData();
                $("#vehicleFormCard").hide();
                $("#vehicleForm")[0].reset();
                editingVehicleRow = null;
            },
            error: function (xhr, status, error) {
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

    $("#tblVehicle").on("click", ".delete-row", function() {
        const row = $(this).closest("tr");
        const rowId = row.find("td").eq(0).text();

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
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    success: function(response) {
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

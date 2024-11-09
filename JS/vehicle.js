// Get the elements
const addVehicleBtn = document.getElementById('addVehicleBtn');
const vehicleFormCard = document.getElementById('vehicleFormCard');
const closeVehicleFormBtn = document.getElementById('closeVehicleForm');

// Function to show the vehicle form card
addVehicleBtn.addEventListener('click', () => {
    vehicleFormCard.style.display = 'block';
});

// Function to close the vehicle form card
function closeVehicleForm() {
    vehicleFormCard.style.display = 'none';
}

// Close button event
closeVehicleFormBtn.addEventListener('click', closeVehicleForm);

///////////////////////////////////////////////////////////////////
$(document).ready(function() {
    // Handle form submission
    $("#btnVehicleSave").on().click(function(event) {
        event.preventDefault(); // Prevent form from refreshing the page

        // Get form values
        const vehicleCode = $("#vehicleCode").val();
        const licensePlate = $("#licensePlate").val();
        const category = $("#category").val();
        const fuelType = $("#fuelType").val();
        const status = $("#status").val();
        const staffId = $("#VehicleStaffId").val();

        // Create a new row with form data and a delete button
        const newRow = `
            <tr>
                <td>${vehicleCode}</td>
                <td>${licensePlate}</td>
                <td>${category}</td>
                <td>${fuelType}</td>
                <td>${status}</td>
                <td>${staffId}</td>
                <td><button class="btn btn-danger btn-sm delete-row">Delete</button></td>
            </tr>
        `;

        // Append the new row to the table
        $("#tblVehicle tbody").append(newRow);

        // Clear the form fields after adding
        $("#vehicleForm")[0].reset();
        $("#vehicleFormCard").hide(); // Hide the form card if needed
    });

    // Handle delete button click for dynamically added rows
    $("#tblVehicle").on("click", ".delete-row", function() {
        $(this).closest("tr").remove();
    });
});

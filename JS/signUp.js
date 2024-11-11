function selectRole(role) {
    document.getElementById("roleDropdown").textContent = role;
}

$("#backBtn").on('click', function() {
    $("#signin").css( "display", "block");
    $("#signup").css( "display", "none");
})
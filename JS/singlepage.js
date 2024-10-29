$('#welcomePage').css("display", "block");
$('#signin').css("display", "none");
$("#signup").css("display", "none");
$("#dashboard").css("display", "none");

$("#btnSignin").on('click', function() {
    $('#welcomePage').css("display", "none");
    $('#signin').css("display", "block");
    $("#signup").css("display", "none");
    $("#dashboard").css("display", "none");
});
$("#btnlogin").on('click', function() {
    $('#welcomePage').css("display", "none");
    $('#signin').css("display", "none");
    $("#signup").css("display", "none");
    $("#dashboard").css("display", "block");
});
$("#text").on('click', function() {
    $('#welcomePage').css("display", "none");
    $('#signin').css("display", "none");
    $("#signup").css("display", "block");
    $("#dashboard").css("display", "none");
});
function selectRole(role) {
    document.getElementById('roleDropdown').innerText = role;
}
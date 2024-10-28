$('#welcomePage').css("display", "block");
$('#signin').css("display", "none");
$("#signup").css("display", "none");

$("#btnSignin").on('click', function() {
    $('#welcomePage').css("display", "none");
    $('#signin').css("display", "block");
    $("#signup").css("display", "none");
});
$("#text").on('click', function() {
    $('#welcomePage').css("display", "none");
    $('#signin').css("display", "none");
    $("#signup").css("display", "block");
});

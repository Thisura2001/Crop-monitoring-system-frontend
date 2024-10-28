$('#welcomePage').css("display", "block");
$('#signin').css("display", "none");

$("#btnSignin").on('click', function() {
    $('#welcomePage').css("display", "none");
    $('#signin').css("display", "block");
});


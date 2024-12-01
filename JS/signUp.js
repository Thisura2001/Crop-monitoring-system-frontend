
$("#backBtn").on('click', function() {
    $("#signin").css( "display", "block");
    $("#signup").css( "display", "none");
})
$("#btnSignUp").on('click', function() {
    let email = $("#email1").val();
    let password = $("#password1").val();
    let role =$("#roleDropdown").text();
})
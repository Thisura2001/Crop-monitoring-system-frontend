let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
$("#backBtn").on('click', function() {
    $("#signin").css( "display", "block");
    $("#signup").css( "display", "none");
})
$("#btnSignUp").on('click', function() {
    let email = $("#email1").val();
    let password = $("#password1").val();
    let role =$("#roleDropdown").val();

    if (email == "") {
        alert("Please enter your email");
        return;
    }
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
    }
    if (password == "") {
        alert("Please enter your password");
        return;
    }
    if (password.length <= 4) {
        alert("Password must be at least 4 characters long");
        return;
    }
    if (role == "") {
        alert("Please select your role");
        return;
    }

    let user = {
        email: email,
        password: password,
        role: role
    }
    const userJson = JSON.stringify(user);
    $.ajax({
        type: "POST",
        url: "http://localhost:9090/greenShadow/api/v1/auth/signup",
        data: userJson,
        contentType: "application/json",

        success: function (response) {
            console.log(response);
            swal.fire({
                icon: 'success',
                title: 'Signup Successful!',
                text: 'You can now sign in with your credentials.'
            })
            clearFields();
        },
        error: function (error) {
            console.log(error);
            swal.fire({
                icon: 'error',
                title: 'Something went wrong. Try again!',
            });
        }
    });
})
function clearFields() {
    $("#email1").val("");
    $("#password1").val("");
    $("#roleDropdown").val("");
}
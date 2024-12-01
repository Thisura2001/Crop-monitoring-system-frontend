$("#btnlogin").on('click', function (event) {
    event.preventDefault();

    let userName = $("#email").val();
    let password = $("#password").val();

    if (userName === "") {
        Swal.fire({
            icon: 'error',
            title: 'Signin Failed!',
            text: 'Please enter your email.'
        });
        return;
    }
    if (password === "") {
        Swal.fire({
            icon: 'error',
            title: 'Signin Failed!',
            text: 'Please enter your password.'
        });
        return;
    }

    const userData = {
        email: userName,
        password: password
    };
    const jsonData = JSON.stringify(userData);

    $.ajax({
        url: "http://localhost:9090/greenShadow/api/v1/auth/signin",
        type: "POST",
        data: jsonData,
        contentType: "application/json",
        success: function (response) {
            // Assuming the token is in response.token
            const token = response.token;
            if (token) {
                localStorage.setItem('token', token);
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome!',
                    text: 'You have successfully signed in.'
                }).then(()=>{
                    window.location.href = "#dashboard";
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Signin Failed!',
                    text: 'Invalid token received from server.'
                });
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Signin Failed!',
                text: 'Invalid email or password.'
            });
        }
    });
});

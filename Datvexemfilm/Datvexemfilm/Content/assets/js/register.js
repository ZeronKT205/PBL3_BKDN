// Registration functionality
function goToPageSignUp() {
    window.location.href = "/Home/usersignup";
}

function checkSignUp() {
    var username = document.getElementById("reg-username").value;
    var email = document.getElementById("reg-email").value;
    var password = document.getElementById("reg-password").value;
    var confirmPassword = document.getElementById("reg-confirm-password").value;

    if (username == "" || email == "" || password == "" || confirmPassword == "") {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (password != confirmPassword) {
        alert("Mật khẩu không khớp!");
        return;
    }

    // Add your registration logic here
    console.log('Registration attempt:', username, email);
}

// Registration form handling
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            // Add your registration logic here
            console.log('Registration attempt:', username, email);
        });
    }
}); 
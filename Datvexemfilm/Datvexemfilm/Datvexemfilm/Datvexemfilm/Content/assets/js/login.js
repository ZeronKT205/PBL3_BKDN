// Login functionality
function goToPageLogin() {
    window.location.href = "/Home/userlogin";
}

function goToPageLogin2() {
    window.location.href = "/Home/userlogin";
}

function checklogin() {
    var username = document.getElementById("Username").value;
    var password = document.getElementById("Password").value;
    if (username == "" || password == "") {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }
    // Add your login logic here
    console.log('Login attempt:', username);
}

// Login form handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Add your login logic here
            console.log('Login attempt:', username);
        });
    }
}); 
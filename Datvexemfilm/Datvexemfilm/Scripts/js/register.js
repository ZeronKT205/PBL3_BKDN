function goToPageLogin() {
    window.location.href = "/User/userlogin";
}
// Xử lý form đăng ký
const registerForm = document.getElementById("registerform");
if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const user = document.getElementById("Username").value;
        const email = document.getElementById("Email").value;
        const pass = document.getElementById("Password").value;
        const confirm_pass = document.getElementById("Confirm_Password").value;
        const role = "user";
        if (pass !== confirm_pass) {
            alert("Mật khẩu không khớp!");
            return;
        }

        const response = await fetch(`/User/Register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Username: user, Password: pass, Email: email ,Role:role})
        });

        const result = await response.json();
        if (result.success) {
            alert("Đăng ký thành công!");
            window.location.href = "/User/userlogin";
        } else {
            alert(result.message);
        }
    });
} 
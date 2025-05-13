function goToPageSignUp() {
    window.location.href = "/Home/usersignup";
}
// Xử lý form đăng nhập
const loginForm = document.getElementById("loginform");
if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const user = document.getElementById("Username").value;
        const pass = document.getElementById("Password").value;

        const response = await fetch("https://localhost:44343/Login/Login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: user, password: pass })
        });

        const result = await response.json();
        if (result.success) {
            if (result.role === "admin") {
                window.location.href = "/Home/adminhome";
            } else {
                saveUserInfo(result);
                window.location.href = "/Home/home";
            }
        } else {
            alert(result.message);
        }
    });
} 



function goToPageSignUp() {
    window.location.href = "/Home/usersignup";
}


document.getElementById('loginform').addEventListener('submit', async function (e) {
    e.preventDefault();
    const Username = document.getElementById('Username').value;
    const Password = document.getElementById('Password').value;

    const response = await fetch(`${window.location.origin}/Login/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username, Password })
    });
    const result = await response.json();
    if (result.success) {
        saveUserInfoLogin({
            username: result.username,
            role: result.role,
            email: result.email,
            id: result.id
        });
        window.id_user = result.id;
        // Chuyển hướng sang trang home hoặc trang phù hợp
        if (result.role == "admin") {
            window.location.href = '/Home/adminhome';
        }
        else {
            window.location.href = '/Home/home';
        }

    } else {
        alert(result.message);
    }
});



function saveUserInfoLogin(userInfo) {
    try {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
        console.error('Lỗi khi lưu thông tin người dùng:', error);
    }
}
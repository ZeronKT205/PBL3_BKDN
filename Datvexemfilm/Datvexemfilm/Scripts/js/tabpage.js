const pageLogin = "/Home/userlogin";
const pageSignUp = "usersignup";   

function goToPageLogin() {
    window.location.href = pageLogin;
}
function goToPageLogin2() {
    window.location.href = pageLogin;
}
function goToPageSignUp() {
    window.location.href = pageSignUp;
}

function toggleContent(type) {
    document.querySelectorAll(".description, .trailer, .schedule").forEach(el => el.classList.add("hidden"));
    document.querySelector("." + type).classList.remove("hidden");

    document.querySelector(".buttoncontainer__description").classList.remove("active");
    document.querySelector(".buttoncontainer__trailer").classList.remove("active");
    document.querySelector(".buttoncontainer__schedule").classList.remove("active");
    document.querySelector(".buttoncontainer__" + type).classList.add("active");
}

// CUỘN TRANG
window.addEventListener("scroll", function () {
    let navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

function closeTab() {
    document.querySelector('.schedule__Booking').classList.add("hidden");
}
function showTab() {
    document.querySelector('.schedule__Booking').classList.remove("hidden");
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
            body: JSON.stringify({ Username: user, Password: pass })
        });

        const result = await response.json();
        if (result.success) {
            if (result.role === "admin") {
                window.location.href = "Home/adminhome";
            } else {
                window.location.href = "Home/home";
            }
        } else {
            alert(result.message);
        }
    });
}

const registerForm = document.getElementById("registerform");
if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const user = document.getElementById("Username").value;
        const email = document.getElementById("Email").value;
        const pass = document.getElementById("Password").value;
        const confirm_pass = document.getElementById("Confirm_Password").value;

        if (pass !== confirm_pass) {
            alert("Mật khẩu không khớp!");
            return;
        }

        const response = await fetch("https://localhost:44343/Register/Register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Username: user, Password: pass, Email: email })
        });

        const result = await response.json();
        if (result.success) {
            alert("Đăng ký thành công!");
            window.location.href = pageLogin;
        } else {
            alert(result.message);
        }
    });
}
    async function loadfilm() {
        const response = await fetch("https://localhost:44343/Film/GetFilm", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        const movieList = document.querySelector("#movie");
        movieList.innerHTML = "";

        result.forEach(movie => {
            const movieContainer = document.createElement("div");
            movieContainer.classList.add("movie1");
            movieContainer.innerHTML = `
            <img src="/Content/${movie.src}" alt="photo" class="poster_booking">
            <p class="movie__name">${movie.name}</p>
            <p class="movie__releaseDay">KC | ${movie.releaseDay}</p>
        `;
            movieList.appendChild(movieContainer);
        });
    }
    document.addEventListener("DOMContentLoaded", loadfilm);

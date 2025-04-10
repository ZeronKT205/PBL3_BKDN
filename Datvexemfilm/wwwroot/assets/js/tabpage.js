const pageLogin = "userlogin.html"; 
const pageSignUp = "usersignup.html";
const pageLogin2 = "userlogin.html";

function goToPageLogin() {
    window.location.href = pageLogin;
}
function goToPageLogin2() {
    window.location.href = pageLogin2;
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
    if (this.window.scrollY > 50) {
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

<<<<<<< HEAD
})
=======
        const response = await fetch("http://localhost:5120/api/LoginControllers/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: user, password: pass })
        });

        const result = await response.json();
        if (result.success) {
            if (result.role == "admin") {
                window.location.href = "adminhome.html";
            } else {
                window.location.href = "home.html";
            }
        } else {
            alert(result.message);
        }
    });
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

        if (pass != confirm_pass) {
            alert("Mật khẩu không khớp!");
            return;
        }

        const response = await fetch("http://localhost:5120/api/RegisterControllers/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Username: user, Password: pass, Email: email })
        });

        const result = await response.json();
        if (result.success) {
            alert("Đăng ký thành công!");
            window.location.href = "userlogin.html";
        } else {
            alert(result.message);
        }
    });
}

// Load danh sách phim
>>>>>>> cceda27632c1bca5cd5bee75b1ceb22a72347445
async function loadfilm() {
    const response = await fetch("http://localhost:5120/api/FilmControllers/getfilm", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
<<<<<<< HEAD

    const movieList = document.querySelector("#movie");

=======
    const movieList = document.querySelector("#movie");
    movieList.innerHTML = ""; 
>>>>>>> cceda27632c1bca5cd5bee75b1ceb22a72347445
    result.forEach(movie => {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie1");
        movieContainer.innerHTML = `
            <img src="${movie.src}" alt="photo" class="poster_booking">
            <p class="movie__name">${movie.name}</p>
            <p class="movie__releaseDay">KC | ${movie.releaseDay}</p>
        `;
<<<<<<< HEAD
        movieList.appendChild(movieContainer); // Thêm phần tử vào danh sách
=======
        movieList.appendChild(movieContainer);
>>>>>>> cceda27632c1bca5cd5bee75b1ceb22a72347445
    });
}

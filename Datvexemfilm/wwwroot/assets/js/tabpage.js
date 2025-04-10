const pageLogin = "userlogin.html"; // Biến toàn cục
const pageSignUp = "usersignup.html";
const pageLogin2 = "userlogin.html"

function goToPageLogin() {
    window.location.href = pageLogin;
}
function goToPageLogin2() {
    window.location.href = pageLogin2;
}
function goToPageSignUp(){
    window.location.href = pageSignUp;
}


function toggleContent(type) {
    document.querySelectorAll(".description, .trailer, .schedule").forEach(el => el.classList.add("hidden"));
    document.querySelector("."+type).classList.remove("hidden");
    
    document.querySelector(".buttoncontainer__description").classList.remove("active");
    document.querySelector(".buttoncontainer__trailer").classList.remove("active");
    document.querySelector(".buttoncontainer__schedule").classList.remove("active");
    document.querySelector(".buttoncontainer__"+type).classList.add("active");


}

// CUỘN TRANG

window.addEventListener("scroll",function(){
    let navbar = document.querySelector(".navbar");
    if(this.window.scrollY > 50){
        navbar.classList.add("scrolled");
    }
    else{
        navbar.classList.remove("scrolled");
    }
});


function closeTab() {
    document.querySelector('.schedule__Booking').classList.add("hidden");
}
function showTab(){
    document.querySelector('.schedule__Booking').classList.remove("hidden");
}

document.getElementById("loginform").addEventListener("submit", async function(e) {
    e.preventDefault();
    const user=document.getElementById("Username").value;
    const pass=document.getElementById("Password").value;
    const response = await fetch("http://localhost:5120/api/LoginControllers/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: user, password: pass })
    });
    const result = await response.json();
    if (result.success) {
        if(result.role === "admin") {
            window.location.href = "adminhome.html"; 
        }
        else
        window.location.href = "home.html"; 
    } else {
        alert("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
    }

})
async function loadfilm(){
    const response = await fetch("http://localhost:5120/api/FilmControllers/getfilm", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const result = await response.json();
    result.forEach(movie => {
        const movieList = document.querySelector("#movie");
        movieList.innerHTML = "";
        result.forEach(movie => { 
            const movieContainer = document.createElement("div");
            movieContainer.classList.add("movie1");
            movieContainer.innerHTML = `
                <img src="${movie.src}" alt="photo" class="poster_booking">
                <p class="movie__name">${movie.name}</p>
                <p class="movie__releaseDay">KC | ${movie.releaseDay}</p>
            `;
            movieList.appendChild(movieContainer);
        });
    });
};

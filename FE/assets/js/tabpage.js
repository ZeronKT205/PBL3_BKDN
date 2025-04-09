const pageLogin = "pages/userlogin.html"; // Biến toàn cục
const pageSignUp = "../pages/usersignup.html";
const pageLogin2 = "../pages/userlogin.html"

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



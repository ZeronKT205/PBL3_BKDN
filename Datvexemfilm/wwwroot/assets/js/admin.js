document.querySelector(".navbar__logo").addEventListener("click",function(){
    location.reload();
});

function TabPage(type){
    const allPages = document.querySelectorAll(".mainPage > div");
    const allbtn = document.querySelectorAll(".navbar__management > div")

    allPages.forEach(page => {
        page.classList.add("hidden");
    })

    allbtn.forEach(page => {
        page.classList.remove("active");
    })
    document.querySelector(".mainPage__"+type).classList.remove("hidden");
    document.querySelector(".navbar__management-"+type).classList.add("active");
}
async function getUser(){
    const response = await fetch("http://localhost:5120/api/UserControllers/getuser", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    const data = await response.json();
    const userList = document.querySelector("#userlist");
    userList.innerHTML = ""; 
    index=1;
    data.forEach(user => {
        const userItem = document.createElement("tr");
        userItem.classList.add("user-item");
        userItem.innerHTML = `
            <td>${index++}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.status}</td>
            <td>${user.role}</td>
            <td>
                <button>Info</button>
            </td>
        `;
        userList.appendChild(userItem);
    });
}

//add click cho cac tab
document.querySelector(".navbar__management-Screens").addEventListener("click",function(){
    TabPage("Screens");
});
document.querySelector(".navbar__management-Movies").addEventListener("click",function(){
    TabPage("Movies");
});
document.querySelector(".navbar__management-Shows").addEventListener("click",function(){
    TabPage("Shows");
});
document.querySelector(".navbar__management-Booking").addEventListener("click",function(){
    TabPage("Booking");
});
document.querySelector(".navbar__management-SalesReport").addEventListener("click",function(){
    TabPage("SalesReport");
});
document.querySelector(".navbar__management-Users").addEventListener("click",function(){
    TabPage("Users");
});



//button close tab phan detailfilm
document.querySelector(".mainPage__Movies__Detailfilm-close").addEventListener("click",function(){
    document.querySelector(".mainPage__Movies__Detailfilm").classList.add("hidden");
});


//button edit de xem detailfilm
document.querySelector(".Editmovie1").addEventListener("click",function(){
    document.querySelector(".mainPage__Movies__Detailfilm").classList.remove("hidden");
});



//button close tab phan SeatLayout
document.querySelector(".closeScreen").addEventListener("click",function(){
    document.querySelector(".mainPage__Screens__DetailContainer").classList.add("hidden");
});

//button edit de xem detailScreen
document.querySelector(".mainPage__Screens__ContainerListCard__item").addEventListener("click",function(){
    document.querySelector(".mainPage__Screens__DetailContainer").classList.remove("hidden");
});

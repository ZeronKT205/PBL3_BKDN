//--------------------------Xử Lý các action chuyển tab, hiddenn của trang Admin Home-------------------------------------------//
// Show Welcome page by default when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Hide all pages first
    const allPages = document.querySelectorAll(".mainPage > div");
    allPages.forEach(page => {
        page.classList.add("hidden");
    });
    
    // Show welcome page
    const welcomePage = document.querySelector(".mainPage__Welcome");
    if (welcomePage) {
        welcomePage.classList.remove("hidden");
    }
});

document.querySelector(".navbar__logo").addEventListener("click", function() {
    location.reload();
});

function TabPage(type) {
    try {
        // Hide all pages
        const allPages = document.querySelectorAll(".mainPage > div");
        allPages.forEach(page => {
            page.classList.add("hidden");
        });

        // Remove active class from all menu items
        const allMenuItems = document.querySelectorAll(".navbar__management > div");
        allMenuItems.forEach(item => {
            item.classList.remove("active");
        });

        // Show selected page and activate menu item
        const selectedPage = document.querySelector(".mainPage__" + type);
        const selectedMenuItem = document.querySelector(".navbar__management-" + type);

        if (selectedPage) {
            selectedPage.classList.remove("hidden");
        }
        if (selectedMenuItem) {
            selectedMenuItem.classList.add("active");
        }

        // If it's the Users page, load user data
        // if (type === "Users") {
        //     getUser();
        // }
    } catch (error) {
        console.error("Error switching tabs:", error);
    }
}

// Add click events for all menu items
document.querySelector(".navbar__management-Users").addEventListener("click", function() {
    TabPage("Users");
});

document.querySelector(".navbar__management-Screens").addEventListener("click", function() {
    TabPage("Screens");
});

document.querySelector(".navbar__management-Movies").addEventListener("click", function() {
    TabPage("Movies");
});

document.querySelector(".navbar__management-Shows").addEventListener("click", function() {
    TabPage("Shows");
});

document.querySelector(".navbar__management-Booking").addEventListener("click", function() {
    TabPage("Booking");
});

document.querySelector(".navbar__management-FoodDrinks").addEventListener("click", function() {
    TabPage("FoodDrinks");
});

document.querySelector(".navbar__management-SalesReport").addEventListener("click", function() {
    TabPage("SalesReport");
});








//--------------------------End Xử Lý các action chuyển tab, hiddenn của trang Admin Home-------------------------------------------//



// Add event listeners for Remove buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to all Remove buttons
    document.querySelectorAll('.RemoveUser').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-userid');
            const row = this.closest('tr');
            
            if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
                // Remove the row from the table
                row.remove();
                // TODO: Add API call to delete user from database
                console.log('Deleting user with ID:', userId);
            }
        });
    });
});







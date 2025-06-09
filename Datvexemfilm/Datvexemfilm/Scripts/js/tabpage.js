
function goToPageLogin() {
    window.location.href = "/User/userlogin";
}
function goToPageSignUp() {
    window.location.href = "/User/usersignup";
}

function toggleContent(type) {
    document.querySelectorAll(".description, .trailer").forEach(el => el.classList.add("hidden"));
    document.querySelector("." + type).classList.remove("hidden");

    document.querySelector(".buttoncontainer__description").classList.remove("active");
    document.querySelector(".buttoncontainer__trailer").classList.remove("active");
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
    const modal = document.querySelector('.booking-modal');
    modal.classList.remove('hidden');
    modal.classList.add('active');
}

function closeBookingModal() {
    const modal = document.querySelector('.booking-modal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Load danh sách phim









// Xử lý chọn rạp
document.querySelectorAll('.cinema-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.cinema-item').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        // TODO: Cập nhật danh sách suất chiếu theo rạp
    });
});

// Xử lý chọn ngày
document.querySelectorAll('.date-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.date-item').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        // TODO: Cập nhật danh sách suất chiếu theo ngày
    });
});

// Xử lý chọn định dạng
document.querySelectorAll('.format-item input').forEach(item => {
    item.addEventListener('change', function() {
        // TODO: Cập nhật danh sách suất chiếu theo định dạng
    });
});

// Biến lưu thông tin đặt chỗ
let selectedShowtime = {
    date: '',
    time: '',
    screen: '',
    seats: 0
};

// Xử lý sự kiện click cho suất chiếu
document.querySelectorAll('.showtime-item').forEach(item => {
    item.addEventListener('click', function() {
        const seats = parseInt(this.dataset.seats);
        if (seats > 0) {
            // Xóa active state từ các suất chiếu khác
            document.querySelectorAll('.showtime-item').forEach(btn => btn.classList.remove('active'));
            // Thêm active state cho suất chiếu được chọn
            this.classList.add('active');

            const time = this.querySelector('.time').textContent;
            const screen = this.querySelector('.screen').textContent;
            const date = document.querySelector('.date-item.active .date').textContent;
            
            selectedShowtime = {
                date: date,
                time: time,
                screen: screen,
                seats: seats
            };
            
            showConfirmModal();
        }
    });
});



// Hiển thị form xác nhận
function showConfirmModal() {
    const confirmModal = document.querySelector('.confirm-modal');
    const movieTitle = document.querySelector('.movie-info__title').textContent;
    
    // Cập nhật thông tin trong form xác nhận
    document.getElementById('confirm-movie-title').textContent = movieTitle;
    document.getElementById('confirm-date').textContent = selectedShowtime.date;
    document.getElementById('confirm-time').textContent = selectedShowtime.time;
    document.getElementById('confirm-screen').textContent = selectedShowtime.screen;
    
    // Hiển thị form
    confirmModal.classList.remove('hidden');
    confirmModal.classList.add('active');
}

// Đóng form xác nhận
function closeConfirmModal() {
    const confirmModal = document.querySelector('.confirm-modal');
    confirmModal.classList.remove('active');
    setTimeout(() => {
        confirmModal.classList.add('hidden');
    }, 300);
}




// Xử lý checkbox điều khoản
//document.getElementById('terms-checkbox').addEventListener('change', function() {
//    const confirmBtn = document.querySelector('.confirm-modal__btn.confirm');
//    confirmBtn.disabled = !this.checked;
//});

// Chuyển hướng đến trang đặt ghế
function proceedToSeatSelection() {
    // Lưu thông tin đặt chỗ vào localStorage
    localStorage.setItem('bookingInfo', JSON.stringify({
        movieTitle: document.querySelector('.movie-info__title').textContent,
        date: selectedShowtime.date,
        time: selectedShowtime.time,
        screen: selectedShowtime.screen,
        seats: selectedShowtime.seats
    }));
    
    // Tạo và thêm element chuyển trang
    const pageTransition = document.createElement('div');
    pageTransition.className = 'page-transition';
    document.body.appendChild(pageTransition);
    
    // Kích hoạt hiệu ứng chuyển trang
    requestAnimationFrame(() => {
        pageTransition.classList.add('active');
    });
    
    // Chuyển hướng sau khi hiệu ứng hoàn thành
    setTimeout(() => {
        window.location.href = '/Booking/bookingTicket';
    }, 400);
}

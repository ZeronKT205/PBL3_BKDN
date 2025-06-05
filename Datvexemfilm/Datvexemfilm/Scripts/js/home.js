// Global variables
let dayContainer;
let showtimeList;

// Initialize variables when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    dayContainer = document.getElementById("date-list");
    showtimeList = document.querySelector(".showtime-list");
});

// Hàm khởi tạo khi trang web được tải
window.onload = function() {
    loadfilm();
    loadfilm_on();
    loadfilm_next();
};
function viewDetail(id) {
    window.location.href = `/Film/detailmovie?id=${id}`;
}

const navBtn = document.querySelector('.toggle-nav-btn');
const navBar = document.querySelector('.NavbarLeftContainer');
navBtn.addEventListener('click', () => {
    navBar.classList.toggle('show');
});
document.addEventListener('click', function(e) {
    if (!navBar.contains(e.target) && !navBtn.contains(e.target)) {
        navBar.classList.remove('show');
    }
});






// MainPoster slideshow functionality
let slides = [];
let dots = [];
const prevBtn = document.querySelector('.mainposter__button-left');
const nextBtn = document.querySelector('.mainposter__button-right');
let currentSlide = 0;
let slideInterval;

// Hàm hiển thị slide và dot tương ứng với index được chọn
function showSlide(index) {
    try {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        if (!slides[index] || !dots[index]) {
            throw new Error(`Slide or dot at index ${index} does not exist.`);
        }
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    } catch (error) {
        console.error('Error in showSlide:', error);
    }
}

// Hàm chuyển đến slide tiếp theo
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Hàm quay lại slide trước đó
function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Hàm bắt đầu tự động chuyển slide sau mỗi 6 giây
function startSlideInterval() {
    slideInterval = setInterval(nextSlide, 3000);
}

// Hàm dừng tự động chuyển slide
function stopSlideInterval() {
    clearInterval(slideInterval);
}

// Gán sự kiện cho nút prev
if (typeof prevBtn !== 'undefined' && prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlideInterval();
        startSlideInterval();
    });
}

// Gán sự kiện cho nút next
if (typeof nextBtn !== 'undefined' && nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlideInterval();
        startSlideInterval();
    });
}

// Gán sự kiện cho các dot
if (typeof dots !== 'undefined' && dots && dots.forEach) {
    dots.forEach((dot, index) => {
        if (dot) {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopSlideInterval();
                startSlideInterval();
            });
        }
    });
}

// Gán sự kiện cho mainposter
const mainPoster = document.querySelector('.mainposter');
if (mainPoster) {
    mainPoster.addEventListener('mouseenter', stopSlideInterval);
    mainPoster.addEventListener('mouseleave', startSlideInterval);
}

// Bắt đầu tự động chuyển slide
startSlideInterval();























// Carousel scroll for movie-horizontal-list
/**
 * Hàm thiết lập carousel cho danh sách phim
 * @param {string} carouselId - ID của carousel cần thiết lập
 * @param {HTMLElement} leftBtn - Nút điều hướng trái
 * @param {HTMLElement} rightBtn - Nút điều hướng phải
 */
function setupCarousel(carouselId, leftBtn, rightBtn) {
    const list = document.getElementById(carouselId);
    if (!list) {
        console.error(`Error: Carousel list with id "${carouselId}" not found.`);
        return;
    }

    const btnLeft = leftBtn;
    const btnRight = rightBtn;
    if (!btnLeft || !btnRight) {
        console.error(`Error: Navigation buttons for carousel "${carouselId}" not found.`);
        return;
    }

    const card = list.querySelector('.movie-card');
    if (!card) {
        console.error(`Error: Movie card in carousel "${carouselId}" not found.`);
        return;
    }

    const gap = parseInt(getComputedStyle(list).gap || '0') || 28;
    const cardWidth = card.offsetWidth + gap;

    // Cập nhật trạng thái nút điều hướng
    function updateBtns() {
        if (!list || !btnLeft || !btnRight) return;

        const isScrollable = list.scrollWidth > list.clientWidth;
        const isAtStart = list.scrollLeft <= 0;
        const isAtEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2;

        btnLeft.style.opacity = isScrollable && !isAtStart ? '1' : '0.5';
        btnRight.style.opacity = isScrollable && !isAtEnd ? '1' : '0.5';
        btnLeft.style.pointerEvents = isScrollable && !isAtStart ? 'auto' : 'none';
        btnRight.style.pointerEvents = isScrollable && !isAtEnd ? 'auto' : 'none';

        // Nếu không cần cuộn, ẩn nút điều hướng
        if (!isScrollable) {
            btnLeft.style.display = 'none';
            btnRight.style.display = 'none';
        } else {
            btnLeft.style.display = 'block';
            btnRight.style.display = 'block';
        }
    }

    // Xóa sự kiện cũ trước khi gắn sự kiện mới
    const newBtnLeft = btnLeft.cloneNode(true);
    const newBtnRight = btnRight.cloneNode(true);

    btnLeft.parentNode.replaceChild(newBtnLeft, btnLeft);
    btnRight.parentNode.replaceChild(newBtnRight, btnRight);

    // Gắn sự kiện click mới
    newBtnLeft.addEventListener('click', () => {
        if (!list) return;
        list.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        setTimeout(updateBtns, 400);
    });

    newBtnRight.addEventListener('click', () => {
        if (!list) return;
        list.scrollBy({ left: cardWidth, behavior: 'smooth' });
        setTimeout(updateBtns, 400);
    });

    // Thêm sự kiện scroll và resize
    list.addEventListener('scroll', updateBtns);
    window.addEventListener('resize', updateBtns);

    // Khởi tạo trạng thái ban đầu
    updateBtns();
}
document.getElementById("btnbooking").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("movie").scrollIntoView({ behavior: "smooth" });
});

// Scroll to section when click button
const btnNow = document.querySelector('.listfilmnow');
const btnFuture = document.querySelector('.listfilmfulture');
const nowSection = document.getElementById('now-showing-section');
const soonSection = document.getElementById('coming-soon-section');
if(btnNow && nowSection) {
    btnNow.addEventListener('click', function() {
        nowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}
if(btnFuture && soonSection) {
    btnFuture.addEventListener('click', function() {
        soonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// Scroll to section when click sidebar nav
const navNow = document.querySelector('.nav-nowshowing');
const navSoon = document.querySelector('.nav-comingsoon');
if(navNow && nowSection) {
    navNow.addEventListener('click', function(e) {
        e.preventDefault();
        nowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}
if(navSoon && soonSection) {
    navSoon.addEventListener('click', function(e) {
        e.preventDefault();
        soonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// Toggle dropdown thể loại
const genreBtn = document.getElementById('genreDropdownBtn');
const genreDropdown = document.getElementById('genreDropdown');
if(genreBtn && genreDropdown) {
    genreBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        genreDropdown.classList.toggle('show');
        genreBtn.classList.toggle('active');
    });
    document.addEventListener('click', function(e) {
        if (!genreDropdown.contains(e.target) && !genreBtn.contains(e.target)) {
            genreDropdown.classList.remove('show');
            genreBtn.classList.remove('active');
        }
    });
}
function AddEventBookingbtnHome() {
    // Sự kiện cho nút Đặt vé
    const btnBooks = document.querySelectorAll('.btn-book');
    btnBooks.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.style.opacity = 0;
            setTimeout(() => {
                window.location.href = "/Home/detailmovie";
            }, 500);
        });
    });
}



async function loadfilm() {
    const response = await fetch(`${window.location.origin}/Film/GetFilm`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();

    const movieList = document.querySelector("#movie");
    const movieListPoster = document.querySelector("#main_posster");
    const dotsContainer = document.querySelector(".mainposter__dots");

    movieList.innerHTML = "";
    movieListPoster.innerHTML = "";
    dotsContainer.innerHTML = "";

    result.forEach((movie, index) => {
        // Thêm phim vào danh sách
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie1");
        movieContainer.innerHTML = `
            <img src="${movie.src}" onclick="viewDetail(${movie.ID_Movie})" alt="photo" class="poster_booking">
            <p class="movie__name">${movie.name}</p>
            <p class="movie__releaseDay">KC | ${movie.releaseDay}</p>
        `;
        movieList.appendChild(movieContainer);

        // Thêm slide
        const movieSlide = document.createElement("div");
        movieSlide.classList.add("mainposter__slide");
        if (index === 0) movieSlide.classList.add("active");
        movieSlide.style.backgroundImage = `url('${movie.Poster}')`;
        movieSlide.innerHTML = `
            <div class="mainposter__content">
                <h2>${movie.name}</h2>
                <p>${movie.ShortDescription}</p>
            </div>
        `;
        movieListPoster.appendChild(movieSlide);

        // Thêm dot
        const dot = document.createElement("span");
        dot.classList.add("mainposter__dot");
        if (index === 0) dot.classList.add("active");
        dotsContainer.appendChild(dot);
    });

    // Cập nhật lại slide & dot
    updateSlideControls();
    showSlide(0);
    stopSlideInterval();
    startSlideInterval();
}
function updateSlideControls() {
    const newSlides = document.querySelectorAll('.mainposter__slide');
    const newDots = document.querySelectorAll('.mainposter__dot');

    slides = Array.from(newSlides);
    dots = Array.from(newDots);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopSlideInterval();
            startSlideInterval();
        });
    });
}


async function loadfilm_on() {
    const response = await fetch(`${window.location.origin}/Film/GetFilm_ON`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    movieList = document.querySelector("#now-showing");
    movieList.innerHTML = "";

    result.forEach(movie => {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-card");
        movieContainer.setAttribute("data-id", movie.ID_Movie);
        movieContainer.innerHTML = `
            <img src="${movie.src}" alt="Phim 2">
                        <div class="movie-card-overlay">
                            <div class="movie-info-list">
                                <div class="movie-info-item"><i class="fa fa-film"></i> <span>${movie.Type}</span></div>
                                <div class="movie-info-item"><i class="fa fa-clock"></i> <span>${movie.Duration}'</span></div>
                                <div class="movie-info-item"><i class="fa fa-flag"></i> <span>${movie.Language}</span></div>
                                <div class="movie-info-item"><i class="fa fa-language"></i> <span>Tiếng Việt</span></div>
                            </div>
                            <div class="movie-card-btns">
                                <button class="btn-book open-booking-btn">Đặt vé</button>
                                <button class="btn-trailer" onclick="viewDetail(${movie.ID_Movie})">Chi tiết</button>
                            </div>
                        </div>
                        <div class="movie-card-title">${movie.name}</div>
                        <div class="movie-card-release"><i class="fa fa-calendar-alt"></i>Khởi chiếu: ${movie.releaseDay}</div>
        `;
        movieList.appendChild(movieContainer);
    });

    // Add event listeners for booking buttons
    document.querySelectorAll(".open-booking-btn").forEach(btn => {
        btn.addEventListener("click", async function(e) {
            e.preventDefault();
            const filmEl = this.closest(".movie-card");
            const filmId = filmEl.getAttribute("data-id");
            
            // Get movie details
            const movieTitle = filmEl.querySelector(".movie-card-title").textContent;
            const moviePoster = filmEl.querySelector("img").src;
            const movieMeta = filmEl.querySelector(".movie-info-list").innerHTML;
            
            // Update modal content
            document.getElementById("modal-movie-poster").src = moviePoster;
            document.getElementById("modal-movie-title").textContent = movieTitle;
            document.getElementById("modal-movie-meta").innerHTML = movieMeta;
            
            // Show modal
            const modal = document.querySelector(".booking-modal");
            modal.classList.remove("hidden");
            modal.classList.add("active");
            
            // Load show days
            await loadShowDays(filmId);
        });
    });

    const nowShowingLeftBtn = document.querySelector('.movie-carousel-nav-btn.left[data-target="now-showing"]');
    const nowShowingRightBtn = document.querySelector('.movie-carousel-nav-btn.right[data-target="now-showing"]');
    setupCarousel('now-showing', nowShowingLeftBtn, nowShowingRightBtn);
}
async function loadfilm_next() {
    const response = await fetch(`${window.location.origin}/Film/GetFilm_Next`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const result = await response.json();
    movieList = document.querySelector("#coming-soon");
    movieList.innerHTML = "";

    result.forEach(movie => {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-card");
        movieContainer.setAttribute("data-id", movie.ID_Movie);
        movieContainer.innerHTML = `
            <img src="${movie.src}" alt="Phim 2">
                        <div class="movie-card-overlay">
                            <div class="movie-info-list">
                                <div class="movie-info-item"><i class="fa fa-film"></i> <span>${movie.Type}</span></div>
                                <div class="movie-info-item"><i class="fa fa-clock"></i> <span>${movie.Duration}'</span></div>
                                <div class="movie-info-item"><i class="fa fa-flag"></i> <span>${movie.Language}</span></div>
                                <div class="movie-info-item"><i class="fa fa-language"></i> <span>Tiếng Việt</span></div>
                            </div>
                            <div class="movie-card-btns">
                                <button class="btn-book open-booking-btn">Đặt vé</button>
                                <button class="btn-trailer" onclick="viewDetail(${movie.ID_Movie})">Chi tiết</button>
                            </div>
                        </div>
                        <div class="movie-card-title">${movie.name}</div>
                        <div class="movie-card-release"><i class="fa fa-calendar-alt"></i>Khởi chiếu: ${movie.releaseDay}</div>
        `;
        movieList.appendChild(movieContainer);
    });

    // Add event listeners for booking buttons
    document.querySelectorAll(".open-booking-btn").forEach(btn => {
        btn.addEventListener("click", async function(e) {
            e.preventDefault();
            const filmEl = this.closest(".movie-card");
            const filmId = filmEl.getAttribute("data-id");
            
            // Get movie details
            const movieTitle = filmEl.querySelector(".movie-card-title").textContent;
            const moviePoster = filmEl.querySelector("img").src;
            const movieMeta = filmEl.querySelector(".movie-info-list").innerHTML;
            
            // Update modal content
            document.getElementById("modal-movie-poster").src = moviePoster;
            document.getElementById("modal-movie-title").textContent = movieTitle;
            document.getElementById("modal-movie-meta").innerHTML = movieMeta;
            
            // Show modal
            const modal = document.querySelector(".booking-modal");
            modal.classList.remove("hidden");
            modal.classList.add("active");
            
            // Load show days
            await loadShowDays(filmId);
        });
    });

    const nowShowingLeftBtn = document.querySelector('.movie-carousel-nav-btn.left[data-target="coming-soon"]');
    const nowShowingRightBtn = document.querySelector('.movie-carousel-nav-btn.right[data-target="coming-soon"]');
    setupCarousel('coming-soon', nowShowingLeftBtn, nowShowingRightBtn);
}

// Add close modal functionality
function closeBookingModal() {
    const modal = document.querySelector(".booking-modal");
    modal.classList.remove("active");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
}

// Close modal when clicking outside
document.querySelector(".booking-modal").addEventListener("click", function(e) {
    if (e.target === this) {
        closeBookingModal();
    }
});

// Add these functions after the existing code
function parseDateFromAspNet(dateStr) {
    const match = dateStr.match(/\d+/);
    if (!match) return null;
    const timestamp = parseInt(match[0]);
    const date = new Date(timestamp);
    const serverTimezoneOffset = 7 * 60;
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + serverTimezoneOffset);
    return date;
}

function formatDisplayDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
}

function formatAPIDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

async function loadShowDays(filmId) {
    try {
        const response = await fetch(`${window.location.origin}/Show/getDay?id=${filmId}`);
        const days = await response.json();

        const validDays = days
            .filter(p => p.Day)
            .map(p => ({
                original: p,
                date: parseDateFromAspNet(p.Day)
            }))
            .sort((a, b) => a.date - b.date);

        dayContainer.innerHTML = '';

        validDays.forEach((p, index) => {
            const displayDate = formatDisplayDate(p.date);
            const apiDate = formatAPIDate(p.date);

            const button = document.createElement("button");
            button.className = "date-item";
            button.innerHTML = `
                <span class="day">Ngày</span>
                <span class="date">${displayDate}</span>
            `;

            button.addEventListener("click", () => {
                document.querySelectorAll(".date-item").forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                loadShowtimes(filmId, apiDate);
            });

            dayContainer.appendChild(button);

            if (index === 0) {
                button.classList.add("active");
                loadShowtimes(filmId, apiDate);
            }
        });
    } catch (e) {
        console.error("Lỗi lấy ngày chiếu:", e);
    }
}

async function loadShowtimes(filmId, day) {
    try {
        const response = await fetch(`${window.location.origin}/Show/getShowofDay?id=${filmId}&Day=${day}`);
        const shows = await response.json();

        showtimeList.innerHTML = '';

        shows.forEach(show => {
            const startHour = String(show.Start_Movie.Hours).padStart(2, '0');
            const startMinute = String(show.Start_Movie.Minutes).padStart(2, '0');
            const endHour = String(show.End_Movie.Hours).padStart(2, '0');
            const endMinute = String(show.End_Movie.Minutes).padStart(2, '0');

            const button = document.createElement("button");
            button.className = "showtime-item";
            button.innerHTML = `
                <span class="time">${startHour}:${startMinute} - ${endHour}:${endMinute}</span>
                <span class="screen">${show.Name}</span>
            `;

            button.addEventListener("click", () => {
                window.location.href = `/Ticket/seat_booking?show_id=${show.Show_ID}&room_id=${show.Room_ID}`;
            });

            showtimeList.appendChild(button);
        });

    } catch (err) {
        console.error("Lỗi lấy suất chiếu:", err);
    }
}

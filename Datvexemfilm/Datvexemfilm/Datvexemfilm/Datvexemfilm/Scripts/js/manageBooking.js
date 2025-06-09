//---------------------------------chức năng xem hóa đơn trong quản lý vé---------------------------------//

// Xử lý Modal Hóa Đơn
const invoiceModalBooking = document.getElementById('invoiceModal');
const closeInvoiceBtnBooking = document.querySelector('.closeInvoice');

// List lưu dữ liệu từ API
let bookingDataList = [];

document.addEventListener('DOMContentLoaded', function () {
    loadtick();
});

// Thêm sự kiện click cho nút View
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-btn')) {
        const row = e.target.closest('tr');
        const invoiceId = row.cells[0].textContent;
        showInvoice(invoiceId);
    }
});

// Hàm hiển thị hóa đơn
function showInvoice(invoiceId) {
    try {
        // Tìm thông tin trong list dữ liệu
        const bookingData = bookingDataList.find(item => {
            // Chuyển đổi cả hai ID về string để so sánh
            const itemId = String(item.Id).padStart(6, '0');
            const searchId = String(invoiceId).padStart(6, '0');
            return itemId === searchId;
        });

        if (!bookingData) {
            throw new Error('Không tìm thấy thông tin hóa đơn');
        }

        // Hiển thị thông tin trong modal   
        const modal = document.getElementById('invoiceModal');
        if (!modal) {
            throw new Error('Không tìm thấy modal');
        }

        // Cập nhật thông tin hóa đơn
        const invoiceInfo = modal.querySelector('.invoiceInfo');
        if (invoiceInfo) {
            invoiceInfo.innerHTML = `
                <div class="invoiceInfo__item">
                    <span class="label">Mã Hóa Đơn:</span>
                    <span class="value">${String(bookingData.Id).padStart(6, '0')}</span>
                </div>
                <div class="invoiceInfo__item">
                    <span class="label">Ngày Đặt:</span>
                    <span class="value">${bookingData.BookingDate || ''}</span>
                </div>
                <div class="invoiceInfo__item">
                    <span class="label">Khách Hàng:</span>
                    <span class="value">${bookingData.Name_User || ''}</span>
                </div>
            `;
        }

        // Cập nhật thông tin vé
        const movieInfo = modal.querySelector('.movieInfo');
        if (movieInfo) {
            movieInfo.innerHTML = `
                <h3>Thông Tin Vé</h3>
                <div class="movieInfo__item">
                    <span class="label">Tên Phim:</span>
                    <span class="value">${bookingData.Title || ''}</span>
                </div>
                <div class="movieInfo__item">
                    <span class="label">Suất Chiếu:</span>
                    <span class="value">${bookingData.Showtime || ''}</span>
                </div>
                <div class="movieInfo__item">
                    <span class="label">Phòng Chiếu:</span>
                    <span class="value">${bookingData.CinemaRoom || ''}</span>
                </div>
                <div class="movieInfo__item">
                    <span class="label">Ghế:</span>
                    <span class="value">${bookingData.Seat || ''}</span>
                </div>
            `;
        }

        // Cập nhật thông tin đồ ăn
        const foodInfo = modal.querySelector('.foodInfo');
        if (foodInfo) {
            const foodItems = bookingData.Combo && bookingData.Combo.length > 0 
                ? bookingData.Combo.map(item => `
                    <div class="foodItem">
                        <span class="name">${item.Name} X ${item.Quantity}</span>
                        <span class="price">${item.Price}</span>
                    </div>
                `).join('')
                : '<div class="foodItem">Không có đồ ăn</div>';

            foodInfo.innerHTML = `
                <h3>Đồ Ăn & Thức Uống</h3>
                <div class="foodInfo__items" id="foodItems">
                    ${foodItems}
                </div>
            `;
        }

        // Cập nhật tổng tiền
        const invoiceTotal = modal.querySelector('.invoiceTotal');
        if (invoiceTotal) {
            // Calculate food price first
            const totalFood = bookingData.Combo 
                ? bookingData.Combo.reduce((sum, item) => sum + parseFloat(item.Price), 0) * 1000
                : 0;
            
            // Get total price and subtract food price to get ticket price
            const totalPrice = parseFloat(bookingData.Price.replace(/[^\d]/g, '')) || 0;
            const ticketPrice = totalPrice - totalFood;
            
            invoiceTotal.innerHTML = `
            <div class="totalItem">
                <span class="label">Tiền Vé:</span>
                <span class="value">${ticketPrice.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            <div class="totalItem">
                <span class="label">Tiền Đồ Ăn:</span>
                <span class="value">${totalFood.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            <div class="totalItem grandTotal">
                <span class="label">Tổng Cộng:</span>
                <span class="value">${totalPrice.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            `;
        }

        // Hiển thị modal
        modal.classList.remove('hidden');
    } catch (error) {
        console.error('Error showing invoice:', error);
        alert('Có lỗi xảy ra khi hiển thị hóa đơn: ' + error.message);
    }
}

// Đóng modal hóa đơn
function closeinvoiceModalBooking() {
    invoiceModalBooking.classList.add('hidden');
}

// Thêm sự kiện đóng modal
closeInvoiceBtnBooking.addEventListener('click', closeinvoiceModalBooking);
invoiceModalBooking.addEventListener('click', function(e) {
    if (e.target === invoiceModalBooking) {
        closeinvoiceModalBooking();
    }
});


//---------------------------------End chức năng xem hóa đơn trong quản lý vé---------------------------------//




//-----------------------------------chức năng lọc vé trong quản lý vé-----------------------------------//

// --- Lọc vé theo ngày, phòng chiếu, tên phim ---
const bookingTable2Booking = document.querySelector('.mainPage__Booking__containerinfo-table tbody');
const filterDateBooking = document.querySelector('.mainPage__Booking__Containersearch-date-input');
const filterScreenBooking = document.querySelector('.mainPage__Booking__Containersearch-screen-select');
const filterMovieBooking = document.querySelector('.mainPage__Booking__Containersearch-movie-select');

function filterBookingTable() {
  const dateVal = filterDateBooking.value;
  const screenVal = filterScreenBooking.value.toLowerCase();
  const movieVal = filterMovieBooking.value.toLowerCase();
  Array.from(bookingTable2Booking.rows).forEach(row => {
    const rowDate = row.cells[3].textContent.trim();
    const rowScreen = row.cells[4].textContent.trim().toLowerCase();
    const rowMovie = row.cells[2].textContent.trim().toLowerCase();
    let show = true;
    if (dateVal && rowDate !== dateVal) show = false;
    if (screenVal !== '0' && rowScreen !== screenVal) show = false;
    if (movieVal !== '0' && rowMovie !== movieVal) show = false;
    row.style.display = show ? '' : 'none';
  });
}
if (bookingTable2Booking && filterDateBooking && filterScreenBooking && filterMovieBooking) {
  filterDateBooking.addEventListener('change', filterBookingTable);
  filterScreenBooking.addEventListener('change', filterBookingTable);
  filterMovieBooking.addEventListener('change', filterBookingTable);
}

window.loadtick = async function () {
    try {
        const response = await fetch("https://localhost:44343/Booking/gettick", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        bookingDataList = data;

        // Cập nhật danh sách phim và phòng từ dữ liệu suất chiếu
        updateMovieAndScreenLists(data);

        // Sửa lại selector để chắc chắn tìm đúng tbody
        const tbody = document.querySelector('.mainPage__Booking__containerinfo-table tbody');
        tbody.innerHTML = '';
        data.forEach(tick => {
            const _show = document.createElement("tr");
            _show.innerHTML = `
                <td>${tick.Id}</td>
                <td>${tick.Name_User}</td>
                <td>${tick.Title}</td>
                <td>${tick.BookingDate}</td>
                <td>${tick.CinemaRoom}</td>
                <td>${tick.Price}</td>
                <td>
                    <button class="view-btn">View</button>
                </td>
            `;
            tbody.appendChild(_show);
        });
       
    } catch (error) {
        console.error('Error in loadtick:', error);
    }
}

function updateMovieAndScreenLists(showData) {
    try {
        // Tạo Set để loại bỏ các giá trị trùng lặp
        const uniqueMovies = new Set();
        const uniqueScreens = new Set();

        // Lấy danh sách phim và phòng từ dữ liệu suất chiếu
        showData.forEach(show => {
            uniqueMovies.add(show.Title);
            uniqueScreens.add(show.CinemaRoom);
        });

        // Cập nhật listbox phim
        const movieSelect = document.querySelector('.mainPage__Booking__Containersearch-movie-select');
        if (movieSelect) {
            // Giữ lại option đầu tiên
            movieSelect.innerHTML = '<option value="0">Tất Cả Phim</option>';
            // Thêm các phim mới
            uniqueMovies.forEach(movieName => {
                const option = document.createElement('option');
                option.value = movieName;
                option.textContent = movieName;
                movieSelect.appendChild(option);
            });
        }

        // Cập nhật listbox phòng
        const screenSelect = document.querySelector('.mainPage__Booking__Containersearch-screen-select');
        if (screenSelect) {
            // Giữ lại option đầu tiên
            screenSelect.innerHTML = '<option value="0">Phòng Chiếu</option>';
            // Thêm các phòng mới
            uniqueScreens.forEach(screenName => {
                const option = document.createElement('option');
                option.value = screenName;
                option.textContent = screenName;
                screenSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error updating movie and screen lists:', error);
    }
}

//-----------------------------------End chức năng lọc vé trong quản lý vé-----------------------------------//




/*
Note: Cần têm các hàm để xử lý các việc như:
 - Load các vé ra table
 - load combobox các phòng chiếu
 - load combobox các phim
 - KHi nhấn vào nút view để xem chi tiết hóa đơn thì hãy check thông tin của vé thông qua ID
 lấy thông tin từ backend sau đó thêm vào dữ liệu trong hàm showInvoice

*/


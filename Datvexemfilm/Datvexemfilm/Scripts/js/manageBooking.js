//---------------------------------chức năng xem hóa đơn trong quản lý vé---------------------------------//

// Xử lý Modal Hóa Đơn
const invoiceModalBooking = document.getElementById('invoiceModal');
const closeInvoiceBtnBooking = document.querySelector('.closeInvoice');

// Thêm sự kiện click cho nút View
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-btn')) {
        const row = e.target.closest('tr');
        const invoiceId = row.cells[0].textContent;
        showInvoice(invoiceId);
    }
});

// Hàm hiển thị hóa đơn (chuẩn bị cho backend)
function showInvoice(invoiceId) {
    // Sau này sẽ fetch từ backend bằng invoiceId, thay dữ liệu là xong
    
    // Dữ liệu mẫu hoàn chỉnh:
    const bookingData = {
        id: invoiceId,
        date: "2023-10-01",
        username: "john_doe",
        movie: "The Dark Knight",
        time: "18:00",
        screen: "Screen A",
        seats: "A1, A2, A3",
        ticketPrice: 150000,
        food: [
            { name: "Bắp rang bơ", quantity: 2, price: 40000 },
            { name: "Coca Cola", quantity: 2, price: 30000 }
        ],
        foodPrice: 70000,
        totalPrice: 220000
    };
    // Cập nhật thông tin hóa đơn
    document.getElementById('invoiceId').textContent = bookingData.id;
    document.getElementById('bookingDate').textContent = bookingData.date;
    document.getElementById('customerName').textContent = bookingData.username;
    document.getElementById('movieName').textContent = bookingData.movie;
    document.getElementById('showTime').textContent = bookingData.time;
    document.getElementById('screenName').textContent = bookingData.screen;
    document.getElementById('seats').textContent = bookingData.seats;
    // Cập nhật thông tin đồ ăn
    const foodItemsContainer = document.getElementById('foodItems');
    foodItemsContainer.innerHTML = '';
    if (bookingData.food && bookingData.food.length > 0) {
        bookingData.food.forEach(item => {
            const foodItem = document.createElement('div');
            foodItem.className = 'foodItem';
            foodItem.innerHTML = `
                <span class="name">${item.name}</span>
                <span class="quantity">x${item.quantity}</span>
                <span class="price">${item.price.toLocaleString()}đ</span>
            `;
            foodItemsContainer.appendChild(foodItem);
        });
    } else {
        foodItemsContainer.innerHTML = '<div class="no-food">Không có đồ ăn</div>';
    }
    // Cập nhật tổng tiền
    document.getElementById('ticketAmount').textContent = `${bookingData.ticketPrice.toLocaleString()}đ`;
    document.getElementById('foodAmount').textContent = `${bookingData.foodPrice.toLocaleString()}đ`;
    document.getElementById('totalAmount').textContent = `${bookingData.totalPrice.toLocaleString()}đ`;
    // Hiển thị modal
    invoiceModalBooking.classList.remove('hidden');
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


//-----------------------------------End chức năng lọc vé trong quản lý vé-----------------------------------//




/*
Note: Cần têm các hàm để xử lý các việc như:
 - Load các vé ra table
 - load combobox các phòng chiếu
 - load combobox các phim
 - KHi nhấn vào nút view để xem chi tiết hóa đơn thì hãy check thông tin của vé thông qua ID
 lấy thông tin từ backend sau đó thêm vào dữ liệu trong hàm showInvoice

*/


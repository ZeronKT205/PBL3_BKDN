// Giá vé mỗi ghế (có thể thay đổi)
const TICKET_PRICE = 50000;

// Mảng lưu các ghế đã chọn
let selectedSeats = [];

// Hàm xử lý khi click vào ghế
function handleSeatSelection(seat) {
    const seatNumber = seat.textContent;
    const seatList = document.querySelector('.seat-list');
    const ticketNumber = document.querySelector('.MainContainer__DetailBooking-ticketNumber .movie-detail-value');
    const totalPrice = document.querySelector('.MainContainer__DetailBooking-totalPrice .price');

    if (seat.classList.contains('selected')) {
        // Bỏ chọn ghế
        seat.classList.remove('selected');
        seat.classList.add('available');
        
        // Xóa ghế khỏi danh sách
        selectedSeats = selectedSeats.filter(s => s !== seatNumber);
        
        // Cập nhật hiển thị
        updateSeatList(seatList);
        updateTicketCount(ticketNumber);
        updateTotalPrice(totalPrice);
    } else {
        // Chọn ghế
        seat.classList.remove('available');
        seat.classList.add('selected');
        
        // Thêm ghế vào danh sách
        selectedSeats.push(seatNumber);
        
        // Cập nhật hiển thị
        updateSeatList(seatList);
        updateTicketCount(ticketNumber);
        updateTotalPrice(totalPrice);
    }
}

// Hàm cập nhật hiển thị danh sách ghế
function updateSeatList(seatList) {
    seatList.innerHTML = '';
    selectedSeats.forEach(seat => {
        const seatSpan = document.createElement('span');
        seatSpan.textContent = seat;
        seatList.appendChild(seatSpan);
    });
}

// Hàm cập nhật số vé
function updateTicketCount(ticketNumber) {
    ticketNumber.textContent = selectedSeats.length;
}

// Hàm cập nhật tổng tiền
function updateTotalPrice(totalPrice) {
    const total = selectedSeats.length * TICKET_PRICE;
    totalPrice.textContent = `${total.toLocaleString('vi-VN')} VNĐ`;
}

// Hàm reset tất cả ghế
function resetAllSeats() {
    selectedSeats = [];
    const seats = document.querySelectorAll('.seats-container .available, .seats-container .selected');
    seats.forEach(seat => {
        seat.classList.remove('selected');
        seat.classList.add('available');
    });
    
    // Reset hiển thị
    const seatList = document.querySelector('.seat-list');
    const ticketNumber = document.querySelector('.MainContainer__DetailBooking-ticketNumber .movie-detail-value');
    const totalPrice = document.querySelector('.MainContainer__DetailBooking-totalPrice .price');
    
    updateSeatList(seatList);
    updateTicketCount(ticketNumber);
    updateTotalPrice(totalPrice);
}

// Thêm sự kiện cho các ghế
function addSeatClickEvents() {
    const seats = document.querySelectorAll('.seats-container .available, .seats-container .selected');
    seats.forEach(seat => {
        // Xóa các event listener cũ nếu có
        seat.removeEventListener('click', handleSeatSelection);
        // Thêm event listener mới
        seat.addEventListener('click', () => handleSeatSelection(seat));
    });
}

// Thêm sự kiện cho nút Reset
document.querySelector('.MainContainer__DetailBooking-btn-reset').addEventListener('click', resetAllSeats);

// Khởi tạo khi trang được load
document.addEventListener('DOMContentLoaded', () => {
    // Đợi một chút để đảm bảo các ghế đã được tạo
    setTimeout(() => {
        addSeatClickEvents();
    }, 100);
}); 
// Giá vé mỗi ghế (có thể thay đổi)
const TICKET_PRICE = 50000;

// Mảng lưu các ghế đã chọn
let selectedSeats = [];

// Hàm tạo layout ghế
function loadSeats(rows, cols) {
    const seatsContainer = document.getElementById('seats-container');
    seatsContainer.innerHTML = ''; // Xóa nội dung cũ

    // Tạo ma trận ghế
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'seat-row';
        row.style.display = 'flex';

        for (let j = 0; j < cols; j++) {
            const seat = document.createElement('button');
            const seatNumber = `${String.fromCharCode(65 + i)}${j + 1}`; // A1, A2, B1, B2,...
            
            seat.className = 'available';
            seat.textContent = seatNumber;
            seat.dataset.seat = seatNumber;

            // Thêm sự kiện click
            seat.addEventListener('click', () => handleSeatClick(seat));
            
            row.appendChild(seat);
        }
        seatsContainer.appendChild(row);
    }
}

// Hàm xử lý khi click vào ghế
function handleSeatClick(seat) {
    const seatNumber = seat.dataset.seat;
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
        updateSeatDisplay(seatList);
        updateTicketCount(ticketNumber);
        updateTotalPrice(totalPrice);
    } else {
        // Chọn ghế
        seat.classList.remove('available');
        seat.classList.add('selected');
        
        // Thêm ghế vào danh sách
        selectedSeats.push(seatNumber);
        
        // Cập nhật hiển thị
        updateSeatDisplay(seatList);
        updateTicketCount(ticketNumber);
        updateTotalPrice(totalPrice);
    }
}

// Hàm cập nhật hiển thị danh sách ghế
function updateSeatDisplay(seatList) {
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
function resetSeats() {
    selectedSeats = [];
    const seats = document.querySelectorAll('.seats-container button');
    seats.forEach(seat => {
        seat.classList.remove('selected');
        seat.classList.add('available');
    });
    
    // Reset hiển thị
    const seatList = document.querySelector('.seat-list');
    const ticketNumber = document.querySelector('.MainContainer__DetailBooking-ticketNumber .movie-detail-value');
    const totalPrice = document.querySelector('.MainContainer__DetailBooking-totalPrice .price');
    
    updateSeatDisplay(seatList);
    updateTicketCount(ticketNumber);
    updateTotalPrice(totalPrice);
}

// Thêm sự kiện cho nút Reset
document.querySelector('.MainContainer__DetailBooking-btn-reset').addEventListener('click', resetSeats);

// Khởi tạo layout ghế khi trang được load
document.addEventListener('DOMContentLoaded', () => {
    loadSeats(4, 5);
});

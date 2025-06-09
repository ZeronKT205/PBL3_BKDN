// Giá vé mỗi ghế (có thể thay đổi)
const TICKET_PRICE = Price;

// Mảng lưu các ghế đã chọn
let selectedSeats = [];

// Mảng lưu các ghế đã được đặt (booked) - biến toàn cục
let bookedSeats = [];

// Hàm tạo layout ghế
function loadSeats(rows, cols, booked) {
    // Nếu booked là chuỗi thì tách thành mảng
    if (typeof booked === 'string') {
        booked = booked.split(',').map(seat => seat.trim());
    }

    // Nếu vẫn không phải mảng thì gán rỗng
    booked = Array.isArray(booked) ? booked : [];

    // Gán bookedSeats toàn cục để dùng ở resetSeats
    bookedSeats = booked;

    const seatsContainer = document.getElementById('seats-container');
    seatsContainer.innerHTML = ''; // Xóa nội dung cũ

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'seat-row';
        row.style.display = 'flex';

        for (let j = 0; j < cols; j++) {
            const seat = document.createElement('button');
            const seatNumber = `${String.fromCharCode(65 + i)}${j + 1}`; // A1, A2, B1, ...

            seat.textContent = seatNumber;
            seat.dataset.seat = seatNumber;

            if (booked.includes(seatNumber)) {
                seat.className = 'booked';
                seat.disabled = true;
            } else {
                seat.className = 'available';
                seat.addEventListener('click', () => handleSeatClick(seat));
            }
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

    const seats = document.querySelectorAll('#seats-container button');
    seats.forEach(seat => {
        const seatNumber = seat.dataset.seat;
        if (bookedSeats.includes(seatNumber)) {
            // Ghế đã booked: disable và class booked
            seat.classList.remove('selected', 'available');
            seat.classList.add('booked');
            seat.disabled = true;
        } else {
            // Ghế chưa booked: cho phép chọn lại
            seat.classList.remove('selected', 'booked');
            seat.classList.add('available');
            seat.disabled = false;
        }
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
const btn_reset_DetilBooking = document.querySelector('.MainContainer__DetailBooking-btn-reset');
if (btn_reset_DetilBooking) {
    btn_reset_DetilBooking.addEventListener('click', resetSeats);
}


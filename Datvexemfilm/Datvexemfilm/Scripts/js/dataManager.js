//--------Xử lý localStorage khi load từ trang bookingTicket.html sang trang Payment.html--------

/**
 * Hàm lưu thông tin đặt vé vào LocalStorage
 * @param {Object} bookingInfo - Thông tin đặt vé bao gồm:
 * @param {string} bookingInfo.movieName - Tên phim
 * @param {string} bookingInfo.cinema - Tên rạp chiếu
 * @param {string} bookingInfo.date - Ngày chiếu
 * @param {string} bookingInfo.time - Giờ chiếu
 * @param {Array} bookingInfo.seats - Danh sách ghế đã chọn
 * @param {string} bookingInfo.numberTicket - Số lượng vé
 * @param {number} bookingInfo.totalPrice - Tổng tiền
 */

//lưu đối tượng dưới dạng key-value vào local storage
function saveBookingInfo(bookingInfo) {
    try {
        localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
        console.log('Đã lưu thông tin đặt vé thành công');
    } catch (error) {
        console.error('Lỗi khi lưu thông tin đặt vé:', error);
    }
}

/**
 * Hàm lấy thông tin đặt vé từ LocalStorage
 * @returns {Object|null} Thông tin đặt vé hoặc null nếu không có
 */
function getBookingInfo() {
    try {
        const bookingInfo = localStorage.getItem('bookingInfo');
        return bookingInfo ? JSON.parse(bookingInfo) : null;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin đặt vé:', error);
        return null;
    }
}

/**
 * Hàm xóa thông tin đặt vé khỏi LocalStorage
 */
function clearBookingInfo() {
    try {
        localStorage.removeItem('bookingInfo');
        console.log('Đã xóa thông tin đặt vé');
    } catch (error) {
        console.error('Lỗi khi xóa thông tin đặt vé:', error);
    }
}

// Thêm sự kiện cho nút chuyển đến trang thanh toán
document.addEventListener('DOMContentLoaded', function() {
    const paymentBtn = document.querySelector('.MainContainer__DetailBooking-btn-submit');
    if (paymentBtn) {
        paymentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Lấy thông tin đặt vé từ form hoặc các phần tử khác
            const bookingInfo = {
                movieName: document.querySelector('.MainContainer__DetailBooking-name').textContent,
                cinema: document.querySelector('.cinema-name').textContent,
                date: document.querySelector('.show-date').textContent,
                time: document.querySelector('.show-time').textContent,
                seats: Array.from(document.querySelectorAll('.seat-list span')).map(seat => seat.textContent.trim()),
                numberTicket: document.querySelector('.number-ticket').textContent,
                totalPrice: document.querySelector('.total-price').textContent
            };
            
            // Lưu thông tin vào LocalStorage
            saveBookingInfo(bookingInfo);
            
            // Chuyển hướng đến trang thanh toán
            document.body.style.opacity = 0;
            setTimeout(() => {
                window.location.href = '../FE/Payment.html';
            }, 500);
        });
    }
});

/*

Lưu ý sử dụng thì khi chuyển sang trang khác khi nhấn nút xác nhận thì dữ liệu sẽ được lưu vào local storage, khi sang trang payment thì
sẽ thêm hàm getBookingInfo() để lấy dữ liệu từ local storage

-------
Local storage sẽ lưu dữ liệu dưới dạng key-value và nó đóng vai trò như một đám mây lưu trữ dữ liệu trên trình duyệt.

*/

//--------End Xử lý localStorage khi load từ trang bookingTicket.html sang trang Payment.html--------

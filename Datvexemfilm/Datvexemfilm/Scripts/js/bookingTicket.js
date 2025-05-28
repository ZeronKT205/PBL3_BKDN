// Sửa hàm payment_age để nhận seat là chuỗi
function payment_age(user_id, show_id, room_id, seat, total) {
    // Loại bỏ dấu nháy đơn và encode URI
    const encodedSeat = encodeURIComponent(seat.replace(/'/g, ''));
    window.location.href = `/Payment/Payment_Booking?user_id=${user_id}&show_id=${show_id}&room_id=${room_id}&seat=${encodedSeat}&total=${total}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.querySelector('.MainContainer__DetailBooking-btn-submit');

    confirmBtn.addEventListener('click', () => {
        const userInfo = getUserInfo();
        const user_id = userInfo.id;

        // Lấy tất cả các span chứa tên ghế
        const seatElements = document.querySelectorAll('.seat-list span');
        const seats = Array.from(seatElements).map(span => span.textContent).join(',');

        // Lấy tổng tiền và loại bỏ đơn vị
        const total = document.querySelector('.price.total-price').textContent.replace(' VNĐ', '').trim();

        // Gọi hàm payment_age với các tham số đúng
        payment_age(user_id, show_id, room_id, seats, total);
    });
});
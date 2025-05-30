function payment_age(user_id, show_id, room_id, seat, total,bookingid) {
    const encodedSeat = encodeURIComponent(seat.replace(/'/g, ''));
    window.location.href = `/Payment/Payment_Booking?user_id=${user_id}&show_id=${show_id}&room_id=${room_id}&seat=${encodedSeat}&total=${total}&bookingid=${bookingid}`;
}
let booking_id;
document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.querySelector('.MainContainer__DetailBooking-btn-submit');

    confirmBtn.addEventListener('click', async () => { // ⚠️ cần async
        const userInfo = getUserInfo();
        const user_id = userInfo.id;

        const seatElements = document.querySelectorAll('.seat-list span');
        const seats = Array.from(seatElements).map(span => span.textContent).join(','); // "C4,C3,C2"
        const total = document.querySelector('.price.total-price').textContent.replace(' VNĐ', '').trim();

        await bookseat(seats);
        payment_age(user_id, show_id, room_id, seats, total, booking_id);
    });
});

async function bookseat(seats) {
    const totalRaw = document.querySelector('.price.total-price').textContent;
    const totalClean = totalRaw.replace(/[^\d]/g, '');

    const response = await fetch("https://localhost:44343/Seat/Seat_Booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Room_ID: room_id,
            Show_ID: show_id,
            Choice: seats
        })
    });

    const data = await response.json();
    const seatorder_id = data.id;
    const userInfo = getUserInfo();

    const booking = {
        User_ID: userInfo.id,
        SeatOrder_ID: seatorder_id,
        Show_ID: show_id,
        total: parseInt(totalClean, 10) 
    };

    const _response = await fetch("https://localhost:44343/Booking/Booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
    });
    const _data = await _response.json();
    booking_id = _data.bookingid;
}


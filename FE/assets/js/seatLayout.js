function generateSeats() {
    let rows = document.getElementById("rows").value;
    let cols = document.getElementById("cols").value;
    const seatsContainer = document.getElementById("seats-container");

    // Tạo mặc định 4x4 nếu không nhập giá trị
    if (rows === "" && cols === "") {
        rows = 4;
        cols = 4;
    }

    // Kiểm tra nếu giá trị nhập hợp lệ
    if (rows <= 0 || cols <= 0) {
        alert("Vui lòng nhập số hàng và số cột hợp lệ.");
        return;
    }

    // Xóa các ghế cũ (nếu có)
    seatsContainer.innerHTML = "";

    // Tạo sơ đồ ghế
    seatsContainer.style.gridTemplateColumns = `repeat(${cols}, 50px)`; // Đặt số cột
    seatsContainer.style.gridTemplateRows = `repeat(${rows}, 50px)`;   // Đặt số hàng

    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // Tạo mảng A-Z

    // Tạo các ghế cho từng hàng và cột
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const seat = document.createElement("div");
            seat.classList.add("seat", "available");

            // Tạo ID cho từng ghế (A1, A2, B1, B2, ...)
            const seatId = `${letters[i]}${j + 1}`;
            seat.textContent = seatId;

            // Thêm sự kiện click cho ghế
            seat.onclick = function () {
                toggleSeat(seat);
            };

            // Thêm ghế vào container
            seatsContainer.appendChild(seat);
        }
    }
}

// Xử lý sự kiện khi chọn hoặc bỏ chọn ghế
function toggleSeat(seat) {
    if (seat.classList.contains("available")) {
        // Nếu ghế có sẵn, chuyển sang đã chọn
        seat.classList.remove("available");
        seat.classList.add("selected");
    } else if (seat.classList.contains("selected")) {
        // Nếu ghế đã chọn, bỏ chọn
        seat.classList.remove("selected");
        seat.classList.add("available");
    }
}
const el = document.querySelector("#movie-detail");
const _id = el.getAttribute("data-id");
function bookTicket(show_id,room_id) {
    window.location.href = `/Ticket/seat_booking?show_id=${show_id}&room_id=${room_id}`;
}
// Chuyển đổi chuỗi ASP.NET sang Date với múi giờ chính xác
function parseDateFromAspNet(dateStr) {
    const timestamp = parseInt(dateStr.match(/\d+/)[0]);
    const date = new Date(timestamp);

    // Điều chỉnh múi giờ: Giả sử server dùng UTC+7 (Thay 7 bằng offset của server)
    const serverTimezoneOffset = 7 * 60; // 7 giờ tính bằng phút
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + serverTimezoneOffset);

    return date;
}

// Hiển thị ngày dd/mm (đã điều chỉnh timezone)
function formatDisplayDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
}

// Lấy chuỗi yyyy-MM-dd theo múi giờ server (không dùng UTC)
function formatAPIDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

window.onload = function () {
    getDayofMovie(_id);
}

async function getDayofMovie(id) {
    try {
        const response = await fetch(`${window.location.origin}/Show/getDay?id=${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const _day = await response.json();
        const dayContainer = document.getElementById("date-list");
        dayContainer.innerHTML = '';

        // Lọc bỏ các ngày NULL và chuyển đổi sang Date
        const validDays = _day
            .filter(p => p.Day) // Bỏ qua NULL
            .map(p => ({
                original: p,
                date: parseDateFromAspNet(p.Day)
            }));

        // Sắp xếp theo ngày tăng dần (dựa trên Date đã điều chỉnh)
        validDays.sort((a, b) => a.date - b.date);

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
                getShowofDay(id, apiDate);
            });

            dayContainer.appendChild(button);

            // Auto-click ngày đầu tiên
            if (index === 0) {
                button.classList.add("active");
                getShowofDay(id, apiDate);
            }
        });

    } catch (err) {
        console.error("Lỗi khi lấy ngày chiếu:", err);
    }
}

// Hàm getShowofDay giữ nguyên như cũ
async function getShowofDay(id, day) {
    try {
        const response = await fetch(`${window.location.origin}/Show/getShowofDay?id=${id}&Day=${day}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        const showtimeList = document.querySelector(".showtime-list");
        showtimeList.innerHTML = "";

        data.forEach(show => {
            const startHour = String(show.Start_Movie.Hours).padStart(2, '0');
            const startMinute = String(show.Start_Movie.Minutes).padStart(2, '0');
            const endHour = String(show.End_Movie.Hours).padStart(2, '0');
            const endMinute = String(show.End_Movie.Minutes).padStart(2, '0');

            const button = document.createElement("button");
            button.className = "showtime-item";
            button.innerHTML = `
                <span onclick="bookTicket(${show.Show_ID},${show.Room_ID})" class="time">${startHour}:${startMinute} - ${endHour}:${endMinute}</span>
                <span class="screen">${show.Name}</span>
            `;
            button.addEventListener("click", () => {
                bookTicket(show.Show_ID, show.Room_ID);
            });
            showtimeList.appendChild(button);
        });

    } catch (err) {
        console.error("Lỗi khi lấy suất chiếu:", err);
    }
}
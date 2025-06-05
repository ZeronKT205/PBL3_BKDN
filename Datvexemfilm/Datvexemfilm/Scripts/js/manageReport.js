// Lấy các elements
const startDateInput = document.querySelector('.mainPage__SalesReport__Containersearch-datestart input');
const endDateInput = document.querySelector('.mainPage__SalesReport__Containersearch-date-end input');
const searchButton = document.querySelector('.mainPage__SalesReport__Containersearch-button-search');

// Format số tiền
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

// Format số lượng vé
function formatNumber(number) {
    return new Intl.NumberFormat('vi-VN').format(number);
}

// Hàm cập nhật UI với dữ liệu report
function updateReportUI(data) {
    // Cập nhật tổng doanh thu
    const totalAmountElement = document.querySelector('.mainPage__SalesReport__containerinfo-blockTotalAmount p span');
    totalAmountElement.textContent = formatCurrency(data.totalamount) + ' VND';

    // Cập nhật tổng số vé
    const totalTicketElement = document.querySelector('.mainPage__SalesReport__containerinfo-blockTotalTicket p');
    totalTicketElement.textContent = formatNumber(data.count);

    // Cập nhật phim được đặt nhiều nhất
    const topFilmElement = document.querySelector('.mainPage__SalesReport__containerinfo-blockTopFilm p');
    topFilmElement.textContent = data.mostBookedFilm ? data.mostBookedFilm.name : 'Không có dữ liệu';

    // Cập nhật phòng chiếu được đặt nhiều nhất
    const topScreenElement = document.querySelector('.mainPage__SalesReport__containerinfo-blockTopScreenx p');
    topScreenElement.textContent = data.mostBookedScreen ? data.mostBookedScreen.name : 'Không có dữ liệu';
}

// Hàm lấy report từ API
async function getReport(startDate, endDate) {
    try {
        const response = await fetch(`${window.location.origin}/Ticket/Report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start: startDate,
                end: endDate
            })
        });

        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu report');
        }

        const data = await response.json();
        updateReportUI(data);
    } catch (error) {
        console.error('Error fetching report:', error);
        alert('Có lỗi xảy ra khi lấy dữ liệu report: ' + error.message);
    }
}

// Xử lý sự kiện tìm kiếm
searchButton.addEventListener('click', () => {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
        alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc');
        return;
    }

    // Thêm 1 ngày vào endDate để bao gồm cả ngày kết thúc
    const endDateObj = new Date(endDate);
    endDateObj.setDate(endDateObj.getDate() + 1);
    const adjustedEndDate = endDateObj.toISOString().split('T')[0];

    getReport(startDate, adjustedEndDate);
});

// Tự động lấy report cho tháng hiện tại khi trang được load
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    startDateInput.value = firstDayOfMonth.toISOString().split('T')[0];
    endDateInput.value = lastDayOfMonth.toISOString().split('T')[0];

    getReport(startDateInput.value, endDateInput.value);
});

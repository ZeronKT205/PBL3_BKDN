// Xử lý chọn sản phẩm bắp nước
(function() {
    const addonItems = document.querySelectorAll('.addon-item');
    const selectedList = document.querySelector('.addon-selected-list');
    const totalElem = document.querySelector('.payment-amount');
    // Thêm các phần tử hóa đơn
    const billAddonList = document.querySelector('.ticket-bill-addon-list');
    const billGrandTotal = document.getElementById('bill-grand-total');
    const billTicketTotal = document.getElementById('bill-ticket-total');
    let baseTotal = 200000;
    let selectedProducts = [];

    function formatVND(val) {
        return val.toLocaleString('vi-VN') + ' VNĐ';
    }

    function updateSelectedList() {
        selectedList.innerHTML = '';
        billAddonList.innerHTML = '';
        if (selectedProducts.length > 0) {
            selectedList.innerHTML = '<div class="addon-selected-title">Đã chọn:</div>';
            selectedProducts.forEach(prod => {
                // Cập nhật hóa đơn: tên món, số lượng, giá
                const billRow = document.createElement('div');
                billRow.className = 'ticket-bill-row bill-addon-row';
                billRow.innerHTML = `<span class='bill-label'>${prod.name} x${prod.qty}</span> <span class='bill-value'>${formatVND(prod.price * prod.qty)}</span>`;
                billAddonList.appendChild(billRow);
                // Cập nhật danh sách đã chọn
                const item = document.createElement('div');
                item.className = 'addon-selected-item';
                item.innerHTML = `<span>${prod.name} x${prod.qty}</span> <span class='addon-selected-price'>${formatVND(prod.price * prod.qty)}</span> <button class='addon-remove-btn styled-remove' data-name='${prod.name}'>✕</button>`;
                selectedList.appendChild(item);
            });
        }
    }

    function updateTotal() {
        let total = baseTotal;
        selectedProducts.forEach(prod => total += prod.price * prod.qty);
        totalElem.textContent = formatVND(total);
        billGrandTotal.textContent = formatVND(total);
        billTicketTotal.textContent = formatVND(baseTotal);
    }

    addonItems.forEach(item => {
        const name = item.getAttribute('data-name');
        const price = parseInt(item.getAttribute('data-price'));
        const minusBtn = item.querySelector('.addon-qty-minus');
        const plusBtn = item.querySelector('.addon-qty-plus');
        const qtyValue = item.querySelector('.addon-qty-value');

        plusBtn.addEventListener('click', function() {
            let prod = selectedProducts.find(p => p.name === name);
            if (!prod) {
                prod = {name, price, qty: 1};
                selectedProducts.push(prod);
            } else {
                prod.qty++;
            }
            qtyValue.textContent = prod.qty;
            updateSelectedList();
            updateTotal();
        });
        minusBtn.addEventListener('click', function() {
            let prod = selectedProducts.find(p => p.name === name);
            if (prod && prod.qty > 0) {
                prod.qty--;
                if (prod.qty === 0) {
                    selectedProducts = selectedProducts.filter(p => p.name !== name);
                }
                qtyValue.textContent = prod.qty > 0 ? prod.qty : 0;
                updateSelectedList();
                updateTotal();
            }
        });
    });

    selectedList.addEventListener('click', function(e) {
        if (e.target.classList.contains('addon-remove-btn')) {
            const name = e.target.getAttribute('data-name');
            selectedProducts = selectedProducts.filter(p => p.name !== name);
            // Reset số lượng về 0
            document.querySelectorAll('.addon-item').forEach(item => {
                if (item.getAttribute('data-name') === name) {
                    item.querySelector('.addon-qty-value').textContent = '0';
                }
            });
            updateSelectedList();
            updateTotal();
        }
    });
    // Khởi tạo hóa đơn ban đầu
    updateSelectedList();
    updateTotal();
})();






//---------------------SỬ DỤNG DỮ LIỆU LƯU TRỮ Ở LOCAL STORAGE ĐỂ LOAD DỮ LIỆU---------------------


// Hàm khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    loadBookingInfo();
});

/**
 * Hàm tải và hiển thị thông tin đặt vé
 */
function loadBookingInfo() {
    const bookingInfo = getBookingInfo();
    if (bookingInfo) {
        // Hiển thị thông tin đặt vé
        document.querySelector('.payment-movie-name').textContent = bookingInfo.movieName;
        document.querySelector('.payment-cinema').textContent = bookingInfo.cinema;
        document.querySelector('.payment-date').textContent = bookingInfo.date;
        document.querySelector('.payment-time').textContent = bookingInfo.time;
        document.querySelector('.payment-seats').textContent = bookingInfo.seats.join(', ');
        document.querySelector('.payment-total').textContent = bookingInfo.totalPrice;
        document.querySelector('.payment-number-ticket').textContent = bookingInfo.numberTicket;
        var priceinticket = bookingInfo.totalPrice / bookingInfo.numberTicket;
        document.querySelector('.payment-price-ticket').textContent = formatVND(priceinticket);
    } else {
        // Nếu không có thông tin đặt vé, chuyển về trang chủ
        alert('Không tìm thấy thông tin đặt vé. Vui lòng đặt vé lại.');
        window.location.href = 'index.html';
    }
}

/**
 * Hàm xử lý thanh toán
 */
function handlePayment() {
    // Xử lý logic thanh toán ở đây
    // Sau khi thanh toán thành công
    clearBookingInfo(); // Xóa thông tin đặt vé
    alert('Thanh toán thành công!');
    window.location.href = 'index.html';
}

// Thêm sự kiện cho nút thanh toán
document.querySelector('.btn-confirm-payment').addEventListener('click', function(e) {
    e.preventDefault();
    handlePayment();
});


//---------------------End SỬ DỤNG DỮ LIỆU LƯU TRỮ Ở LOCAL STORAGE ĐỂ LOAD DỮ LIỆU---------------------
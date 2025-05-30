window.onload = function () {
    getProduct();
}

let selectedProducts = [];
let baseTotal = parseInt(_price.replace(/[^\d]/g, ''));
;

function formatVND(val) {
    return val.toLocaleString('vi-VN') + ' VNĐ';
}

function updateSelectedList() {
    const selectedList = document.querySelector('.addon-selected-list');
    const billAddonList = document.querySelector('.ticket-bill-addon-list');
    selectedList.innerHTML = '';
    billAddonList.innerHTML = '';
    if (selectedProducts.length > 0) {
        selectedList.innerHTML = '<div class="addon-selected-title">Đã chọn:</div>';
        selectedProducts.forEach(prod => {
            const billRow = document.createElement('div');
            billRow.className = 'ticket-bill-row bill-addon-row';
            billRow.innerHTML = `<span class='bill-label'>${prod.name} x${prod.qty}</span> <span class='bill-value'>${formatVND(prod.price * prod.qty)}</span>`;
            billAddonList.appendChild(billRow);

            const item = document.createElement('div');
            item.className = 'addon-selected-item';
            item.innerHTML = `<span>${prod.name} x${prod.qty}</span> <span class='addon-selected-price'>${formatVND(prod.price * prod.qty)}</span> <button class='addon-remove-btn styled-remove' data-name='${prod.name}'>✕</button>`;
            selectedList.appendChild(item);
        });
    }
}

function updateTotal() {
    const totalElem = document.querySelector('.payment-amount');
    const billGrandTotal = document.getElementById('bill-grand-total');
    const billTicketTotal = document.getElementById('bill-ticket-total');
    let total = baseTotal;
    selectedProducts.forEach(prod => total += prod.price * prod.qty);
    totalElem.textContent = formatVND(total);
    billGrandTotal.textContent = formatVND(total);
    billTicketTotal.textContent = formatVND(baseTotal);
}

function attachAddonEventHandlers() {
    const addonItems = document.querySelectorAll('.addon-item');
    const selectedList = document.querySelector('.addon-selected-list');

    addonItems.forEach(item => {
        const name = item.getAttribute('data-name');
        const price = parseInt(item.getAttribute('data-price'));
        const minusBtn = item.querySelector('.addon-qty-minus');
        const plusBtn = item.querySelector('.addon-qty-plus');
        const qtyValue = item.querySelector('.addon-qty-value');

        plusBtn.addEventListener('click', function () {
            const id = item.getAttribute('data-id');
            let prod = selectedProducts.find(p => p.id === id);
            if (!prod) {
                prod = { id,name, price, qty: 1 };
                selectedProducts.push(prod);
            } else {
                prod.qty++;
            }
            qtyValue.textContent = prod.qty;
            updateSelectedList();
            updateTotal();
        });

        minusBtn.addEventListener('click', function () {
            const id = item.getAttribute('data-id');
            let prod = selectedProducts.find(p => p.id === id);
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

    selectedList.addEventListener('click', function (e) {
        if (e.target.classList.contains('addon-remove-btn')) {
            const name = e.target.getAttribute('data-name');
            selectedProducts = selectedProducts.filter(p => p.name !== name);
            document.querySelectorAll('.addon-item').forEach(item => {
                if (item.getAttribute('data-name') === name) {
                    item.querySelector('.addon-qty-value').textContent = '0';
                }
            });
            updateSelectedList();
            updateTotal();
        }
    });
}

async function getProduct() {
    const response = await fetch("https://localhost:44343/Product/GetProduct", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();
    const addonList = document.querySelector('.addon-list');
    addonList.innerHTML = '';

    data.forEach(product => {
        const item = document.createElement('div');
        item.className = 'addon-item';
        item.setAttribute('data-name', product.Name);
        item.setAttribute('data-price', product.Price);
        item.setAttribute('data-id', product.Product_ID);

        item.innerHTML = `
            <img src="${product.img}" alt="${product.Name}" class="addon-img">
            <div class="addon-info">
                <div class="addon-name">${product.Name}</div>
                <div class="addon-name">${product.Description}</div>
                <div class="addon-price">${product.Price} VNĐ</div>
            </div>
            <div class="addon-qty-group">
                <button class="addon-qty-btn addon-qty-minus">-</button>
                <span class="addon-qty-value">0</span>
                <button class="addon-qty-btn addon-qty-plus">+</button>
            </div>
        `;
        addonList.appendChild(item);
    });

    // Sau khi thêm sản phẩm mới vào DOM => gắn event cho nút + / -
    attachAddonEventHandlers();

    // Cập nhật lại danh sách và tổng
    updateSelectedList();
    updateTotal();
}
async function submitPay() {
    const _orderproduct = selectedProducts.map(p => ({
        Booking_ID: tmp.Booking_ID,
        Product_ID: p.id,
        quantity: p.qty,
        total: p.price * p.qty
    }));
    
    const response = await fetch("https://localhost:44343/Product/OrderProduct", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(_orderproduct)
    });
    const totalText = document.querySelector('.payment-amount').textContent;
    const totalNumber = parseInt(totalText.replace(/[^\d]/g, ''), 10);
    const _repose = await fetch("https://localhost:44343/Payment/addPayment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Booking_ID: bookingid,
            Amount: totalNumber
        })
    });
    const data = await _repose.json();
    if (data.success) {
        alert("Thanh toán thành công");
        window.location.href = "/Home/Home";
    }
}
window.onload = function () {
    loadscreen();
    setupEventListeners();
}
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('.SubmitChangeSeatLayout');
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            const inputContainer = document.querySelector('.input-container');
            const name = inputContainer.querySelector('#nameScreen').value;
            const rows = parseInt(inputContainer.querySelector('#rows').value);
            const cols = parseInt(inputContainer.querySelector('#cols').value);
            const status = inputContainer.querySelector('#status_Room').value;

            if (!name || !rows || !cols || isNaN(rows) || isNaN(cols)) {
                alert("Vui lòng nhập đầy đủ thông tin phòng.");
                return;
            }

            const capacity = rows * cols;

            fetch('/Room/addscreen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Room_Name: name,
                    Row: rows,
                    Col: cols,
                    Status: status,
                    capacity: capacity
                })
            })
                .then(res => res.json())
                .then(data => {
                    alert("Thêm phòng thành công!");
                    document.querySelector('.mainPage__Screens__DetailContainer').classList.add('hidden');
                    loadscreen();
                })
                .catch(err => {
                    alert("Có lỗi xảy ra khi thêm phòng.");
                });
        });
    }
});

function setupEventListeners() {
    // Nút Add
    const addButton = document.querySelector('.mainPage__Screens__BlockSearch-button-add');
    if (addButton) {
        addButton.addEventListener('click', () => {
            const detailContainer = document.querySelector('.mainPage__Screens__DetailContainer');
            if (detailContainer) {
                const inputContainer = detailContainer.querySelector('.input-container');
                if (inputContainer) {
                    inputContainer.querySelector('#nameScreen').value = '';
                    inputContainer.querySelector('#nameScreen').disabled = false;

                    inputContainer.querySelector('#rows').value = '';
                    inputContainer.querySelector('#rows').disabled = false;

                    inputContainer.querySelector('#cols').value = '';
                    inputContainer.querySelector('#cols').disabled = false;

                    const statusSelect = inputContainer.querySelector('#status_Room');
                    if (statusSelect) {
                        statusSelect.value = 'active';
                        statusSelect.disabled = false;
                    }
                }

                const generateButton = detailContainer.querySelector('.buttontaosodo');
                const submitButton = detailContainer.querySelector('.SubmitChangeSeatLayout');
                
                if (generateButton) generateButton.style.display = 'block';
                if (submitButton) submitButton.style.display = 'block';

                detailContainer.classList.remove('hidden');
            }
        });
    }

    // Nút đóng
    const closeButton = document.querySelector('.closeScreen');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const detailContainer = document.querySelector('.mainPage__Screens__DetailContainer');
            if (detailContainer) {
                detailContainer.classList.add('hidden');
            }
        });
    }
}

// Hàm tạo sơ đồ ghế
function generateSeats() {
    const rowsInput = document.querySelector('#rows');
    const colsInput = document.querySelector('#cols');
    const seatsContainer = document.querySelector('#seats-container');

    if (!rowsInput || !colsInput || !seatsContainer) return;

    const rows = parseInt(rowsInput.value);
    const cols = parseInt(colsInput.value);

    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
        alert('Vui lòng nhập số hàng và số cột hợp lệ');
        return;
    }

    seatsContainer.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        rowDiv.style.display = 'flex';
        rowDiv.style.justifyContent = 'center';
        rowDiv.style.gap = '8px';
        rowDiv.style.marginBottom = '8px';

        const rowLetter = String.fromCharCode(65 + i);
        for (let j = 0; j < cols; j++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            const seatId = `${rowLetter}${j + 1}`;
            seat.id = `seat-${seatId}`;
            seat.textContent = seatId;

            seat.addEventListener('click', () => {
                seat.classList.toggle('selected');
            });

            rowDiv.appendChild(seat);
        }

        seatsContainer.appendChild(rowDiv);
    }
}

// Load màn hình và gán sự kiện click
async function loadscreen() {
    try {
        const response = await fetch(`/Screen/getallscreen`);
        const data = await response.json();
        const container = document.querySelector('.mainPage__Screens__ContainerListCard');
        if (!container) return;
        container.innerHTML = '';

        data.forEach(screen => {
            const card = document.createElement('div');
            card.className = 'mainPage__Screens__ContainerListCard__item';
            card.innerHTML = `
                <div class="mainPage__Screens__ContainerListCard__item-title">${screen.Room_Name}</div>
                <div class="mainPage__Screens__ContainerListCard__item__Containerinf">
                    <div class="mainPage__Screens__ContainerListCard__item__Containerinf-numSeats">
                        <span>Total Seats</span>
                        <p>${screen.capacity}</p>
                    </div>
                    <div class="mainPage__Screens__ContainerListCard__item__Containerinf-AvailablenumSeats">
                        <span>Row | Col</span>
                        <p>${screen.Row} | ${screen.Col}</p>
                    </div>
                    <div class="mainPage__Screens__ContainerListCard__item__Containerinf-status">
                        <span>Status</span>
                        <p>${screen.Status}</p>
                    </div>
                </div>
            `;

            // Gán sự kiện click cho card
            card.addEventListener('click', () => {
                const detailContainer = document.querySelector('.mainPage__Screens__DetailContainer');
                if (!detailContainer) return;

                const inputContainer = detailContainer.querySelector('.input-container');
                if (!inputContainer) return;

                const nameInput = inputContainer.querySelector('#nameScreen');
                const rowsInput = inputContainer.querySelector('#rows');
                const colsInput = inputContainer.querySelector('#cols');
                const statusSelect = inputContainer.querySelector('#status_Room');

                if (nameInput) nameInput.value = screen.Room_Name;
                if (nameInput) nameInput.disabled = true;

                if (rowsInput) rowsInput.value = screen.Row;
                if (rowsInput) rowsInput.disabled = true;

                if (colsInput) colsInput.value = screen.Col;
                if (colsInput) colsInput.disabled = true;

                if (statusSelect) {
                    statusSelect.value = screen.Status;
                    statusSelect.disabled = true;
                }

                const generateButton = detailContainer.querySelector('.buttontaosodo');
                const submitButton = detailContainer.querySelector('.SubmitChangeSeatLayout');
                
                if (generateButton) generateButton.style.display = 'none';
                if (submitButton) submitButton.style.display = 'none';

                detailContainer.classList.remove('hidden');
                generateSeats();
            });

            container.appendChild(card);
        });
    } catch (err) {
        console.error('Lỗi fetch danh sách màn hình:', err);
    }
}

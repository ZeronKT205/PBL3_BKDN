// Hàm tạo sơ đồ ghế
function generateSeats() {
  const rowsInput = document.querySelector('#rows');
  const colsInput = document.querySelector('#cols');
  const nameScreenInput = document.querySelector('#nameScreen');
  const seatsContainer = document.querySelector('#seats-container');

  if (!rowsInput || !colsInput || !seatsContainer) return;

  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);

  if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
    alert('Vui lòng nhập số hàng và số cột hợp lệ');
    return;
  }

  // Xóa nội dung cũ
  seatsContainer.innerHTML = '';

  // Tạo sơ đồ ghế
  for (let i = 0; i < rows; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-row';
    rowDiv.style.display = 'flex';
    rowDiv.style.justifyContent = 'center';
    rowDiv.style.gap = '8px';
    rowDiv.style.marginBottom = '8px';

    // Chuyển số hàng thành chữ cái (0 -> A, 1 -> B, ...)
    const rowLetter = String.fromCharCode(65 + i);

    for (let j = 0; j < cols; j++) {
      const seat = document.createElement('div');
      seat.className = 'seat';
      const seatId = `${rowLetter}${j + 1}`;
      seat.id = `seat-${seatId}`;
      seat.textContent = seatId;

      // Thêm sự kiện click cho ghế
      seat.addEventListener('click', () => {
        if (seat.classList.contains('selected')) {
          seat.classList.remove('selected');
        } else {
          seat.classList.add('selected');
        }
      });

      rowDiv.appendChild(seat);
    }

    seatsContainer.appendChild(rowDiv);
  }
}

// Gắn sự kiện click cho các card màn hình
document.addEventListener('DOMContentLoaded', () => {
  // Xử lý sự kiện click cho nút Add
  const addButton = document.querySelector('.mainPage__Screens__BlockSearch-button-add');
  if (addButton) {
    addButton.addEventListener('click', () => {
      const detailContainer = document.querySelector('.mainPage__Screens__DetailContainer');
      if (detailContainer) {
        // Reset các input về trống
        const inputContainer = detailContainer.querySelector('.input-container');
        if (inputContainer) {
          const nameScreenInput = inputContainer.querySelector('#nameScreen');
          if (nameScreenInput) {
            nameScreenInput.value = '';
            nameScreenInput.disabled = false;
          }

          const rowsInput = inputContainer.querySelector('#rows');
          if (rowsInput) {
            rowsInput.value = '';
            rowsInput.disabled = false;
          }

          const colsInput = inputContainer.querySelector('#cols');
          if (colsInput) {
            colsInput.value = '';
            colsInput.disabled = false;
          }

          const statusSelect = inputContainer.querySelector('#status_Room');
          if (statusSelect) {
            statusSelect.value = 'active';
            statusSelect.disabled = false;
          }
        }

        // Hiển thị các nút
        const generateButton = document.querySelector('.generate-seats-button');
        const submitButton = document.querySelector('.SubmitChangeSeatLayout');
        if (generateButton) generateButton.style.display = 'block';
        if (submitButton) submitButton.style.display = 'block';

        // Hiển thị container
        detailContainer.classList.remove('hidden');

        // Gắn sự kiện cho nút close
        const closeButton = detailContainer.querySelector('.closeScreen');
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            detailContainer.classList.add('hidden');
          });
        }
      }
    });
  }

  // Xử lý sự kiện click cho các card
  const screenCards = document.querySelectorAll('.mainPage__Screens__ContainerListCard__item');
  screenCards.forEach(card => {
    card.addEventListener('click', () => {
      // Lấy thông tin từ card được click
      const screenTitle = card.querySelector('.mainPage__Screens__ContainerListCard__item-title').textContent;
      const rowCol = card.querySelector('.mainPage__Screens__ContainerListCard__item__Containerinf-AvailablenumSeats p').textContent;
      const status = card.querySelector('.mainPage__Screens__ContainerListCard__item__Containerinf-status p').textContent;
      
      // Tách row và col từ chuỗi "row | col"
      const [rows, cols] = rowCol.split('|').map(item => item.trim());

      // Hiển thị container chi tiết
      const detailContainer = document.querySelector('.mainPage__Screens__DetailContainer');
      if (detailContainer) {
        // Điền thông tin vào input container
        const inputContainer = detailContainer.querySelector('.input-container');
        if (inputContainer) {
          // Điền tên rạp
          const nameScreenInput = inputContainer.querySelector('#nameScreen');
          if (nameScreenInput) {
            nameScreenInput.value = screenTitle;
            nameScreenInput.disabled = true;
          }

          // Điền số hàng và cột
          const rowsInput = inputContainer.querySelector('#rows');
          if (rowsInput) {
            rowsInput.value = rows;
            rowsInput.disabled = true;
          }

          const colsInput = inputContainer.querySelector('#cols');
          if (colsInput) {
            colsInput.value = cols;
            colsInput.disabled = true;
          }

          // Điền trạng thái
          const statusSelect = inputContainer.querySelector('#status_Room');
          if (statusSelect) {
            statusSelect.value = status;
            statusSelect.disabled = true;
          }
        }

        // Ẩn các nút
        const generateButton = document.querySelector('.generate-seats-button');
        const submitButton = document.querySelector('.SubmitChangeSeatLayout');
        if (generateButton) generateButton.style.display = 'none';
        if (submitButton) submitButton.style.display = 'none';

        // Tạo sơ đồ ghế
        generateSeats();

        // Hiển thị container
        detailContainer.classList.remove('hidden');

        // Gắn sự kiện cho nút close
        const closeButton = detailContainer.querySelector('.closeScreen');
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            detailContainer.classList.add('hidden');
          });
        }
      }
    });
  });
});

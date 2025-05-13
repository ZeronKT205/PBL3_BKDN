//----------------- Lọc suất chiếu theo ngày, phòng, phim -----------------//
const showTable = document.querySelector('.mainPage__Shows__containerinfo-table tbody');
const showFilterDate = document.querySelector('.mainPage__Shows__Containersearch-date-input');
const showFilterScreen = document.querySelector('.mainPage__Shows__Containersearch-screen-select');
const showFilterMovie = document.querySelector('.mainPage__Shows__Containersearch-movie-select');

function filterShowTable() {
  const dateVal = showFilterDate.value;
  const screenVal = showFilterScreen.value.toLowerCase();
  const movieVal = showFilterMovie.value.toLowerCase();
  Array.from(showTable.rows).forEach(row => {
    const rowDate = row.cells[3].textContent.trim();
    const rowScreen = row.cells[2].textContent.trim().toLowerCase();
    const rowMovie = row.cells[1].textContent.trim().toLowerCase();
    let show = true;
    if (dateVal && rowDate !== dateVal) show = false;
    if (screenVal !== '0' && rowScreen !== screenVal) show = false;
    if (movieVal !== '0' && rowMovie !== movieVal) show = false;
    row.style.display = show ? '' : 'none';
  });
}
if (showTable && showFilterDate && showFilterScreen && showFilterMovie) {
  showFilterDate.addEventListener('change', filterShowTable);
  showFilterScreen.addEventListener('change', filterShowTable);
  showFilterMovie.addEventListener('change', filterShowTable);
}
//----------------- End Lọc suất chiếu theo ngày, phòng, phim -----------------//



//----------------- Hàm Thêm Và Sửa Suất Chiếu -----------------//

// Sự kiện mở/đóng modal Add Show
const addShowBtn = document.querySelector('.mainPage__Shows__Containersearch-button-add');
const addShowModal = document.getElementById('addShowModal');
const cancelAddShow = document.getElementById('cancelAddShow');
const addShowForm = document.getElementById('addShowForm');




// Hàm mở modal sửa suất chiếu
function handleEditShow(e) {
  const row = e.target.closest('tr');
  if (!row) return;
  // Lấy dữ liệu từ row
  const showId = row.cells[0].textContent.trim();
  const movie = row.cells[1].textContent.trim();
  const screen = row.cells[2].textContent.trim();
  const date = row.cells[3].textContent.trim();
  const startTime = row.cells[4].textContent.trim();
  const endTime = row.cells[5].textContent.trim();
  const price = row.cells[6].textContent.trim();

  // Hiện modal và điền dữ liệu
  addShowModal.classList.remove('hidden');
  if (addShowForm) addShowForm.reset();
  const modalTitle = addShowModal.querySelector('h2');
  const saveButton = addShowModal.querySelector('.btn-save');
  if (modalTitle) modalTitle.textContent = 'Sửa Suất Chiếu';
  if (saveButton) saveButton.textContent = 'Cập nhật';

  // Lưu id show vào form để submit update
  addShowForm.setAttribute('data-edit-id', showId);

  // Set value cho các trường

  // Movie
  const movieSelect = document.getElementById('showMovie');
  if (movieSelect) {
    for (let i = 0; i < movieSelect.options.length; i++) {
      if (movieSelect.options[i].text.trim() === movie) {
        movieSelect.selectedIndex = i;
        break;
      }
    }
  }


  // Screen
  const screenSelect = document.getElementById('showScreen');
  if (screenSelect) {
    for (let i = 0; i < screenSelect.options.length; i++) {
      if (screenSelect.options[i].text.trim() === screen) {
        screenSelect.selectedIndex = i;
        break;
      }
    }
  }


  // Date
  const dateInput = document.getElementById('showDate');
  if (dateInput) dateInput.value = date;
  // Start Time
  const startTimeInput = document.getElementById('showStartTime');
  if (startTimeInput) startTimeInput.value = startTime;
  // End Time
  const endTimeInput = document.getElementById('showEndTime');
  if (endTimeInput) endTimeInput.value = endTime;
  // Price
  const priceInput = document.getElementById('showPrice');
  if (priceInput) priceInput.value = price;
}


// Gán sự kiện cho nút Edit trong bảng
const editShowBtns = document.querySelectorAll('.EditShow');
editShowBtns.forEach(btn => {
  btn.addEventListener('click', handleEditShow);
});

if (addShowBtn && addShowModal) {
  addShowBtn.addEventListener('click', function() {
    addShowModal.classList.remove('hidden');
    if (addShowForm) addShowForm.reset();
    const modalTitle = addShowModal.querySelector('h2');
    const saveButton = addShowModal.querySelector('.btn-save');
    if (modalTitle) modalTitle.textContent = 'Thêm Suất Chiếu Mới';
    if (saveButton) saveButton.textContent = 'Thêm Suất Chiếu';
  });
}
if (cancelAddShow && addShowModal) {
  cancelAddShow.addEventListener('click', function() {
    addShowModal.classList.add('hidden');
    if (addShowForm) addShowForm.reset();
  });
}


// Đóng modal khi click ra ngoài
if (addShowModal) {
  addShowModal.addEventListener('click', function(e) {
    if (e.target === addShowModal) {
      addShowModal.classList.add('hidden');
      if (addShowForm) addShowForm.reset();
    }
  });
}


/*
// Xử lý submit form thêm/sửa suất chiếu    (hàm tham khảo)
if (addShowForm) {
  addShowForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    // Lấy dữ liệu từ form
    const formData = {
      movieId: document.getElementById('showMovie').value,
      screenId: document.getElementById('showScreen').value,
      date: document.getElementById('showDate').value,
      startTime: document.getElementById('showStartTime').value,
      endTime: document.getElementById('showEndTime').value,
      price: document.getElementById('showPrice').value
    };
    // Kiểm tra đang sửa hay thêm mới
    const editId = addShowForm.getAttribute('data-edit-id');
    try {
      let response;
      if (editId) {
        // Sửa suất chiếu
        response = await fetch(`/api/shows/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Thêm mới suất chiếu
        response = await fetch('/api/shows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      if (response.ok) {
        addShowModal.classList.add('hidden');
        addShowForm.reset();
        addShowForm.removeAttribute('data-edit-id');
        alert(editId ? 'Cập nhật suất chiếu thành công!' : 'Thêm suất chiếu thành công!');
        // TODO: Refresh lại bảng dữ liệu
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
      }
    } catch (err) {
      alert('Có lỗi kết nối server.');
      console.error(err);
    }
  });
}
*/

//----------------- End Hàm Thêm Và Sửa Suất Chiếu -----------------//





//----------------- Hàm Xóa Suất Chiếu -----------------//

// Hàm xóa suất chiếu
function handleDeleteShow(e) {
  const row = e.target.closest('tr');
  if (!row) return;
  const showId = row.cells[0].textContent.trim();
  if (!confirm('Bạn có chắc chắn muốn xóa suất chiếu này?')) return;
  // TODO: Gọi API xóa suất chiếu ở đây nếu cần
  // fetch(`/api/shows/${showId}`, { method: 'DELETE' }) ...
  row.remove();
  alert('Đã xóa suất chiếu khỏi danh sách!');
}

// Gán sự kiện cho nút Delete trong bảng
const deleteShowBtns = document.querySelectorAll('.DeleteShow');
deleteShowBtns.forEach(btn => {
  btn.addEventListener('click', handleDeleteShow);
});




//----------------- End Hàm Xóa Suất Chiếu -----------------//



/*
    Note: 
    - Kiểm tra trùng suất chiếu
    - Backend cần kiểm tra không cho phép tạo 2 suất chiếu trùng phòng, trùng thời gian (overlap).
    - Validate dữ liệu
    - Kiểm tra các trường bắt buộc: movieId, screenId, date, startTime, endTime, price.
    - Kiểm tra giá trị hợp lệ: ngày không ở quá khứ, giờ bắt đầu < giờ kết thúc, giá vé > 0.


    - Trong hàm xóa suất chiếu hãy chú ý phần call API rồi thêm xử lý backend vào đó. Nhớ thêm điều kiện để khi
     xóa thahf công mới cập nhập xóa ở ngoài view
*/
//-----------------------------Chức năng thêm combo Product-------------------------------------------//
// Hiện form thêm combo
const addComboBtnProduct = document.querySelector('.mainPage__FoodDrinks-add-button');
if (addComboBtnProduct) {
  addComboBtnProduct.onclick = function() {
    const modal = document.getElementById('addComboModal');
    if (modal) modal.classList.remove('hidden');
  };
}

// --- Chức năng chọn ảnh cho form thêm combo ---
const imgUploadAreaProduct = document.getElementById('imgUploadArea');
const imgInputProduct = document.getElementById('comboimgInput');
const imgPreviewProduct = document.getElementById('comboImgPreview');
const imgRemoveBtnProduct = document.getElementById('imgRemoveBtn');
const imgChooseBtnProduct = document.getElementById('imgChooseBtn');
const imgPlaceholderProduct = document.getElementById('imgUploadPlaceholder');

if (imgUploadAreaProduct && imgInputProduct && imgPreviewProduct && imgRemoveBtnProduct && imgChooseBtnProduct && imgPlaceholderProduct) {
  imgUploadAreaProduct.addEventListener('click', () => imgInputProduct.click());
  imgChooseBtnProduct.addEventListener('click', () => imgInputProduct.click());
  imgInputProduct.addEventListener('change', handleImgChange);
  imgRemoveBtnProduct.addEventListener('click', function(e) {
    e.stopPropagation();
    imgInputProduct.value = '';
    imgPreviewProduct.src = '#';
    imgPreviewProduct.classList.add('hidden');
    imgRemoveBtnProduct.classList.add('hidden');
    imgPlaceholderProduct.classList.remove('hidden');
  });
  imgUploadAreaProduct.addEventListener('dragover', function(e) {
    e.preventDefault(); imgUploadAreaProduct.classList.add('dragover');
  });
  imgUploadAreaProduct.addEventListener('dragleave', function(e) {
    e.preventDefault(); imgUploadAreaProduct.classList.remove('dragover');
  });
  imgUploadAreaProduct.addEventListener('drop', function(e) {
    e.preventDefault(); imgUploadAreaProduct.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      imgInputProduct.files = e.dataTransfer.files;
      handleImgChange();
    }
  });
}
function handleImgChange() {
  if (imgInputProduct.files && imgInputProduct.files[0]) {
    const file = imgInputProduct.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh!');
      imgInputProduct.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      imgPreviewProduct.src = e.target.result;
      imgPreviewProduct.classList.remove('hidden');
      imgRemoveBtnProduct.classList.remove('hidden');
      imgPlaceholderProduct.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  }
}

// Đóng form thêm combo khi nhấn Hủy hoặc overlay
const canceladdComboBtnProduct = document.getElementById('cancelAddCombo');
const addComboModalProduct = document.getElementById('addComboModal');
const addComboOverlayProduct = document.querySelector('.add-combo-modal__overlay');
if (canceladdComboBtnProduct && addComboModalProduct) {
  canceladdComboBtnProduct.onclick = closeaddComboModalProduct;
}
if (addComboOverlayProduct && addComboModalProduct) {
  addComboOverlayProduct.onclick = closeaddComboModalProduct;
}
function closeaddComboModalProduct() {
  addComboModalProduct.classList.add('hidden');
  document.getElementById('addComboForm').reset();
  document.getElementById('comboImgPreview').classList.add('hidden');
  document.getElementById('imgRemoveBtn').classList.add('hidden');
  document.getElementById('imgUploadPlaceholder').classList.remove('hidden');
}


// // Hàm gọi API thêm combo mới
// async function addComboAPI(comboData) {
//     // comboData: { name, items, price, status, image (File) }
//     const formData = new FormData();
//     formData.append('name', comboData.name);
//     formData.append('items', comboData.items);
//     formData.append('price', comboData.price);
//     formData.append('status', comboData.status);
//     if (comboData.image) formData.append('image', comboData.image);
  
//     // Thay endpoint dưới đây bằng API thực tế của bạn
//     const endpoint = '/api/combos';
//     const response = await fetch(endpoint, {
//       method: 'POST',
//       body: formData
//       // Nếu cần token:
//       // headers: { 'Authorization': 'Bearer ...' }
//     });
//     if (!response.ok) {
//       const err = await response.text();
//       throw new Error(err || 'Thêm combo thất bại!');
//     }
//     return await response.json(); // hoặc response.text() nếu backend trả về text
//   }



//-----------------------------End Chức năng thêm combo Product-------------------------------------------//







//-----------------------------Chức năng xóa combo Product-------------------------------------------//

// Xóa card combo khi nhấn nút xóa
function handleDeleteCombo(e) {
  if (confirm('Bạn có chắc chắn muốn xóa combo này?')) {
    const card = e.target.closest('.mainPage__FoodDrinks-containerinfo-card');
    if (card) card.remove();
  }
}
document.querySelectorAll('.mainPage__FoodDrinks-containerinfo-card-action-button:last-child').forEach(btn => {
  btn.onclick = handleDeleteCombo;
});

// // Hàm gọi API xóa combo
// async function deleteComboAPI(comboId) {
//     // comboId: ID của combo cần xóa
//     // Thay endpoint dưới đây bằng API thực tế của bạn
//     const endpoint = `/api/combos/${comboId}`;
//     const response = await fetch(endpoint, {
//       method: 'DELETE'
//       // Nếu cần token:
//       // headers: { 'Authorization': 'Bearer ...' }
//     });
//     if (!response.ok) {
//       const err = await response.text();
//       throw new Error(err || 'Xóa combo thất bại!');
//     }
//     return true; // hoặc response.json() nếu backend trả về dữ liệu
//   }

//cách dùng:   await deleteComboAPI(comboId);



//-----------------------------End Chức năng xóa combo Product-------------------------------------------//










//-----------------------------Chức năng sửa combo Product  (Sử dụng lại Form thêm combo)-------------------------//

// Hiện form Edit khi nhấn nút Edit
function handleEditCombo(e) {
  const card = e.target.closest('.mainPage__FoodDrinks-containerinfo-card');
  if (!card) return;

  // Lấy dữ liệu từ card
  const name = card.querySelector('p:nth-child(1) span').textContent.trim();
  const price = card.querySelector('p:nth-child(2) span').textContent.replace(/[^\d]/g, '');
  const items = card.querySelector('p:nth-child(3) span').textContent.trim();
  const status = card.querySelector('p:nth-child(4) span').textContent.trim().toLowerCase();
  const imgSrc = card.querySelector('img').src;
  // Lấy id combo (nên gắn data-id vào card)
  const comboId = card.dataset.id || null;

  // Hiện form Edit (dùng lại modal add, đổi tiêu đề, điền sẵn dữ liệu)
  const modal = document.getElementById('addComboModal');
  modal.classList.remove('hidden');
  document.querySelector('.add-combo-modal__content h2').textContent = 'Sửa Combo';
  document.getElementById('comboName').value = name;
  document.getElementById('comboPrice').value = price;
  document.getElementById('comboItems').value = items;
  document.getElementById('comboStatus').value = status;

  // Lưu id combo vào form (để biết khi submit là sửa)
  const form = document.getElementById('addComboForm');
  form.setAttribute('data-edit-id', comboId);

  // Ảnh preview
  const imgPreview = document.getElementById('comboImgPreview');
  if (imgSrc) {
    imgPreview.src = imgSrc;
    imgPreview.classList.remove('hidden');
    document.getElementById('imgRemoveBtn').classList.remove('hidden');
    document.getElementById('imgUploadPlaceholder').classList.add('hidden');
  } else {
    imgPreview.classList.add('hidden');
    document.getElementById('imgRemoveBtn').classList.add('hidden');
    document.getElementById('imgUploadPlaceholder').classList.remove('hidden');
  }

  // Reset input file
  document.getElementById('comboImgInput').value = '';

  // Đổi nút lưu thành 'Cập nhật combo'
  form.querySelector('.btn-save').textContent = 'Cập nhật combo';
}
document.querySelectorAll('.mainPage__FoodDrinks-containerinfo-card-action-button:first-child').forEach(btn => {
  btn.onclick = handleEditCombo;
});
// Khi đóng modal, reset lại tiêu đề về Thêm Combo Mới
addComboModalProduct.addEventListener('transitionend', function() {
  if (addComboModalProduct.classList.contains('hidden')) {
    document.querySelector('.add-combo-modal__content h2').textContent = 'Thêm Combo Mới';
  }
});


// // Hàm gọi API sửa combo
// async function editComboAPI(comboId, comboData) {
//     // comboId: ID của combo cần sửa
//     // comboData: { name, items, price, status, image (File, optional) }
//     const formData = new FormData();
//     formData.append('name', comboData.name);
//     formData.append('items', comboData.items);
//     formData.append('price', comboData.price);
//     formData.append('status', comboData.status);
//     if (comboData.image) formData.append('image', comboData.image);
  
//     // Thay endpoint dưới đây bằng API thực tế của bạn
//     const endpoint = `/api/combos/${comboId}`;
//     const response = await fetch(endpoint, {
//       method: 'PUT', // hoặc PATCH nếu backend dùng PATCH
//       body: formData
//       // Nếu cần token:
//       // headers: { 'Authorization': 'Bearer ...' }
//     });
//     if (!response.ok) {
//       const err = await response.text();
//       throw new Error(err || 'Sửa combo thất bại!');
//     }
//     return await response.json(); // hoặc response.text() nếu backend trả về text
//   }

  //cách dùng:   await editComboAPI(comboId, comboData);



//-----------------------------End Chức năng sửa combo Product  (Sử dụng lại Form thêm combo)-------------------------//



//-------------------------------Hàm load dữ liệu đồ ăn & đồ uống-------------------------------//

// Biến tạm để lưu trữ danh sách đồ ăn & đồ uống ban đầu
let originalFoods = [];

// Hàm load dữ liệu đồ ăn & đồ uống
function loadFoods() {
  const foodElements = document.querySelectorAll('#foodlist tr');
  originalFoods = Array.from(foodElements).map(food => ({
    id: food.querySelector('td:first-child').textContent,
    name: food.querySelector('td:nth-child(2)').textContent,
    price: food.querySelector('td:nth-child(3)').textContent,
    type: food.querySelector('td:nth-child(4)').textContent,
    status: food.querySelector('td:nth-child(5)').textContent
  }));
}

// Load dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', loadFoods);

//------------------------------- End Hàm load dữ liệu đồ ăn & đồ uống-------------------------------//

//-------------------------------Hàm load dữ liệu đồ ăn & đồ uống-------------------------------//

// Hàm load dữ liệu đồ ăn & đồ uống
function loadFoods() {
  const foodElements = document.querySelectorAll('.mainPage__FoodDrinks-containerinfo-card');
  originalFoods = Array.from(foodElements).map(food => ({
    id: food.getAttribute('data-id'),
    name: food.querySelector('.mainPage__FoodDrinks-containerinfo-card-content p:nth-child(1) span').textContent,
    price: food.querySelector('.mainPage__FoodDrinks-containerinfo-card-content p:nth-child(2) span').textContent,
    description: food.querySelector('.mainPage__FoodDrinks-containerinfo-card-content p:nth-child(3) span').textContent,
    status: food.querySelector('.mainPage__FoodDrinks-containerinfo-card-content p:nth-child(4) span').textContent,
    image: food.querySelector('.mainPage__FoodDrinks-containerinfo-card-img').src
  }));
}

// Load dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', loadFoods);

//------------------------------- End Hàm load dữ liệu đồ ăn & đồ uống-------------------------------//

//-------------------------------Hàm tìm kiếm đồ ăn & đồ uống-------------------------------//

// Hàm tìm kiếm đồ ăn & đồ uống
function searchFoods(query) {

  // Lọc kết quả dựa trên query
  const filteredResults = originalFoods.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  );

  // Cập nhật UI với kết quả tìm kiếm
  const container = document.querySelector('.mainPage__FoodDrinks-containerinfo');
  container.innerHTML = ''; // Xóa nội dung cũ

  filteredResults.forEach(food => {
    const card = document.createElement('div');
    card.className = 'mainPage__FoodDrinks-containerinfo-card';
    card.setAttribute('data-id', food.id);
    card.innerHTML = `
      <img src="${food.image}" alt="${food.name}" class="mainPage__FoodDrinks-containerinfo-card-img">
      <div class="mainPage__FoodDrinks-containerinfo-card-content">
        <p>Tên Combo: <span>${food.name}</span></p>
        <p>Giá: <span>${food.price}</span></p>
        <p>Mô Tả: <span>${food.description}</span></p>
        <p>Trạng Thái: <span>${food.status}</span></p>
      </div>
      <div class="mainPage__FoodDrinks-containerinfo-card-action">
        <button class="mainPage__FoodDrinks-containerinfo-card-action-button" data-foodid="${food.id}">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="mainPage__FoodDrinks-containerinfo-card-action-button" data-foodid="${food.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  // Gắn lại sự kiện cho các nút Edit mới
  document.querySelectorAll('.mainPage__FoodDrinks-containerinfo-card-action-button:first-child').forEach(btn => {
    btn.onclick = handleEditCombo;
  });

  // Gắn lại sự kiện cho các nút Remove mới
  document.querySelectorAll('.mainPage__FoodDrinks-containerinfo-card-action-button:last-child').forEach(btn => {
    btn.onclick = handleDeleteCombo;
  });
}

// Gắn sự kiện tìm kiếm cho button
const searchButtonUser = document.querySelector('.mainPage__FoodDrinks-search-search-button');
const searchInputUser = document.querySelector('.mainPage__FoodDrinks-search-input');

if (searchButtonUser && searchInputUser) {
  searchButtonUser.removeEventListener('click', handleSearch); // Xóa sự kiện cũ nếu có
  searchButtonUser.addEventListener('click', handleSearch);
} 

function handleSearch() {
  if (searchInputUser) {
    const query = searchInputUser.value;
    searchFoods(query);
  }
}

//------------------------------- End Hàm tìm kiếm đồ ăn & đồ uống-------------------------------// 


/*
    Notr: Cần chú ý các hàm xử lý backend, để lưu thông tin khi được cập nhật thêm sửa xóa
    - Thêm hàm để search combo là xong
*/
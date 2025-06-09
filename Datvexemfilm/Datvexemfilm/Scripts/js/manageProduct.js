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
const imgInputProduct = document.getElementById('comboImgInput');
const imgPreviewProduct = document.getElementById('comboImgPreview');
const imgRemoveBtnProduct = document.getElementById('imgRemoveBtn');
const imgChooseBtnProduct = document.getElementById('imgChooseBtn');
const imgPlaceholderProduct = document.getElementById('imgUploadPlaceholder');

if (imgUploadAreaProduct && imgInputProduct && imgPreviewProduct && imgRemoveBtnProduct && imgChooseBtnProduct && imgPlaceholderProduct) {
    // Thêm console.log để debug

    imgUploadAreaProduct.addEventListener('click', () => {
        imgInputProduct.click();
    });
    
    imgChooseBtnProduct.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        imgInputProduct.click();
    });
    
    imgInputProduct.addEventListener('change', (e) => {
        handleImgChange();
    });
    
    imgRemoveBtnProduct.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Remove button clicked');
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
        console.log('Selected file:', file);
        
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh!');
            imgInputProduct.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('File loaded');
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
  imgInputProduct.value = '';
  imgPreviewProduct.src = '#';
  imgPreviewProduct.classList.add('hidden');
  imgRemoveBtnProduct.classList.add('hidden');
  imgPlaceholderProduct.classList.remove('hidden');
  document.querySelector('.add-combo-modal__content h2').textContent = 'Thêm Combo Mới';
  document.getElementById('addComboForm').removeAttribute('data-edit-id');
  document.querySelector('.btn-save').textContent = 'Thêm combo';
}


// // Hàm gọi API thêm combo mới
async function addComboAPI(comboData) {
    try {
        const response = await fetch(`/Product/addProduct`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Name: comboData.name,
                Description: comboData.items,
                Price: parseFloat(comboData.price),
                Status: comboData.status,
                img: comboData.image
            })
        });

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Thêm combo thất bại!');
        }
        return result;
    } catch (error) {
        throw new Error(error.message || 'Thêm combo thất bại!');
    }
}



//-----------------------------End Chức năng thêm combo Product-------------------------------------------//







//-----------------------------Chức năng xóa combo Product-------------------------------------------//

// Xóa card combo khi nhấn nút xóa
async function handleDeleteCombo(e) {
    const deleteButton = e.target.closest('.mainPage__FoodDrinks-containerinfo-card-action-button');
    if (!deleteButton) return;

    const card = deleteButton.closest('.mainPage__FoodDrinks-containerinfo-card');
    if (!card) return;

    const comboId = card.dataset.id;
    if (!comboId) {
        console.error('Không tìm thấy ID của combo');
        return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa combo này?')) {
        try {
            await deleteComboAPI(comboId);
            card.remove();
            alert('Xóa combo thành công!');
        } catch (error) {
            console.error('Error deleting combo:', error);
            alert(error.message);
        }
    }
}

// Hàm gọi API xóa combo
async function deleteComboAPI(comboId) {
    try {
        const response = await fetch(`/Product/deleteProduct?id=${comboId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Kiểm tra status code
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Kiểm tra content type
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Xóa combo thất bại!');
            }
            return result;
        } else {
            // Nếu response không phải JSON, coi như thành công nếu status code là 200
            if (response.status === 200) {
                return { success: true, message: 'Xóa combo thành công!' };
            } else {
                throw new Error('Xóa combo thất bại!');
            }
        }
    } catch (error) {
        console.error('Error in deleteComboAPI:', error);
        throw new Error(error.message || 'Xóa combo thất bại!');
    }
}

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
  const comboId = card.dataset.id;

  // Hiện form Edit
  const modal = document.getElementById('addComboModal');
  modal.classList.remove('hidden');
  document.querySelector('.add-combo-modal__content h2').textContent = 'Sửa Combo';
  
  // Điền dữ liệu vào form
  document.getElementById('comboName').value = name;
  document.getElementById('comboPrice').value = price;
  document.getElementById('comboItems').value = items;
  document.getElementById('comboStatus').value = status;
  document.getElementById('comboUrl').value = imgSrc;

  // Hiển thị ảnh preview
  if (imgSrc) {
    imgPreviewProduct.src = imgSrc;
    imgPreviewProduct.classList.remove('hidden');
    imgRemoveBtnProduct.classList.remove('hidden');
    imgPlaceholderProduct.classList.add('hidden');
  }

  // Lưu id combo vào form
  const form = document.getElementById('addComboForm');
  form.setAttribute('data-edit-id', comboId);

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
async function editComboAPI(comboId, comboData) {
    try {
        const response = await fetch(`/Product/updateProduct`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Product_ID: comboId,
                Name: comboData.name,
                Description: comboData.items,
                Price: parseFloat(comboData.price),
                Status: comboData.status,
                img: comboData.image
            })
        });

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Sửa combo thất bại!');
        }
        return result;
    } catch (error) {
        throw new Error(error.message || 'Sửa combo thất bại!');
    }
}

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
window.loadproduct = async function () {
    try {
        const response = await fetch(`/Product/getallproduct`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Không thể tải danh sách combo');
        }

        const data = await response.json();
        const container = document.querySelector('.mainPage__FoodDrinks-containerinfo');
        if (!container) {
            throw new Error('Không tìm thấy container để hiển thị combo');
        }

        container.innerHTML = '';
        data.forEach(item => {
            const card = document.createElement("div");
            card.className = "mainPage__FoodDrinks-containerinfo-card";
            card.setAttribute('data-id', item.Product_ID);
            card.innerHTML = `
                <img src="${item.img}" alt="${item.Name}" class="mainPage__FoodDrinks-containerinfo-card-img">
                <div class="mainPage__FoodDrinks-containerinfo-card-content">
                    <p>Tên Combo: <span>${item.Name}</span></p>
                    <p>Giá: <span>${item.Price} VNĐ</span></p>
                    <p>Mô Tả: <span>${item.Description}</span></p>
                    <p>Trạng Thái: <span>${item.Status}</span></p>
                </div>
                <div class="mainPage__FoodDrinks-containerinfo-card-action">
                    <button class="mainPage__FoodDrinks-containerinfo-card-action-button">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="mainPage__FoodDrinks-containerinfo-card-action-button">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

        // Gắn lại sự kiện cho các nút
        document.querySelectorAll('.mainPage__FoodDrinks-containerinfo-card-action-button:first-child').forEach(btn => {
            btn.onclick = handleEditCombo;
        });

        document.querySelectorAll('.mainPage__FoodDrinks-containerinfo-card-action-button:last-child').forEach(btn => {
            btn.onclick = handleDeleteCombo;
        });

    } catch (error) {
        console.error('Error loading products:', error);
        alert('Có lỗi xảy ra khi tải danh sách combo: ' + error.message);
    }
}
//------------------------------- End Hàm tìm kiếm đồ ăn & đồ uống-------------------------------// 


/*
    Notr: Cần chú ý các hàm xử lý backend, để lưu thông tin khi được cập nhật thêm sửa xóa
    - Thêm hàm để search combo là xong
*/

// Update form submission to handle both add and edit
document.getElementById('addComboForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Lấy URL từ input mới
    const imageUrl = document.getElementById('comboUrl').value;

    const formData = {
        name: document.getElementById('comboName').value,
        items: document.getElementById('comboItems').value,
        price: document.getElementById('comboPrice').value,
        status: document.getElementById('comboStatus').value,
        image: imageUrl // Lưu URL vào trường image
    };

    console.log('Form data to be sent:', formData); // Debug log

    try {
        const editId = this.getAttribute('data-edit-id');
        if (editId) {
            // Edit mode
            await editComboAPI(editId, formData);
            alert('Cập nhật combo thành công!');
        } else {
            // Add mode
            await addComboAPI(formData);
            alert('Thêm combo thành công!');
        }
        
        // Reload the product list
        await window.loadproduct();
        
        // Close modal and reset form
        closeaddComboModalProduct();
    } catch (error) {
        console.error('Error submitting form:', error); // Debug log
        alert(error.message);
    }
});

// Thêm event listener cho input URL
document.getElementById('comboUrl').addEventListener('input', function(e) {
    const url = e.target.value;
    if (url) {
        // Hiển thị ảnh preview
        imgPreviewProduct.src = url;
        imgPreviewProduct.classList.remove('hidden');
        imgRemoveBtnProduct.classList.remove('hidden');
        imgPlaceholderProduct.classList.add('hidden');
    } else {
        // Ẩn ảnh preview nếu không có URL
        imgPreviewProduct.src = '#';
        imgPreviewProduct.classList.add('hidden');
        imgRemoveBtnProduct.classList.add('hidden');
        imgPlaceholderProduct.classList.remove('hidden');
    }
});
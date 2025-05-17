// Hiển thị/ẩn modal thêm user
//-------------------------------Hàm thêm người dùng-------------------------------//
// Gắn sự kiện cho nút confirm trong thêm User
const addUserForm = document.getElementById('addUserForm');
if (addUserForm) {
  addUserForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Lấy thông tin từ form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Kiểm tra điều kiện
    if (!username || !password) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // TODO: Gọi API để thêm User
    // Ví dụ:
    // fetch('/api/users', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ username, password, role }),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Success:', data);
    //   // Cập nhật UI sau khi thêm User
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });

    // Đóng modal sau khi thêm User
    document.getElementById('addUserModal').classList.add('hidden');
  });
}


//------------------------------- End Hàm thêm người dùng-------------------------------//





//-------------------------------Hàm load dữ liệu người dùng-------------------------------//

// Biến tạm để lưu trữ danh sách người dùng ban đầu
let originalUsers = [];

// Gắn sự kiện cho các nút Info
function attachInfoButtonListeners() {
    const infoButtons = document.querySelectorAll('.InfoUser');
    infoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const userId = this.getAttribute('data-userid');
            if (userId) {
                showUserInfo(userId);
            }
        });
    });
}

// Hàm load dữ liệu người dùng
async function loadUsers() {
    const response = await fetch("https://localhost:44343/User/GetUsers", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    originalUsers = data;
    const user_list = document.querySelector("#userlist");
    user_list.innerHTML = "";
    data.forEach(user => {
        const user_container = document.createElement("tr");
        user_container.innerHTML = `
        <td>${user.ID}</td>
        <td>${user.Username}</td>
        <td>${user.Email}</td>
        <td>${user.Role}</td>
        <td><button class="InfoUser" data-userid="${user.ID}">Info</button> <button class="RemoveUser" data-userid="${user.ID}">Remove</button></td>
        `;
        user_list.appendChild(user_container);
    });
    
    // Gắn lại event listeners
    attachInfoButtonListeners();
    attachRemoveButtonListeners();
}

// Load dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', loadUsers);

//------------------------------- End Hàm load dữ liệu người dùng-------------------------------//

//-------------------------------Hàm tìm kiếm người dùng theo tên người dùng-------------------------------//

// Hàm xác nhận xóa người dùng
function confirmUser(message) {
  return window.confirm(message);
}

// Hàm xóa người dùng
async function deleteUser(userId) {
    if (confirmUser('Bạn có chắc chắn muốn xóa người dùng này?')) {
        try {
            const response = await fetch(`https://localhost:44343/User/DeleteUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userId })
            });

            const result = await response.json();
            
            if (result.success) {
                // Xóa người dùng khỏi danh sách
                const userRow = document.querySelector(`.RemoveUser[data-userid="${userId}"]`).closest('tr');
                if (userRow) {
                    userRow.remove();
                    // Cập nhật lại originalUsers sau khi xóa
                    originalUsers = originalUsers.filter(user => user.ID !== parseInt(userId));
                }
                alert(result.message);
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi xóa người dùng!');
        }
    }
}

// Gắn sự kiện cho các nút Remove
function attachRemoveButtonListeners() {
    const removeButtons = document.querySelectorAll('.RemoveUser');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-userid');
            if (userId) {
                deleteUser(userId);
            }
        });
    });
}

// Hàm tìm kiếm người dùng theo tên người dùng
function searchUsers(query) {
  // Lọc kết quả dựa trên query
  const filteredResults = originalUsers.filter(user => 
    user.Username.toLowerCase().includes(query.toLowerCase())
  );

  // Cập nhật UI với kết quả tìm kiếm
  const tbody = document.getElementById('userlist');
  tbody.innerHTML = ''; // Xóa nội dung cũ

  filteredResults.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.ID}</td>
      <td>${user.Username}</td>
      <td>${user.Email}</td>
      <td>${user.Role}</td>
      <td>
        <button class="InfoUser" data-userid="${user.ID}">Info</button>
        <button class="RemoveUser" data-userid="${user.ID}">Remove</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Gắn lại sự kiện cho các nút Info mới
  attachInfoButtonListeners();

  // Gắn lại sự kiện cho các nút Remove mới
  document.querySelectorAll('.RemoveUser').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.getAttribute('data-userid');
      if (userId) {
        deleteUser(userId);
      }
    });
  });
}

// Gắn sự kiện tìm kiếm cho button
const searchButtonUsers = document.querySelector('.mainPage__Users-search button');
searchButtonUsers.removeEventListener('click', handleSearch); // Xóa sự kiện cũ nếu có
searchButtonUsers.addEventListener('click', handleSearch);

function handleSearch() {
  const query = document.querySelector('.mainPage__Users-search-input').value;
  searchUsers(query);
}



//------------------------------- End Hàm tìm kiếm người dùng theo tên người dùng-------------------------------//




//-------------------------------Hàm xem thông tin người dùng-------------------------------//

// Hàm điền thông tin vào form
function fillUserInfoForm(userDetail) {
    if (!userDetail) {
        throw new Error('Không có dữ liệu người dùng');
    }

    const form = document.getElementById('userInfoForm');
    if (!form) {
        throw new Error('Không tìm thấy form thông tin');
    }

    // Điền thông tin vào các trường
    const fields = {
        'userName': userDetail.name || '',
        'userGender': userDetail.gender || '',
        'userBirthday': userDetail.birthday || '',
        'userPhone': userDetail.phone || '',
        'userAddress': userDetail.address || '',
        'userEmail': userDetail.email || ''
    };

    for (const [id, value] of Object.entries(fields)) {
        const element = document.getElementById(id);
        if (element) {
            if (element.type === 'date') {
                element.value = value; // Đã được format thành yyyy-MM-dd
            } else if (element.tagName === 'INPUT') {
                element.value = value;
            } else {
                element.textContent = value;
            }
        }
    }
}

// Hàm hiển thị thông tin chi tiết của user
async function showUserInfo(userId) {
    const user = originalUsers.find(u => u.ID === parseInt(userId));
    if (!user) {
        alert('Không tìm thấy thông tin người dùng!');
        return;
    }

    // Kiểm tra nếu role không phải "user" thì không hiển thị
    if (user.Role.toLowerCase() !== 'user') {
        alert('Chỉ có thể xem thông tin chi tiết của User!');
        return;
    }

    try {
        const response = await fetch(`https://localhost:44343/User/GetUserbyID?id=${userId}`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();

        const userDetail = {
            name: data.fullname || '',
            gender: data.Gender || '',
            birthday: formatDate(data.Birthday) || '',
            phone: data.Phone || '',
            address: data.Address || '',
            email: data.Email || ''
        };

        fillUserInfoForm(userDetail);
        showUserInfoModal();

    } catch (error) {
        alert('Không thể hiển thị thông tin người dùng!');
    }
}

function formatDate(dotNetDate) {
    // Xử lý chuỗi "/Date(1014570000000)/" để lấy timestamp
    const timestamp = parseInt(dotNetDate.replace(/[^0-9]/g, ''));
    const date = new Date(timestamp);
    
    // Format thành yyyy-MM-dd cho input type="date"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// Hàm hiển thị modal
function showUserInfoModal() {
  const modalUserInfor = document.getElementById('userInfoModal');
  if (!modalUserInfor) {
    throw new Error('Không tìm thấy modal thông tin');
  }
  modalUserInfor.classList.remove('hidden');
}

// Hàm ẩn modal
function hideUserInfoModal() {
  const modalUserInfor = document.getElementById('userInfoModal');
  if (!modalUserInfor) {
    throw new Error('Không tìm thấy modal thông tin');
  }
  modalUserInfor.classList.add('hidden');
}

// Gắn sự kiện đóng modal
const closeButton = document.querySelector('.closeUserInfo');
if (closeButton) {
  closeButton.addEventListener('click', hideUserInfoModal);
}

//------------------------------- End Hàm xem thông tin người dùng-------------------------------//

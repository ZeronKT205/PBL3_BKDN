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

// Hàm load dữ liệu người dùng
function loadUsers() {
  const userElements = document.querySelectorAll('#userlist tr');
  originalUsers = Array.from(userElements).map(user => ({
    id: user.querySelector('td:first-child').textContent,
    username: user.querySelector('td:nth-child(2)').textContent,
    email: user.querySelector('td:nth-child(3)').textContent,
    role: user.querySelector('td:nth-child(4)').textContent
  }));
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
function deleteUser(userId) {
  if (confirmUser('Bạn có chắc chắn muốn xóa người dùng này?')) {
    // TODO: Gọi API để xóa User
    // Ví dụ:
    // fetch(`/api/users/${userId}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Success:', data);
    //   // Cập nhật UI sau khi xóa User
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });

    // Xóa người dùng khỏi danh sách
    const userRow = document.querySelector(`.RemoveUser[data-userid="${userId}"]`).closest('tr');
    if (userRow) {
      userRow.remove();
      // Cập nhật lại originalUsers sau khi xóa
      originalUsers = originalUsers.filter(user => user.id !== userId);
    } else {
      console.error('Không tìm thấy người dùng để xóa');
    }
  }
}

// Hàm tìm kiếm người dùng theo tên người dùng
function searchUsers(query) {
  // Lọc kết quả dựa trên query
  const filteredResults = originalUsers.filter(user => 
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  // Cập nhật UI với kết quả tìm kiếm
  const tbody = document.getElementById('userlist');
  tbody.innerHTML = ''; // Xóa nội dung cũ

  filteredResults.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="InfoUser" data-userid="${user.id}">Info</button>
        <button class="RemoveUser" data-userid="${user.id}">Remove</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Gắn lại sự kiện cho các nút Info mới
  document.querySelectorAll('.InfoUser').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.getAttribute('data-userid');
      showUserInfo(userId);
    });
  });

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

// Hàm hiển thị thông tin chi tiết của user
function showUserInfo(userId) {
  const user = originalUsers.find(u => u.id === userId);
  if (!user) {
    alert('Không tìm thấy thông tin người dùng!');
    return;
  }

  // Kiểm tra nếu role không phải User thì không hiển thị
  if (user.role !== 'User') {
    alert('Chỉ có thể xem thông tin chi tiết của User!');
    return;
  }

  // TODO: Gọi API để lấy thông tin chi tiết của user
  // Ví dụ:
  // fetch(`/api/users/${userId}/info`)
  //   .then(response => response.json())
  //   .then(data => {
  //     fillUserInfoForm(data);
  //     showUserInfoModal();
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });

  // Tạm thời sử dụng dữ liệu mẫu
  const userDetail = {
    name: "Nguyễn Văn A",
    gender: "Nam",
    birthday: "1990-01-01",
    phone: "0123456789",
    address: "123 Đường ABC, Quận XYZ, TP.HCM",
    email: user.email
  };

  try {
    fillUserInfoForm(userDetail);
    showUserInfoModal();
  } catch (error) {
    console.error('Lỗi khi hiển thị thông tin:', error);
    alert('Có lỗi xảy ra khi hiển thị thông tin!');
  }
}

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
    'userName': userDetail.name,
    'userGender': userDetail.gender,
    'userBirthday': userDetail.birthday,
    'userPhone': userDetail.phone,
    'userAddress': userDetail.address,
    'userEmail': userDetail.email
  };

  for (const [id, value] of Object.entries(fields)) {
    const element = document.getElementById(id);
    if (element) {
      element.value = value;
    }
  }
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

// Gắn sự kiện cho các nút Info
document.querySelectorAll('.InfoUser').forEach(button => {
  button.addEventListener('click', function() {
    const userId = this.getAttribute('data-userid');
    if (userId) {
      showUserInfo(userId);
    }
  });
});

//------------------------------- End Hàm xem thông tin người dùng-------------------------------//

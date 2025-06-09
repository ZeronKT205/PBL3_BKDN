window.onload = function () {
    loaduser();
};
// Sửa thông tin
const btnEdit = document.querySelector('.btn-edit-info');
const userInfoContainer = document.querySelector('.user-info-container');
let isEditing = false;
const userInfo = getUserInfo();
btnEdit.addEventListener('click', async function () {
    if (!isEditing) {
        userInfoContainer.querySelectorAll('.user-info-row').forEach((row) => {
            const valueSpan = row.querySelector('.user-info-value');
            const label = row.querySelector('.user-info-label').innerText.trim();
            let type = 'text';
            if (label.includes('Username')) {
                valueSpan.innerHTML = `<input type='text' value='${valueSpan.innerText.trim()}' readonly style='background:#222; color:#aaa; cursor:not-allowed;'>`;
                return;
            }
            if (label.includes('Email')) { type = 'email'; }
            if (label.includes('Số điện thoại')) { type = 'tel'; }
            if (label.includes('Ngày sinh')) {
                const currentDate = valueSpan.innerText.trim();
                if (currentDate) {
                    // Chuyển đổi từ định dạng dd/MM/yyyy sang yyyy-MM-dd
                    const [day, month, year] = currentDate.split('/');
                    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                    valueSpan.innerHTML = `<input type='date' value='${formattedDate}' />`;
                } else {
                    valueSpan.innerHTML = `<input type='date' />`;
                }
                return;
            }
            if (label.includes('Giới tính')) {
                const currentGender = valueSpan.innerText.trim();
                valueSpan.innerHTML = `<select>
                    <option value="Nam" ${currentGender === 'Nam' ? 'selected' : ''}>Nam</option>
                    <option value="Nữ" ${currentGender === 'Nữ' ? 'selected' : ''}>Nữ</option>
                    <option value="Khác" ${currentGender === 'Khác' ? 'selected' : ''}>Khác</option>
                </select>`;
                return;
            }
            valueSpan.innerHTML = `<input type='${type}' value='${valueSpan.innerText.trim()}' />`;
        });
        btnEdit.innerHTML = '<i class="fas fa-save"></i> Lưu thông tin';
        isEditing = true;
    } else {
        // Thu thập dữ liệu từ form
        
        const formData = {
            User_ID: userInfo.id,
            fullname: '',
            Email: '',
            Phone: '',
            Address: '',
            Gender: '',
            Birthday: null
        };

        userInfoContainer.querySelectorAll('.user-info-row').forEach((row) => {
            const label = row.querySelector('.user-info-label').innerText.trim();
            const input = row.querySelector('input, select');
            if (input && !input.readOnly) {
                if (label.includes('Họ và tên')) formData.fullname = input.value;
                if (label.includes('Email')) formData.Email = input.value;
                if (label.includes('Số điện thoại')) formData.Phone = input.value;
                if (label.includes('Địa chỉ')) formData.Address = input.value;
                if (label.includes('Giới tính')) formData.Gender = input.value;
                if (label.includes('Ngày sinh')) {
                    formData.Birthday = input.value; // Giữ nguyên định dạng YYYY-MM-DD
                }
            }
        });

        // Gửi request cập nhật
        try {
            const response = await fetch('/User/UpdateUserInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Cập nhật thông tin thành công!');
                loaduser(); // Tải lại thông tin
            } else {
                alert('Có lỗi xảy ra: ' + data.message);
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi cập nhật thông tin!');
        }

        // Reset UI
        btnEdit.innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa thông tin';
        isEditing = false;
    }
});

// Đổi mật khẩu
const btnChangePass = document.querySelector('.btn-change-pass');
const changePassModal = document.getElementById('changePassModal');
const closeChangePass = document.querySelector('.close-change-pass');

btnChangePass.addEventListener('click', () => {
    changePassModal.classList.add('show');
});

closeChangePass.addEventListener('click', () => {
    changePassModal.classList.remove('show');
});

window.addEventListener('click', (e) => {
    if (e.target === changePassModal) changePassModal.classList.remove('show');
});

// Xử lý form đổi mật khẩu
document.getElementById('changePassForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const currentPassword = document.getElementById('oldPass');
    const newPassword = document.getElementById('newPass');
    const renewPassword = document.getElementById('reNewPass');

    if (!currentPassword || !newPassword || !renewPassword) {
        alert('Không thể tìm thấy các trường mật khẩu');
        return;
    }

    if (newPassword.value !== renewPassword.value) {
        alert('Mật khẩu mới không khớp');
        return;
    }

    const formData = {
        userId: userInfo.id,
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
    };

    try {
        const response = await fetch('/User/ChangePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Đổi mật khẩu thành công');
            document.getElementById('changePassForm').reset();
            document.getElementById('changePassModal').classList.remove('show');
        } else {
            alert(data.message || 'Đổi mật khẩu thất bại');
        }
    } catch (error) {
        alert('Có lỗi xảy ra khi đổi mật khẩu');
    }
});

async function loaduser() {
    const userInfo = getUserInfo();
    const response = await fetch(`${window.location.origin}/User/GetUserbyID?id=${userInfo.id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    const container = document.getElementById("user__info");
    container.innerHTML = `
                    <div class="user-info-row">
                        <span class="user-info-label"><i class="fas fa-user"></i> Họ và tên</span>
                        <span class="user-info-value">${data.fullname}</span>
                    </div>
                    <div class="user-info-row">
                        <span class="user-info-label"><i class="fas fa-user"></i> Username</span>
                        <span class="user-info-value">${userInfo.username}</span>
                    </div>
                    <div class="user-info-row">
                        <span class="user-info-label"><i class="fas fa-envelope"></i> Email</span>
                        <span class="user-info-value">${userInfo.email}</span>
                    </div>
                    <div class="user-info-row">
                        <span class="user-info-label"><i class="fas fa-phone"></i> Số điện thoại</span>
                        <span class="user-info-value">${data.Phone}</span>
                    </div>
                    <div class="user-info-row">
                        <span class="user-info-label"><i class="fas fa-calendar-alt"></i> Ngày sinh</span>
                        <span class="user-info-value">${data.Birthday ? formatDate(data.Birthday) : ''}</span>
                    </div>
                    <div class="user-info-row">
                        <span class="user-info-label"><i class="fas fa-venus-mars"></i> Giới tính</span>
                        <span class="user-info-value">${data.Gender}</span>
                    </div>
                    <div class="user-info-row">
                        <span class="user-info-label"><i class="fas fa-map-marker-alt"></i> Địa chỉ</span>
                        <span class="user-info-value">${data.Address}</span>
                    </div>
    `;
}

function formatDate(dotNetDate) {
    const ms = parseInt(dotNetDate.replace(/\D/g, ""));
    const date = new Date(ms);
    return date.toLocaleDateString("vi-VN");
}
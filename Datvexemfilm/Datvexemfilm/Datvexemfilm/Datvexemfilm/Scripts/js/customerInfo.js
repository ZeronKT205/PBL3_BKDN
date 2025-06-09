window.onload = function () {
    loaduser();
};
// Sửa thông tin
const btnEdit = document.querySelector('.btn-edit-info');
const userInfoContainer = document.querySelector('.user-info-container');
let isEditing = false;

btnEdit.addEventListener('click', function() {
    if (!isEditing) {
        userInfoContainer.querySelectorAll('.user-info-row').forEach((row) => {
            const valueSpan = row.querySelector('.user-info-value');
            const label = row.querySelector('.user-info-label').innerText.trim();
            let type = 'text';
            if (label.includes('Username')) {
                valueSpan.innerHTML = `<input type='text' value='${valueSpan.innerText.trim()}' readonly style='background:#222; color:#aaa; cursor:not-allowed;'>`;
                return;
            }
            if (label.includes('Email')) { type = 'email'; id = 'email' };
            if (label.includes('Số điện thoại')) { type = 'tel'; id = 'phone' };
            if (label.includes('Ngày sinh')) type = 'date';
            if (label.includes('Giới tính')) {
                valueSpan.innerHTML = `<select><option>Nam</option><option>Nữ</option><option>Khác</option></select>`;
                return;
            }
            valueSpan.innerHTML = `<input type='${type}' value='${valueSpan.innerText.trim()}' />`;
        });
        btnEdit.innerHTML = '<i class="fas fa-save"></i> Lưu thông tin';
        isEditing = true;
    } else {
        userInfoContainer.querySelectorAll('.user-info-row').forEach((row) => {
            const valueSpan = row.querySelector('.user-info-value');
            const input = valueSpan.querySelector('input, select');
            if (input) valueSpan.innerText = input.value || input.options[input.selectedIndex].text;
        });
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
/**
 * Hàm lưu thông tin người dùng vào localStorage sau khi đăng nhập thành công
 * @param {Object} userInfo - Thông tin người dùng
 * @param {string} userInfo.username - Tên đăng nhập
 *
 * @param {string} userInfo.role - Vai trò (user/admin)
 */

window.addEventListener('pageshow', function (event) {
    // Nếu không phải reload thực sự (tức là load từ cache)
    if (event.persisted || (performance && performance.getEntriesByType('navigation')[0].type === 'back_forward')) {
        window.location.reload();
    }
});



function saveUserInfo(userInfo) {
    try {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
        console.error('Lỗi khi lưu thông tin người dùng:', error);
    }
}

/**
 * Hàm lấy thông tin người dùng từ localStorage
 * @returns {Object|null} Thông tin người dùng hoặc null nếu chưa đăng nhập
 */
function getUserInfo() {
    try {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        return null;
    }
}

/**
 * Hàm xóa thông tin người dùng khỏi localStorage khi đăng xuất
 */
function clearUserInfo() {
    try {
        localStorage.removeItem('userInfo');
        console.log('Đã xóa thông tin người dùng');
    } catch (error) {
        console.error('Lỗi khi xóa thông tin người dùng:', error);
    }
}

/**
 * Hàm kiểm tra trạng thái đăng nhập của người dùng
 * @returns {boolean} true nếu đã đăng nhập, false nếu chưa đăng nhập
 */
function isLoggedIn() {
    return getUserInfo() !== null;
}

/**
 * Hàm kiểm tra và chuyển hướng nếu chưa đăng nhập
 * @param {string} redirectUrl - URL để chuyển hướng nếu chưa đăng nhập
 */
function checkAuth(redirectUrl = '/Home/userlogin') {
    if (!isLoggedIn()) {
        alert('Vui lòng đăng nhập để tiếp tục!');
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

/**
 * Hàm kiểm tra quyền admin
 * @returns {boolean} true nếu là admin, false nếu không phải
 */
function isAdmin() {
    const userInfo = getUserInfo();
    return userInfo && userInfo.role === 'admin';
}

/**
 * Hàm kiểm tra và chuyển hướng nếu không phải admin
 * @param {string} redirectUrl - URL để chuyển hướng nếu không phải admin
 */
function checkAdmin(redirectUrl = '/Home/Index') {
    if (!isAdmin()) {
        alert('Bạn cần đăng nhập với tài khoản Admin để truy cập trang này!');
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

/**
 * Hàm xử lý UI dựa trên trạng thái đăng nhập
 */
function handleUIForLoginStatus() {
    const userInfo = getUserInfo();
    const loginBtn = document.querySelector('.btn-login');
    const logoutBtn = document.querySelector('.btn-logout');
    const userMenu = document.querySelector('.user-menu');
    const historyLink = document.querySelector('.history-link');
    const profileLink = document.querySelector('.profile-link');
    const btnsignup = document.querySelector('.navbar__content-btn');

    if (isLoggedIn()) {
        // Người dùng đã đăng nhập
        if(btnsignup) btnsignup.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (userMenu) userMenu.style.display = 'block';
        if (historyLink) historyLink.style.display = 'block';
        if (profileLink) profileLink.style.display = 'block';
    } else {
        // Người dùng chưa đăng nhập
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'none';
        if (historyLink) historyLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
    }
}

// Thêm sự kiện kiểm tra đăng nhập khi trang được tải
document.addEventListener('DOMContentLoaded', function () {
    const protectedPages = [
        '/home/bookingticket',
        '/home/payment',
        '/home/customerinfor',
        '/home/searchfilmPage',
        '/home/detailmovie',
        '/home/historybooking'
    ];
    const adminPages = [
        '/home/adminhome'
    ];
    const currentPage = window.location.pathname.toLowerCase();

    if (currentPage === '/home/home') {
        handleUIForLoginStatus();
    } else if (adminPages.includes(currentPage)) {
        checkAdmin();
    } else if (protectedPages.includes(currentPage)) {
        checkAuth();
    }

    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            clearUserInfo();
            window.location.href = '/Home/Index';
        });
    }

});




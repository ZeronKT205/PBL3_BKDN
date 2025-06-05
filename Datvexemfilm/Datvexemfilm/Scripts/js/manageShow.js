document.addEventListener('DOMContentLoaded', function () {
    loadshow();
});
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
function handleEditShow(showId) {
    const show = showList.find(s => s.Id === showId);
    if (show) {
        // Set values for edit form
        document.getElementById('editShowId').value = show.Id;
        document.getElementById('editMovieTitle').value = show.Title;
        document.getElementById('editScreenName').value = show.CinemaRoom;
        document.getElementById('editShowtime').value = show.Showtime;
        document.getElementById('editPrice').value = show.Price;
        
        // Show modal
        document.getElementById('editShowModal').classList.remove('hidden');
    }
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
function convertDotNetDateToVN(dotNetDateString) {
    // Lấy timestamp từ chuỗi "/Date(1748192400000)/"
    const match = /\/Date\((\d+)\)\//.exec(dotNetDateString);
    if (!match) return null;

    const timestamp = parseInt(match[1]);

    // Tạo đối tượng Date từ timestamp và cộng thêm 7 giờ
    const date = new Date(timestamp + 7 * 60 * 60 * 1000);

    // Định dạng dd/MM/yyyy HH:mm
    const dd = String(date.getDate()).padStart(2, '0');
    const MM = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
    const yyyy = date.getFullYear();

    return `${dd}/${MM}/${yyyy}`;
}

// Hàm lấy danh sách phim và phòng từ dữ liệu suất chiếu
function updateMovieAndScreenLists_(showData) {
    try {
        // Tạo Set để loại bỏ các giá trị trùng lặp
        const uniqueMovies = new Set();
        const uniqueScreens = new Set();

        // Lấy danh sách phim và phòng từ dữ liệu suất chiếu
        showData.forEach(show => {
            uniqueMovies.add(show.Name_Movie);
            uniqueScreens.add(show.Name_Room);
        });

        // Cập nhật listbox phim
        const movieSelect = document.querySelector('.mainPage__Shows__Containersearch-movie-select');
        if (movieSelect) {
            // Giữ lại option đầu tiên
            movieSelect.innerHTML = '<option value="0">Tất Cả Phim</option>';
            // Thêm các phim mới
            uniqueMovies.forEach(movieName => {
                const option = document.createElement('option');
                option.value = movieName;
                option.textContent = movieName;
                movieSelect.appendChild(option);
            });
        }

        // Cập nhật listbox phòng
        const screenSelect = document.querySelector('.mainPage__Shows__Containersearch-screen-select');
        if (screenSelect) {
            // Giữ lại option đầu tiên
            screenSelect.innerHTML = '<option value="0">Phòng Chiếu</option>';
            // Thêm các phòng mới
            uniqueScreens.forEach(screenName => {
                const option = document.createElement('option');
                option.value = screenName;
                option.textContent = screenName;
                screenSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error updating movie and screen lists:', error);
    }
}

// Cập nhật hàm loadshow
window.loadshow = async function() {
    try {
        const response = await fetch("https://localhost:44343/Show/getallshow", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            throw new Error(`Show API error: ${response.status}`);
        }
        
        const data = await response.json();
        showList = data;
        
        // Cập nhật danh sách phim và phòng từ dữ liệu suất chiếu
        updateMovieAndScreenLists_(data);
        
        // Sửa lại selector để chắc chắn tìm đúng tbody
        const tbody = document.querySelector('.mainPage__Shows__containerinfo-table tbody');
        if (!tbody) {
            console.error('Could not find tbody element');
            return;
        }
        
        tbody.innerHTML = '';
        data.forEach(show => {
            const _show = document.createElement("tr");
            _show.innerHTML = `
                <td>${show.ID_Show}</td>
                <td>${show.Name_Movie}</td>
                <td>${show.Name_Room}</td>
                <td>${convertDotNetDateToVN(show.Day)}</td>
                <td>${show.Start_Movie.Hours}:${show.Start_Movie.Minutes}</td>
                 <td>${show.End_Movie.Hours}:${show.End_Movie.Minutes}</td>
                <td>${show.Price}</td>
                <td>
                    <button class="edit-btn" onclick="handleEditShow(${show.ID_Show})">Edit</button>
                    <button class="delete-btn" onclick="handleDeleteShow(${show.ID_Show})">Delete</button>
                </td>
            `;
            tbody.appendChild(_show);
        });
    } catch (error) {
        console.error('Error in loadshow:', error);
    }
}

// Hàm gắn event listeners cho các nút
function attachShowEventListeners() {
    // Gắn sự kiện cho nút Edit
    document.querySelectorAll('.EditShow').forEach(btn => {
        btn.addEventListener('click', handleEditShow);
    });

    // Gắn sự kiện cho nút Delete
    document.querySelectorAll('.DeleteShow').forEach(btn => {
        btn.addEventListener('click', handleDeleteShow);
    });
}

// Gọi loadshow khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra xem có đang ở tab Shows không
    const showsPage = document.querySelector('.mainPage__Shows');
    if (showsPage && !showsPage.classList.contains('hidden')) {
        loadshow();
    }
});

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

// Hàm xử lý xem chi tiết đặt vé


// Create a namespace for show management
const ShowManager = {
    originalShows: [],
    currentEditId: null,
    movieList: [], // Thêm biến lưu danh sách phim
    screenList: [], // Thêm biến lưu danh sách phòng chiếu

    init: function() {
        this.attachEventListeners();
    },

    loadShows: async function() {
        try {
            const showsTab = document.querySelector('.mainPage__Shows');
            if (!showsTab || showsTab.classList.contains('hidden')) {
                console.log('Shows tab is not visible, skipping load');
                return;
            }

            const response = await fetch(`${window.location.origin}/Show/getallshow`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const shows = await response.json();
            
            const tbody = document.querySelector('.mainPage__Shows__containerinfo-table tbody');
            if (!tbody) {
                console.error('Table body not found. Available elements:', document.querySelectorAll('tbody'));
                return;
            }

            this.originalShows = shows.map(show => ({
                id: String(show.ID_Show),
                movie: show.Name_Movie,
                screen: show.Name_Room,
                date: convertDotNetDateToVN(show.Day),
                startTime: `${show.Start_Movie.Hours}:${show.Start_Movie.Minutes}`,
                endTime: `${show.End_Movie.Hours}:${show.End_Movie.Minutes}`,
                price: show.Price
            }));

            this.updateShowTable(this.originalShows);
        } catch (error) {
            console.error("Error loading shows:", error);
        }
    },

    updateShowTable: function(shows) {
        const tbody = document.querySelector('.mainPage__Shows__containerinfo-table tbody');
        if (!tbody) {
            console.error('Table body not found in updateShowTable');
            return;
        }
        tbody.innerHTML = '';

        shows.forEach(show => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${show.id}</td>
                <td>${show.movie}</td>
                <td>${show.screen}</td>
                <td>${show.date}</td>
                <td>${show.startTime}</td>
                <td>${show.endTime}</td>
                <td>${parseInt(show.price).toLocaleString('vi-VN')} VND</td>
                <td>
                    <button class="EditShow" data-id="${show.id}">Edit</button>
                    <button class="DeleteShow" data-id="${show.id}">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Gắn sự kiện cho các nút Edit và Delete
        const editButtons = document.querySelectorAll('.EditShow');
        editButtons.forEach(btn => {
            btn.onclick = (e) => {
                console.log('Edit button clicked');
                const showId = e.target.getAttribute('data-id');
                console.log('Show ID:', showId);
                const show = this.originalShows.find(s => s.id === showId);
                console.log('Found show:', show);
                if (show) {
                    this.showEditModal(show);
                } else {
                    console.error('Show not found with ID:', showId);
                }
            };
        });

        const deleteButtons = document.querySelectorAll('.DeleteShow');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const showId = e.target.getAttribute('data-id');
                if (confirm('Bạn có chắc chắn muốn xóa suất chiếu này?')) {
                    this.deleteShow(showId);
                }
            });
        });
    },

    deleteShow: async function(showId) {
        try {
            const response = await fetch(`${window.location.origin}/Show/DeleteShow?show_id=${showId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Xóa suất chiếu thất bại');

            // Cập nhật lại danh sách
            this.originalShows = this.originalShows.filter(show => show.id !== showId);
            this.updateShowTable(this.originalShows);
        } catch (error) {
            console.error('Error deleting show:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        }
    },

    loadMovies: async function() {
        try {
            const response = await fetch(`${window.location.origin}/Film/GetFilm`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const movies = await response.json();
            this.movieList = movies; // Lưu danh sách phim
            const movieSelect = document.getElementById('showMovie');
            if (movieSelect) {
                movieSelect.innerHTML = '<option value="">Chọn phim</option>';
                movies.forEach(movie => {
                    const option = document.createElement('option');
                    option.value = movie.ID_Movie;
                    option.textContent = movie.name;
                    movieSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Error loading movies:", error);
        }
    },

    loadScreens: async function() {
        try {
            const response = await fetch(`${window.location.origin}/Screen/getallscreen`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const screens = await response.json();
            this.screenList = screens; // Lưu danh sách phòng chiếu
            const screenSelect = document.getElementById('showScreen');
            if (screenSelect) {
                screenSelect.innerHTML = '<option value="">Chọn phòng chiếu</option>';
                screens.forEach(screen => {
                    const option = document.createElement('option');
                    option.value = screen.Room_ID;
                    option.textContent = screen.Room_Name;
                    screenSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Error loading screens:", error);
        }
    },

    showAddModal: function() {
        const modal = document.getElementById('addShowModal');
        if (!modal) {
            console.error('Add modal element not found');
            return;
        }

        // Load movies and screens for dropdowns
        this.loadMovies();
        this.loadScreens();

        // Reset form
        const form = document.getElementById('addShowForm');
        if (form) {
            form.reset();
        }

        modal.classList.remove('hidden');
    },

    showEditModal: async function(show) {
        console.log('Opening edit modal for show:', show);
        const modal = document.getElementById('editShowModal');
        if (!modal) {
            console.error('Edit modal element not found');
            return;
        }

        // Load movies and screens for dropdowns
        await this.loadMovies();
        await this.loadScreens();

        // Fill form with show data
        const form = document.getElementById('editShowForm');
        if (!form) {
            console.error('Edit form element not found');
            return;
        }

        try {
            document.getElementById('editShowId').value = show.id;
            
            // Set movie name
            const movieInput = document.getElementById('editMovieTitle');
            if (movieInput) movieInput.value = show.movie;
            
            // Set screen name
            const screenInput = document.getElementById('editScreenName');
            if (screenInput) screenInput.value = show.screen;
            
            // Format date from dd/MM/yyyy to yyyy-MM-dd
            const [day, month, year] = show.date.split('/');
            const formattedDate = `${year}-${month}-${day}`;
            document.getElementById('editShowDate').value = formattedDate;

            document.getElementById('editStartTime').value = show.startTime;
            document.getElementById('editEndTime').value = show.endTime;
            
            // Format price to remove VND and dots
            const priceInput = document.getElementById('editPrice');
            if (priceInput) {
                const price = show.price.toString().replace(/[^\d]/g, '');
                priceInput.value = price;
            }

            modal.classList.remove('hidden');
            console.log('Edit modal opened successfully');
        } catch (error) {
            console.error('Error showing edit modal:', error);
        }
    },

    findMovieIdByName: function(movieName) {
        const movie = this.movieList.find(m => m.name === movieName);
        return movie ? movie.ID_Movie : null;
    },

    findScreenIdByName: function(screenName) {
        const screen = this.screenList.find(s => s.Room_Name === screenName);
        return screen ? screen.Room_ID : null;
    },

    attachEventListeners: function() {
        // Add show button
        const addButton = document.querySelector('.mainPage__Shows__Containersearch-button-add');
        if (addButton) {
            addButton.onclick = () => this.showAddModal();
        }

        // Cancel buttons
        const cancelAddButton = document.getElementById('cancelAddShow');
        if (cancelAddButton) {
            cancelAddButton.onclick = () => {
                const modal = document.getElementById('addShowModal');
                if (modal) modal.classList.add('hidden');
            };
        }

        const cancelEditButton = document.getElementById('cancelEditShow');
        if (cancelEditButton) {
            cancelEditButton.onclick = () => {
                const modal = document.getElementById('editShowModal');
                if (modal) modal.classList.add('hidden');
            };
        }

        // Add show form submission
        const addForm = document.getElementById('addShowForm');
        if (addForm) {
            addForm.onsubmit = async (e) => {
                e.preventDefault();
                const showData = {
                    ID_Movie: document.querySelector('#showMovie').value,
                    Room_ID: document.querySelector('#showScreen').value,
                    Day: document.querySelector('#showDate').value,
                    Start_Movie: document.querySelector('#showStartTime').value,
                    End_Movie: document.querySelector('#showEndTime').value,
                    Price: document.querySelector('#showPrice').value,
                    Status:"ON"
                };

                // Log show data object
                console.log('Show Data Object:', showData);

                try {
                    const response = await fetch('/Show/addshow', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(showData)
                    });

                    // Log response
                    console.log('Response status:', response.status);
                    const result = await response.json();
                    console.log('Response data:', result);

                    if (response.ok) {
                        alert('Thêm suất chiếu thành công!');
                        const modal = document.getElementById('addShowModal');
                        if (modal) modal.classList.add('hidden');
                        window.loadshow();
                    } else {
                        alert('Lỗi: ' + result.message);
                    }
                } catch (error) {
                    console.error('Error adding show:', error);
                    alert('Có lỗi xảy ra khi thêm suất chiếu!');
                }
            };
        }

        // Edit show form submission
        const editForm = document.getElementById('editShowForm');
        if (editForm) {
            editForm.onsubmit = async (e) => {
                e.preventDefault();
                const movieName = document.querySelector('#editMovieTitle').value;
                const screenName = document.querySelector('#editScreenName').value;
                
                // Tìm ID từ tên trong danh sách đã lưu
                const movie = this.movieList.find(m => m.name === movieName);
                const screen = this.screenList.find(s => s.Room_Name === screenName);
                
                if (!movie || !screen) {
                    alert('Không tìm thấy thông tin phim hoặc phòng chiếu!');
                    return;
                }

                const showData = {
                    Show_ID: document.querySelector('#editShowId').value,
                    Room_ID: screen.Room_ID,
                    ID_Movie: movie.ID_Movie,
                    Start_Movie: document.querySelector('#editStartTime').value + ":00",
                    End_Movie: document.querySelector('#editEndTime').value + ":00",
                    Day: document.querySelector('#editShowDate').value,
                    Status: "ON",
                    Price: document.querySelector('#editPrice').value
                };
                console.log('Update Data:', showData);
                try {
                    const response = await fetch(`${window.location.origin}/Show/UpdateShow/${showData.Show_ID}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(showData)
                    });
                    
                    if (!response.ok) throw new Error('Cập nhật suất chiếu thất bại');
                    
                    // Close modal and reload shows
                    const modal = document.getElementById('editShowModal');
                    if (modal) modal.classList.add('hidden');
                    window.loadshow();
                    alert('Cập nhật suất chiếu thành công!');
                    
                } catch (error) {
                    console.error('Error updating show:', error);
                    alert('Có lỗi xảy ra: ' + error.message);
                }
            };
        }

        // Edit button handling in table
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('EditShow')) {
                const showId = e.target.getAttribute('data-id');
                const show = this.originalShows.find(s => s.id === showId);
                if (show) {
                    this.showEditModal(show);
                }
            }
        });

        // Delete button handling in table
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('DeleteShow')) {
                const showId = e.target.getAttribute('data-id');
                this.deleteShow(showId);
            }
        });

        // Listen for tab changes
        const showsTab = document.querySelector('.navbar__management-Shows');
        if (showsTab) {
            showsTab.addEventListener('click', () => {
                console.log('Shows tab clicked');
                setTimeout(() => this.loadShows(), 100);
            });
        }
    }
};

// Initialize the show manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ShowManager.init();
});
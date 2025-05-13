//-----------------------Hàm này xử lý edit và Add trong quản lý Phim---------------------//
// Mở modal khi bấm Edit hoặc Thêm Phim
document.querySelectorAll('.Editmovie1, .AddMovieBtn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.getElementById('movieModal').classList.remove('hidden');
      // TODO: Nếu là Edit, load dữ liệu phim vào form
      // Nếu là Thêm, reset form và poster preview về mặc định
    });
  });
  
  // Đóng modal khi bấm Hủy
  document.getElementById('cancelMovieBtn').onclick = function() {
    document.getElementById('movieModal').classList.add('hidden');
  };
  
  // Xử lý upload poster
  document.getElementById('moviePosterBtn').onclick = function() {
    document.getElementById('moviePosterInput').click();
  };
  document.getElementById('moviePosterInput').onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        document.getElementById('moviePosterPreview').src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Xử lý submit form
  document.getElementById('movieForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const movieData = Object.fromEntries(formData.entries());
    // TODO: Gọi API backend để lưu dữ liệu phim
    // Ví dụ:
    // fetch('/api/movies', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(movieData),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Success:', data);
    //   document.getElementById('movieModal').classList.add('hidden');
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });
  });

// Hàm xóa phim
function deleteMovie(movieId) {
  if (confirm('Bạn có chắc chắn muốn xóa phim này?')) {
    // TODO: Gọi API backend để xóa phim
    // fetch(`/api/movies/${movieId}`, {
    //   method: 'DELETE',
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Success:', data);
    //   // Xóa phim khỏi danh sách
    //   originalMovies = originalMovies.filter(movie => movie.id !== movieId);
    //   // Cập nhật UI
    //   updateMovieTable(originalMovies);
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });

    // Tạm thời xóa khỏi danh sách local
    originalMovies = originalMovies.filter(movie => movie.id !== movieId);
    // Cập nhật UI
    updateMovieTable(originalMovies);
  }
}

// Hàm cập nhật bảng phim
function updateMovieTable(movies) {
  const tbody = document.querySelector('.mainPage__Movies__Container tbody');
  tbody.innerHTML = ''; // Xóa nội dung cũ

  movies.forEach(movie => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${movie.id}</td>
      <td>${movie.title}</td>
      <td>${movie.genre}</td>
      <td>${movie.releaseDay}</td>
      <td><span>${movie.status}</span></td>
      <td>
        <button class="Editmovie1" data-id="${movie.id}">Edit</button>
        <button class="DeleteMovie" data-id="${movie.id}">Xóa</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Gắn lại sự kiện cho các nút sau khi cập nhật bảng
  attachTableEvents();
}

// Hàm gắn sự kiện cho các nút trong bảng
function attachTableEvents() {
  // Gắn sự kiện cho nút Edit
  document.querySelectorAll('.Editmovie1').forEach(btn => {
    btn.addEventListener('click', function() {
      const movieId = this.dataset.id;
      const movie = originalMovies.find(m => m.id === movieId);
      if (movie) {
        // Mở modal
        document.getElementById('movieModal').classList.remove('hidden');
        // Điền dữ liệu vào form
        document.getElementById('movieTitle').value = movie.title;
        document.getElementById('movieDescription').value = movie.description;
        // TODO: Điền các trường khác
      }
    });
  });

  // Gắn sự kiện cho nút Delete
  document.querySelectorAll('.DeleteMovie').forEach(btn => {
    btn.addEventListener('click', function() {
      const movieId = this.dataset.id;
      deleteMovie(movieId);
    });
  });
}

// Gắn sự kiện ban đầu cho bảng
attachTableEvents();
  
  // Xử lý edit phim
  document.querySelectorAll('.Editmovie1').forEach(btn => {
    btn.addEventListener('click', function() {
      const movieId = this.dataset.id;
      // TODO: Gọi API backend để lấy thông tin phim
      // Ví dụ:
      // fetch(`/api/movies/${movieId}`)
      // .then(response => response.json())
      // .then(data => {
      //   // Điền dữ liệu vào form
      //   document.getElementById('movieTitle').value = data.title;
      //   document.getElementById('movieDescription').value = data.description;
      //   // ... các trường khác
      // })
      // .catch((error) => {
      //   console.error('Error:', error);
      // });

      // Dữ liệu mẫu cho Edit (sẽ được thay thế bằng dữ liệu từ API)
      const sampleData = {
        title: 'Sample Movie',
        description: 'This is a sample movie description.',
        // Thêm các trường khác nếu cần
      };

      // Điền dữ liệu mẫu vào form
      document.getElementById('movieTitle').value = sampleData.title;
      document.getElementById('movieDescription').value = sampleData.description;
      // TODO: Điền các trường khác từ sampleData
    });
  });

//-----------------------End Hàm này xử lý edit và Add trong quản lý Phim---------------------//



  //-----------------------Hàm này xử lý tìm kiếm phim theo tên---------------------//
// Biến tạm để lưu trữ danh sách phim ban đầu
let originalMovies = [];

// Hàm tìm kiếm phim theo tên
function searchMovies(query) {
  // Lấy danh sách phim từ DOM nếu chưa có
  if (originalMovies.length === 0) {
    const movieElements = document.querySelectorAll('.mainPage__Movies__Container tbody tr'); // Giả sử mỗi phim là một hàng trong bảng
    originalMovies = Array.from(movieElements).map(movie => ({
      id: movie.querySelector('td:first-child').textContent,
      title: movie.querySelector('td:nth-child(2)').textContent, // Giả sử tiêu đề phim nằm ở cột thứ hai
      genre: movie.querySelector('td:nth-child(3)').textContent, // Giả sử thể loại phim nằm ở cột thứ ba
      releaseDay: movie.querySelector('td:nth-child(4)').textContent, // Giả sử ngày phát hành nằm ở cột thứ tư
      status: movie.querySelector('td:nth-child(5) span').textContent // Giả sử trạng thái nằm ở cột thứ năm
    }));
  }

  // Lọc kết quả dựa trên query
  const filteredResults = originalMovies.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  // Cập nhật UI với kết quả tìm kiếm
  updateMovieTable(filteredResults);
}


// Gắn sự kiện tìm kiếm cho nút tìm kiếm
document.querySelector('.searchMovieBtn').addEventListener('click', function() {
  const query = document.querySelector('.mainPage__Movies-search-input').value;
  searchMovies(query);
});
//-----------------------End Hàm này xử lý tìm kiếm phim theo tên---------------------//



  /*
  Note: Xử Lý các hàm load thông tin phim vào form
  - Lưu ý viết hàm lấy thông tin phim từ MovieID rồi điền vào mục sampleData.
- Lưu ý xử lý view hiển thị khi thêm hoặc xóa phim
- Trong hàm search, Danh sách phim sẽ được lưu trong biến originalMovies, để tránh việc phải lấy lại từ DB
nên khi xóa hay thêm một phim mới chỉ cần thêm vào biến tạm này là được.

   */
  





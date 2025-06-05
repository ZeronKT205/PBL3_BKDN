// Global variables for movie management
let movie_originalMovies = [];
let movie_currentEditId = null;

// Initialize movie management
function movie_init() {
    movie_loadMovies();
    gettype();
    movie_attachEventListeners();
}

async function movie_loadMovies() {
    try {
        const response = await fetch(`${window.location.origin}/Film/GetFilm`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const movies = await response.json();
        
        const tbody = document.querySelector('.mainPage__Movies__Container tbody');
        if (!tbody) {
            console.error('Table body not found');
            return;
        }
        tbody.innerHTML = '';

        movie_originalMovies = movies.map(movie => ({
            id: String(movie.ID_Movie),
            title: movie.name,
            src: movie.src,
            genre: movie.Type,
            releaseDay: movie.releaseDay,
            status: movie.Status,
            duration: movie.Duration,
            language: movie.Language,
            director: movie.Director,
            fullDescription: movie.FullDescription,
            shortDescription: movie.ShortDescription,
            poster: movie.Poster,
            cast: movie._Cast,
            trailer: movie.Trailer,
            idType: movie.ID_Type
        }));

        movie_updateMovieTable(movie_originalMovies);
    } catch (error) {
        console.error("Error loading movies:", error);
    }
}

async function movie_deleteMovie(movieId) {
    if (confirm('Bạn có chắc chắn muốn xóa phim này?')) {
        try {
            const response = await fetch(`${window.location.origin}/Film/DeleteFilm?id=${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            
            if (result.success) {
                // Cập nhật danh sách phim trong bộ nhớ
                movie_originalMovies = movie_originalMovies.filter(movie => movie.id !== movieId);
                // Cập nhật bảng hiển thị
                movie_updateMovieTable(movie_originalMovies);
                alert('Xóa phim thành công!');
            } else {
                throw new Error(result.message || 'Xóa phim thất bại!');
            }
        } catch (error) {
            console.error('Error deleting movie:', error);
            alert('Có lỗi xảy ra khi xóa phim: ' + error.message);
        }
    }
}

function movie_updateMovieTable(movies) {
    const tbody = document.querySelector('.mainPage__Movies__Container tbody');
    if (!tbody) {
        console.error('Table body not found');
        return;
    }
    tbody.innerHTML = '';

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
    movie_attachTableEvents();
}

async function gettype() {
    try {
        const response = await fetch(`${window.location.origin}/Film/gettype`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        const types = document.querySelector('#movieType');
        types.innerHTML = ``;
        data.forEach(type => {
            const option = document.createElement('option');
            option.value = type.ID_Type;
            option.textContent = type.Name;
            types.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading movie types:', error);
    }
}

function movie_attachTableEvents() {
    // Edit button handling
    const editButtons = document.querySelectorAll('.Editmovie1');
    
    editButtons.forEach(btn => {
        btn.onclick = (e) => {
            const movieId = e.target.getAttribute('data-id');
            
            const movie = movie_originalMovies.find(m => m.id === movieId);
            
            if (movie) {
                movie_currentEditId = movieId;
                movie_showEditModal(movie);
            } else {
                console.error('Movie not found with ID:', movieId);
                console.log('Available movies:', movie_originalMovies);
            }
        };
    });

    // Delete button handling
    const deleteButtons = document.querySelectorAll('.DeleteMovie');
    
    deleteButtons.forEach(btn => {
        btn.onclick = (e) => {
            const movieId = e.target.getAttribute('data-id');
            movie_deleteMovie(movieId);
        };
    });
}

function movie_showEditModal(movie) {
    const modal = document.getElementById('movieModal');
    if (!modal) {
        console.error('Modal element not found');
        return;
    }

    // Fill form with movie data
    const form = document.getElementById('movieForm');
    if (!form) {
        console.error('Form element not found');
        return;
    }

    try {
        // Set values for each field
        gettype();
        document.getElementById('movieTitle').value = movie.title;
        document.getElementById('movieSrc').value = movie.src;
        document.getElementById('movieRelease').value = movie.releaseDay;
        document.getElementById('movieDirector').value = movie.director;
        document.getElementById('movieCast').value = movie.cast;
        document.getElementById('movieDuration').value = movie.duration;
        document.getElementById('movieLanguage').value = movie.language;
        document.getElementById('movieStatus').value = movie.status;
        document.getElementById('movieShortDesc').value = movie.shortDescription;
        document.getElementById('movieFullDesc').value = movie.fullDescription;
        document.getElementById('movieTrailer').value = movie.trailer;
        document.getElementById('moviePoster').value = movie.poster;

        
        // Set poster preview if exists
        const posterPreview = document.getElementById('moviePosterPreview');
        if (posterPreview && movie.poster) {
            posterPreview.src = movie.poster;
            document.getElementById('moviePoster').value = movie.poster;
        }

        // Show modal
        modal.classList.remove('hidden');
    } catch (error) {
        console.error('Error showing modal:', error);
    }
}

function movie_showAddModal() {
    const modal = document.getElementById('movieModal');
    if (!modal) {
        console.error('Modal element not found');
        return;
    }

    const form = document.getElementById('movieForm');
    if (!form) {
        console.error('Form element not found');
        return;
    }
    
    // Reset form
    form.reset();
    movie_currentEditId = null; 
    
    modal.classList.remove('hidden');
}

function movie_searchMovies(query) {
    const filteredResults = movie_originalMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
    );
    movie_updateMovieTable(filteredResults);
}

function movie_attachEventListeners() {
    // Add movie button
    const addButton = document.querySelector('.AddMovieBtn');
    if (addButton) {
        addButton.onclick = () => movie_showAddModal();
    }

    // Form submit handling
    const movieForm = document.getElementById('movieForm');
    if (movieForm) {
        movieForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await movie_saveMovie();
        });
    }

    // Cancel button
    const cancelButton = document.getElementById('cancelMovieBtn');
    if (cancelButton) {
        cancelButton.onclick = () => {
            const modal = document.getElementById('movieModal');
            if (modal) {
                modal.classList.add('hidden');
            }
        };
    }

    // Poster upload handling
    const posterBtn = document.getElementById('moviePosterBtn');
    const posterInput = document.getElementById('moviePosterInput');
    if (posterBtn && posterInput) {
        posterBtn.onclick = () => posterInput.click();
        
        posterInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const preview = document.getElementById('moviePosterPreview');
                    if (preview) {
                        preview.src = ev.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // Search handling
    const searchButton = document.querySelector('.searchMovieBtn');
    if (searchButton) {
        searchButton.onclick = () => {
            const input = document.querySelector('.mainPage__Movies-search-input');
            if (input) {
                movie_searchMovies(input.value);
            }
        };
    }
}

async function movie_saveMovie() {
    try {
        const form = document.getElementById('movieForm');
        if (!form) {
            console.error('Form not found');
            return;
        }

        const movieData = {
            name: document.getElementById('movieTitle').value,
            src: document.getElementById('movieSrc').value,
            ID_Type: document.getElementById('movieType').value,
            releaseDay: document.getElementById('movieRelease').value,
            Director: document.getElementById('movieDirector').value,
            _Cast: document.getElementById('movieCast').value,
            Duration: document.getElementById('movieDuration').value,
            Language: document.getElementById('movieLanguage').value,
            Status: document.getElementById('movieStatus').value,
            ShortDescription: document.getElementById('movieShortDesc').value,
            FullDescription: document.getElementById('movieFullDesc').value,
            Trailer: document.getElementById('movieTrailer').value,
            Poster: document.getElementById('moviePoster').value,
        };

        const url = movie_currentEditId 
            ? `${window.location.origin}/Film/UpdateFilm?id=${movie_currentEditId}`
            : `${window.location.origin}/Film/AddFilm`;


        const response = await fetch(url, {
            method: movie_currentEditId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movieData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response not OK:', response.status, errorText);
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Có lỗi xảy ra khi lưu phim');
        }

        // Close modal and refresh movie list
        document.getElementById('movieModal').classList.add('hidden');
        await movie_loadMovies();

        alert(result.message || (movie_currentEditId ? 'Cập nhật phim thành công!' : 'Thêm phim mới thành công!'));
    } catch (error) {
        console.error('Error saving movie:', error);
        alert('Có lỗi xảy ra: ' + error.message);
    }
}

// Initialize the movie management when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    movie_init();
});




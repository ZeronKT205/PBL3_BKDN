let mockTickets = [];

async function Tickets(userId) {
    const response = await fetch(`${window.location.origin}/User/history?id_user=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        console.error("Lỗi khi gọi API:", response.statusText);
        return [];
    }

    mockTickets = await response.json();
}

document.addEventListener('DOMContentLoaded', async () => {
    const userInfo = getUserInfo();
    const id = userInfo.id;
    await Tickets(id);
    renderTickets(mockTickets);
    setupEventListeners();
    loadTickets(); // Load tickets initially
});

function setupEventListeners() {
    document.querySelectorAll('.filter-btn').forEach(btn =>
        btn.addEventListener('click', () => applyFilter(btn.dataset.filter))
    );

    document.querySelector('.search-box input').addEventListener('input', e => searchTickets(e.target.value));

    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('ticketModal').classList.remove('active');
    });

    document.querySelector('.ticket-grid').addEventListener('click', (e) => {
        const ticketCard = e.target.closest('.ticket-card');
        if (!ticketCard) return; // Click not inside ticket card
        if (e.target.closest('.btn-details')) {
            const ticketId = ticketCard.dataset.ticketId;
            showTicketDetails(ticketId);
        } else if (!e.target.closest('button') && !e.target.closest('a')) {
            const ticketId = ticketCard.dataset.ticketId;
            showTicketDetails(ticketId);
        }
    });

    const bookNowBtn = document.querySelector('.btn-book-now');
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../FE/bookingTicket.html'; // Adjust path as needed
        });
    }

    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('ticketModal');
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

function loadTickets() {
    showLoading();
    setTimeout(() => {
        renderTickets(mockTickets);
        hideLoading();
    }, 500); // Simulate network delay

    if (!isLoggedIn()) {
        showLoginModal('Vui lòng đăng nhập để xem lịch sử đặt vé của bạn');
    }
}

function isLoggedIn() {
    return true; // Assume logged in for now
}

function showLoginModal(message) {
    console.log('Show Login Modal:', message);
    alert(message); // Placeholder alert
}

function showLoading() {
    document.querySelector('.loading-state').style.display = 'block';
    document.querySelector('.no-tickets').style.display = 'none';
    document.querySelector('.ticket-grid').innerHTML = '';
}

function hideLoading() {
    document.querySelector('.loading-state').style.display = 'none';
}

function renderTickets(tickets) {
    const grid = document.getElementById('ticketGrid');
    grid.innerHTML = '';
    if (tickets.length === 0) {
        document.querySelector('.no-tickets').style.display = 'block';
        document.querySelector('.ticket-grid').style.display = 'none';
        return;
    } else {
        document.querySelector('.no-tickets').style.display = 'none';
        document.querySelector('.ticket-grid').style.display = 'grid';
    }

    tickets.forEach(ticket => {
        const statusClass = ticket.Status.toLowerCase(); // "on", "finish" ...
        const statusLabel = statusClass === 'finish' ? 'Đã xem' : 'Sắp tới';

        const card = document.createElement('div');
        card.className = `ticket-card ${statusClass}`;
        card.dataset.ticketId = ticket.Id;
        card.innerHTML = `
      <div class="ticket-status">
        <span class="status-badge">${statusLabel}</span>
      </div>
      <div class="ticket-poster">
        <img src="${ticket.Poster}" alt="${ticket.Title}">
      </div>
      <div class="ticket-info">
        <div class="ticket-header">
          <span class="ticket-title">${ticket.Title}</span>
          <span class="ticket-code">#${ticket.Id}</span>
        </div>
        <div class="ticket-detail">
          <div>Ngày đặt vé: ${ticket.BookingDate}</div>
          <div>Suất chiếu: ${ticket.Showtime}</div>
          <div>Phòng chiếu: ${ticket.CinemaRoom}</div>
          <div>Ghế: ${ticket.Seat}</div>
          <div class="total-price">Tổng tiền: ${ticket.Price}</div>
        </div>
        <div class="ticket-actions">
          <button class="btn-details" onclick="showTicketDetails('${ticket.Id}')">Chi tiết</button>
        </div>
      </div>
    `;
        grid.appendChild(card);
    });
}

function applyFilter(type) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${type}"]`).classList.add('active');

    const filtered = type === 'all' ? mockTickets : mockTickets.filter(t => t.Status.toLowerCase() === type);

    showLoading();
    setTimeout(() => {
        renderTickets(filtered);
        hideLoading();
    }, 300);
}

function searchTickets(term) {
    const filtered = mockTickets.filter(t => t.Title.toLowerCase().includes(term.toLowerCase()));
    showLoading();
    setTimeout(() => {
        renderTickets(filtered);
        hideLoading();
    }, 300);
}

function showTicketDetails(ticketId) {
    const ticket = mockTickets.find(t => t.Id === ticketId);
    const modal = document.getElementById('ticketModal');
    const body = modal.querySelector('.modal-body');
    const modalTitle = modal.querySelector('.modal-header h2');
    modalTitle.textContent = 'Chi tiết vé';

    if (!ticket) {
        console.error('Ticket not found:', ticketId);
        return;
    }

    body.innerHTML = `
    <div class="ticket-details-modal">
      <div class="modal-section">
        <h4>Thông tin vé</h4>
        <div class="detail-list">
          <div class="detail-item">
            <i class="fas fa-calendar-alt"></i>
            <span class="label">Ngày đặt:</span>
            <span class="value">${ticket.BookingDate}</span>
          </div>
          <div class="detail-item">
            <i class="far fa-clock"></i>
            <span class="label">Suất chiếu:</span>
            <span class="value">${ticket.Showtime}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-couch"></i>
            <span class="label">Phòng chiếu:</span>
            <span class="value">${ticket.CinemaRoom}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-chair"></i>
            <span class="label">Ghế:</span>
            <span class="value">${ticket.Seat}</span>
          </div>
        </div>
      </div>

      <div class="modal-section">
        <h4>Combo thức ăn</h4>
        <ul class="combo-list">
          ${Array.isArray(ticket.Combo)
        ? ticket.Combo.map(item => `<li>số lượng:x${item.Quantity} ${item.Name} (${item.Price} VNĐ)</li>`).join('')
            : `<li>${ticket.Combo}</li>`
        }
        </ul>
      </div>

      <div class="modal-section total-section">
        <h4>Tổng tiền</h4>
        <div class="total-amount">
          <span class="value">${ticket.Price}</span>
        </div>
      </div>
    </div>
  `;

    modal.style.opacity = '0';
    modal.classList.add('active');
    setTimeout(() => { modal.style.opacity = '1'; }, 50);
}

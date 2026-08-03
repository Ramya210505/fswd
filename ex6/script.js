const STORAGE_KEY = 'leavo-requests-v1';
const BALANCE_TOTALS = { Casual: 12, Sick: 10, Earned: 15 };

let requests = load();
let statusFilter = 'all';
let calDate = new Date();

const balanceGrid = document.getElementById('balanceGrid');
const requestsBody = document.getElementById('requestsBody');
const emptyMsg = document.getElementById('emptyMsg');
const calendarGrid = document.getElementById('calendarGrid');
const calMonthLabel = document.getElementById('calMonthLabel');
const toast = document.getElementById('toast');

function uid() { return Math.random().toString(36).slice(2, 10); }
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seed();
  } catch { return seed(); }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(requests)); }

function seed() {
  const y = new Date().getFullYear(), m = new Date().getMonth();
  const pad = (n) => String(n).padStart(2, '0');
  const d = (day) => `${y}-${pad(m + 1)}-${pad(day)}`;
  return [
    { id: uid(), type: 'Casual', from: d(4), to: d(5), reason: 'Family function', status: 'Approved' },
    { id: uid(), type: 'Sick', from: d(12), to: d(12), reason: 'Fever', status: 'Approved' },
    { id: uid(), type: 'Earned', from: d(21), to: d(23), reason: 'Personal travel', status: 'Pending' }
  ];
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000) + 1;
}

function usedDays(type) {
  return requests
    .filter(r => r.type === type && r.status !== 'Rejected')
    .reduce((sum, r) => sum + daysBetween(r.from, r.to), 0);
}

// Balance cards with animated ring charts
function renderBalances() {
  const circumference = 2 * Math.PI * 28; // r=28
  balanceGrid.innerHTML = Object.entries(BALANCE_TOTALS).map(([type, total]) => {
    const used = usedDays(type);
    const remaining = Math.max(total - used, 0);
    const pct = Math.min((used / total) * 100, 100);
    const offset = circumference - (circumference * pct) / 100;
    return `
      <div class="balance-card">
        <div class="balance-ring-wrap">
          <svg class="balance-ring" viewBox="0 0 64 64">
            <circle class="balance-ring-track" cx="32" cy="32" r="28"></circle>
            <circle class="balance-ring-fill" cx="32" cy="32" r="28"
              stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"
              data-final-offset="${offset}"></circle>
          </svg>
          <div class="balance-ring-label">${remaining}</div>
        </div>
        <div>
          <span class="type">${type} leave</span>
          <div class="amount">${remaining}<span> / ${total} left</span></div>
        </div>
      </div>
    `;
  }).join('');

  // Animate rings in after paint
  requestAnimationFrame(() => {
    document.querySelectorAll('.balance-ring-fill').forEach(ring => {
      ring.style.strokeDashoffset = ring.dataset.finalOffset;
    });
  });
}

function renderHolidays() {
  const strip = document.getElementById('holidayStrip');
  const holidays = [
    { date: 'Aug 15', name: 'Independence Day' },
    { date: 'Aug 27', name: 'Ganesh Chaturthi' },
    { date: 'Oct 2', name: 'Gandhi Jayanti' },
    { date: 'Oct 21', name: 'Diwali' }
  ];
  strip.innerHTML = holidays.map(h => `
    <div class="holiday-chip"><span class="h-date">${h.date}</span><span class="h-name">${h.name}</span></div>
  `).join('');
}

// Apply modal
const applyOverlay = document.getElementById('applyOverlay');
document.getElementById('openApply').addEventListener('click', () => applyOverlay.classList.add('is-open'));
document.getElementById('closeApply').addEventListener('click', () => applyOverlay.classList.remove('is-open'));
applyOverlay.addEventListener('click', (e) => { if (e.target === applyOverlay) applyOverlay.classList.remove('is-open'); });

document.getElementById('applyForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const from = document.getElementById('fromDate').value;
  const to = document.getElementById('toDate').value;
  const reason = document.getElementById('reason').value.trim();
  if (!from || !to || !reason) return;
  if (new Date(to) < new Date(from)) { showToast('End date must be after start date'); return; }

  requests.unshift({
    id: uid(),
    type: document.getElementById('leaveType').value,
    from, to, reason,
    status: 'Pending'
  });
  save();
  e.target.reset();
  applyOverlay.classList.remove('is-open');
  renderAll();
  showToast('Leave request submitted');
});

// Status filters
document.getElementById('statusFilters').addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  statusFilter = btn.dataset.status;
  document.querySelectorAll('#statusFilters .chip').forEach(c => c.classList.remove('is-active'));
  btn.classList.add('is-active');
  renderTable();
});

function formatRange(from, to) {
  const opts = { month: 'short', day: 'numeric' };
  const f = new Date(from + 'T00:00:00').toLocaleDateString(undefined, opts);
  const t = new Date(to + 'T00:00:00').toLocaleDateString(undefined, opts);
  return from === to ? f : `${f} – ${t}`;
}

function renderTable() {
  const filtered = statusFilter === 'all' ? requests : requests.filter(r => r.status === statusFilter);
  requestsBody.innerHTML = filtered.map(r => `
    <tr data-id="${r.id}">
      <td>${r.type}</td>
      <td>${formatRange(r.from, r.to)}</td>
      <td>${daysBetween(r.from, r.to)}</td>
      <td>${r.reason}</td>
      <td><span class="status-badge ${r.status}">${r.status}</span></td>
      <td>${r.status === 'Pending' ? `<button class="row-delete" data-id="${r.id}">🗑</button>` : ''}</td>
    </tr>
  `).join('');

  emptyMsg.classList.toggle('is-visible', filtered.length === 0);

  requestsBody.querySelectorAll('.row-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      requests = requests.filter(r => r.id !== btn.dataset.id);
      save();
      renderAll();
      showToast('Request withdrawn');
    });
  });
}

// Simulate approval flow: pending requests randomly resolve after a few seconds (feels "real-time")
function simulateApprovals() {
  const pending = requests.filter(r => r.status === 'Pending');
  if (!pending.length) return;
  const target = pending[Math.floor(Math.random() * pending.length)];
  target.status = Math.random() > 0.25 ? 'Approved' : 'Rejected';
  save();
  renderAll();
  showToast(`${target.type} leave (${formatRange(target.from, target.to)}) was ${target.status.toLowerCase()}`);
}
setInterval(simulateApprovals, 15000);

// Calendar
function renderCalendar() {
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  calMonthLabel.textContent = calDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const pad = (n) => String(n).padStart(2, '0');

  const dowNames = ['S','M','T','W','T','F','S'];
  let html = dowNames.map(d => `<div class="cal-dow">${d}</div>`).join('');
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day is-empty"></div>`;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    const dayReqs = requests.filter(r => dateStr >= r.from && dateStr <= r.to && r.status !== 'Rejected');
    const marker = dayReqs.length
      ? `<span class="dot ${dayReqs.some(r => r.status === 'Approved') ? 'approved' : 'pending'}"></span>`
      : '';
    html += `<div class="cal-day">${day}${marker}</div>`;
  }
  calendarGrid.innerHTML = html;
}
document.getElementById('prevMonth').addEventListener('click', () => { calDate.setMonth(calDate.getMonth() - 1); renderCalendar(); });
document.getElementById('nextMonth').addEventListener('click', () => { calDate.setMonth(calDate.getMonth() + 1); renderCalendar(); });

const notifBtn = document.getElementById('notifBtn');
const notifDropdown = document.getElementById('notifDropdown');
const notifBadge = document.getElementById('notifBadge');
notifBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  notifDropdown.classList.toggle('is-open');
  notifBadge.style.display = 'none';
});
document.addEventListener('click', (e) => {
  if (!notifDropdown.contains(e.target) && e.target !== notifBtn) notifDropdown.classList.remove('is-open');
});

function renderAll() {
  renderBalances();
  renderTable();
  renderCalendar();
  renderHolidays();
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

renderAll();

const STORAGE_KEY = 'orbit-tasks-v1';
let tasks = load();
let dragId = null;
let searchTerm = '';

document.getElementById('searchInput').addEventListener('input', (e) => {
  searchTerm = e.target.value.toLowerCase();
  renderBoard();
});

const toast = document.getElementById('toast');

function uid() { return Math.random().toString(36).slice(2, 10); }
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seed();
  } catch { return seed(); }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }

function seed() {
  const today = new Date();
  const iso = (d) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + d).toISOString().slice(0, 10);
  return [
    { id: uid(), title: 'Design token system for site', priority: 'high', assignee: 'RS', due: iso(-1), status: 'todo' },
    { id: uid(), title: 'Wireframe leave management flow', priority: 'medium', assignee: 'AK', due: iso(3), status: 'todo' },
    { id: uid(), title: 'Build todo list drag-reorder', priority: 'high', assignee: 'RS', due: iso(1), status: 'progress' },
    { id: uid(), title: 'API mock for food delivery cart', priority: 'medium', assignee: 'MP', due: iso(5), status: 'progress' },
    { id: uid(), title: 'Accessibility pass on marketplace', priority: 'low', assignee: 'AK', due: iso(6), status: 'review' },
    { id: uid(), title: 'Portfolio hero copywriting', priority: 'medium', assignee: 'RS', due: iso(-3), status: 'done' },
    { id: uid(), title: 'Set up repo structure', priority: 'low', assignee: 'Unassigned', due: '', status: 'done' }
  ];
}

function isOverdue(task) {
  if (!task.due || task.status === 'done') return false;
  return new Date(task.due) < new Date(new Date().toDateString());
}
function formatDue(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function renderStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(isOverdue).length;
  const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;
  document.getElementById('statsRow').innerHTML = `
    <div class="stat-card"><span>Total tasks</span><strong>${total}</strong></div>
    <div class="stat-card"><span>Completed</span><strong>${done}</strong></div>
    <div class="stat-card"><span>Overdue</span><strong style="color:var(--high)">${overdue}</strong></div>
    <div class="stat-card"><span>High priority open</span><strong>${highPriority}</strong></div>
  `;
}

function renderBoard() {
  const visible = searchTerm ? tasks.filter(t => t.title.toLowerCase().includes(searchTerm)) : tasks;
  const columns = { todo: [], progress: [], review: [], done: [] };
  visible.forEach(t => columns[t.status].push(t));

  const overallPct = tasks.length ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0;
  document.getElementById('overallPct').textContent = `${overallPct}%`;
  document.getElementById('overallFill').style.width = `${overallPct}%`;

  Object.entries(columns).forEach(([status, list]) => {
    const el = document.getElementById(`col-${status}`);
    el.innerHTML = list.map(t => {
      const overdue = isOverdue(t);
      const dueLabel = formatDue(t.due);
      return `
        <div class="task-card priority-${t.priority}" draggable="true" data-id="${t.id}">
          <div class="task-title">${t.title}</div>
          <div class="task-footer">
            <div class="task-footer-row">
              <span class="task-badge ${overdue ? 'due-overdue' : ''}">${dueLabel ? (overdue ? 'Overdue · ' : '') + dueLabel : t.priority}</span>
            </div>
            <div class="task-footer-row">
              <div class="task-avatar" title="${t.assignee}">${t.assignee === 'Unassigned' ? '—' : t.assignee}${t.assignee !== 'Unassigned' ? '<span class="status-dot"></span>' : ''}</div>
              <button class="task-delete" data-id="${t.id}">✕</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    document.getElementById(`count${status.charAt(0).toUpperCase() + status.slice(1)}`).textContent = list.length;
  });

  document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('dragstart', () => { dragId = card.dataset.id; card.classList.add('dragging'); });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
  });
  document.querySelectorAll('.task-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== btn.dataset.id);
      save();
      renderAll();
      showToast('Task deleted');
    });
  });

  renderStats();
}

document.querySelectorAll('.column-body').forEach(col => {
  col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('drag-over'); });
  col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
  col.addEventListener('drop', () => {
    col.classList.remove('drag-over');
    if (!dragId) return;
    const status = col.closest('.column').dataset.status;
    const task = tasks.find(t => t.id === dragId);
    if (task) {
      const wasNotDone = task.status !== 'done';
      task.status = status;
      save();
      renderAll();
      if (status === 'done' && wasNotDone) {
        showToast(`"${task.title}" marked done 🎉`);
        launchConfetti();
      }
    }
    dragId = null;
  });
});

// Add task modal
const addOverlay = document.getElementById('addOverlay');
document.getElementById('openAdd').addEventListener('click', () => addOverlay.classList.add('is-open'));
document.getElementById('closeAdd').addEventListener('click', () => addOverlay.classList.remove('is-open'));
addOverlay.addEventListener('click', (e) => { if (e.target === addOverlay) addOverlay.classList.remove('is-open'); });

document.getElementById('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value.trim();
  if (!title) return;
  tasks.push({
    id: uid(),
    title,
    priority: document.getElementById('taskPriority').value,
    assignee: document.getElementById('taskAssignee').value,
    due: document.getElementById('taskDue').value,
    status: document.getElementById('taskStatus').value
  });
  save();
  e.target.reset();
  addOverlay.classList.remove('is-open');
  renderAll();
  showToast('Task added');
});

function renderAll() { renderBoard(); }

// Confetti burst for completed tasks
const confettiCanvas = document.getElementById('confettiCanvas');
const cctx = confettiCanvas.getContext('2d');
function resizeConfetti() { confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; }
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

function launchConfetti() {
  const colors = ['#7C6FF0', '#45C4B0', '#4D8DFF', '#3ECF8E'];
  const particles = Array.from({ length: 60 }, () => ({
    x: confettiCanvas.width / 2, y: confettiCanvas.height / 3,
    vx: (Math.random() - 0.5) * 10, vy: Math.random() * -9 - 3,
    size: Math.random() * 5 + 3, color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360, life: 0
  }));
  function frame() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;
    particles.forEach(p => {
      p.vy += 0.32; p.x += p.vx; p.y += p.vy; p.life++;
      if (p.life < 110) {
        alive = true;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate((p.rotation + p.life * 4) * Math.PI / 180);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        cctx.restore();
      }
    });
    if (alive) requestAnimationFrame(frame);
    else cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
  requestAnimationFrame(frame);
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

renderAll();

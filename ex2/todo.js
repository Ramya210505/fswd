// =========================================================
// State
// =========================================================
const STORAGE_KEY = 'flow-todo-tasks-v1';
const THEME_KEY = 'flow-todo-theme';

let tasks = load();
let state = {
  status: 'all',       // all | active | completed | overdue
  category: 'all',
  sort: 'manual',
  search: ''
};
let dragId = null;

// =========================================================
// Elements
// =========================================================
const taskList = document.getElementById('taskList');
const addForm = document.getElementById('addForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const categorySelect = document.getElementById('categorySelect');
const dueInput = document.getElementById('dueInput');
const emptyState = document.getElementById('emptyState');
const emptyText = document.getElementById('emptyText');
const listFooter = document.getElementById('listFooter');
const remainingText = document.getElementById('remainingText');
const clearCompletedBtn = document.getElementById('clearCompleted');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const toast = document.getElementById('toast');
const ringFill = document.getElementById('ringFill');
const ringPercent = document.getElementById('ringPercent');

// =========================================================
// Persistence
// =========================================================
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedTasks();
  } catch {
    return seedTasks();
  }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
function seedTasks() {
  const today = new Date().toISOString().slice(0, 10);
  return [
    { id: uid(), title: 'Plan tomorrow\u2019s tasks', priority: 'medium', category: 'personal', due: today, completed: false, order: 0 },
    { id: uid(), title: 'Push portfolio to GitHub', priority: 'high', category: 'work', due: today, completed: false, order: 1 },
    { id: uid(), title: 'Review UI/UX prototypes', priority: 'low', category: 'study', due: '', completed: true, order: 2 }
  ];
}
function uid() { return Math.random().toString(36).slice(2, 10); }

// =========================================================
// Theme
// =========================================================
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  themeIcon.textContent = saved === 'dark' ? '☀' : '☾';
}
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  themeIcon.textContent = next === 'dark' ? '☀' : '☾';
  localStorage.setItem(THEME_KEY, next);
});

// =========================================================
// Add task
// =========================================================
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  tasks.push({
    id: uid(),
    title,
    priority: prioritySelect.value,
    category: categorySelect.value,
    due: dueInput.value,
    completed: false,
    order: tasks.length
  });

  taskInput.value = '';
  dueInput.value = '';
  save();
  render();
  showToast('Task added');
});

// =========================================================
// Filters
// =========================================================
document.getElementById('statusFilters').addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  state.status = btn.dataset.filter;
  document.querySelectorAll('#statusFilters .chip').forEach(c => c.classList.remove('is-active'));
  btn.classList.add('is-active');
  render();
});

document.getElementById('categoryFilters').addEventListener('click', (e) => {
  const btn = e.target.closest('.tag-chip');
  if (!btn) return;
  state.category = btn.dataset.category;
  document.querySelectorAll('#categoryFilters .tag-chip').forEach(c => c.classList.remove('is-active'));
  btn.classList.add('is-active');
  render();
});

searchInput.addEventListener('input', (e) => {
  state.search = e.target.value.toLowerCase();
  render();
});

sortSelect.addEventListener('change', (e) => {
  state.sort = e.target.value;
  render();
});

clearCompletedBtn.addEventListener('click', () => {
  const removed = tasks.filter(t => t.completed);
  if (!removed.length) return;
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
  showToast(`Cleared ${removed.length} completed task${removed.length > 1 ? 's' : ''}`);
});

// =========================================================
// Helpers
// =========================================================
function isOverdue(task) {
  if (!task.due || task.completed) return false;
  const due = new Date(task.due + 'T23:59:59');
  return due < new Date();
}

function getFiltered() {
  let list = [...tasks];

  if (state.status === 'active') list = list.filter(t => !t.completed);
  if (state.status === 'completed') list = list.filter(t => t.completed);
  if (state.status === 'overdue') list = list.filter(isOverdue);

  if (state.category !== 'all') list = list.filter(t => t.category === state.category);

  if (state.search) list = list.filter(t => t.title.toLowerCase().includes(state.search));

  const priorityRank = { high: 0, medium: 1, low: 2 };
  if (state.sort === 'priority') list.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  else if (state.sort === 'due') list.sort((a, b) => (a.due || '9999') > (b.due || '9999') ? 1 : -1);
  else if (state.sort === 'alpha') list.sort((a, b) => a.title.localeCompare(b.title));
  else list.sort((a, b) => a.order - b.order);

  return list;
}

function formatDue(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// =========================================================
// Render
// =========================================================
function render() {
  const filtered = getFiltered();
  taskList.innerHTML = '';

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task priority-${task.priority}${task.completed ? ' completed' : ''}`;
    li.draggable = state.sort === 'manual';
    li.dataset.id = task.id;

    const overdue = isOverdue(task);
    const dueLabel = formatDue(task.due);

    li.innerHTML = `
      <button class="task-check" aria-label="Toggle complete">${task.completed ? '✓' : ''}</button>
      <div class="task-content">
        <div class="task-title"></div>
        <div class="task-meta">
          <span class="meta-chip">${task.category}</span>
          <span class="meta-chip">${task.priority}</span>
          ${dueLabel ? `<span class="meta-chip ${overdue ? 'due-overdue' : ''}">${overdue ? 'Overdue · ' : ''}${dueLabel}</span>` : ''}
        </div>
      </div>
      <div class="task-actions">
        <button class="delete-btn" aria-label="Delete task">✕</button>
      </div>
    `;
    li.querySelector('.task-title').textContent = task.title;
    taskList.appendChild(li);

    // Drag events
    li.addEventListener('dragstart', () => { dragId = task.id; li.classList.add('dragging'); });
    li.addEventListener('dragend', () => { li.classList.remove('dragging'); });
    li.addEventListener('dragover', (e) => e.preventDefault());
    li.addEventListener('drop', () => handleDrop(task.id));

    // Actions
    li.querySelector('.task-check').addEventListener('click', () => toggleTask(task.id));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id, li));
  });

  emptyState.classList.toggle('is-visible', filtered.length === 0);
  emptyText.textContent = state.search
    ? `No tasks match “${state.search}”.`
    : state.status === 'completed'
      ? 'No completed tasks yet.'
      : 'Add your first task above to get started.';

  updateStats();
}

function handleDrop(targetId) {
  if (!dragId || dragId === targetId) return;
  const from = tasks.findIndex(t => t.id === dragId);
  const to = tasks.findIndex(t => t.id === targetId);
  const [moved] = tasks.splice(from, 1);
  tasks.splice(to, 0, moved);
  tasks.forEach((t, i) => t.order = i);
  save();
  render();
  dragId = null;
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  save();
  render();
  if (task.completed) {
    showToast('Nice work \u2014 marked complete');
    if (tasks.every(t => t.completed)) launchConfetti();
  }
}

function deleteTask(id, li) {
  li.classList.add('removing');
  setTimeout(() => {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }, 280);
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const active = total - done;
  const overdue = tasks.filter(isOverdue).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statActive').textContent = active;
  document.getElementById('statDone').textContent = done;
  document.getElementById('statOverdue').textContent = overdue;

  const circumference = 326.7;
  ringFill.style.strokeDashoffset = circumference - (circumference * percent) / 100;
  ringPercent.textContent = `${percent}%`;

  remainingText.textContent = `${active} task${active !== 1 ? 's' : ''} left`;
  listFooter.style.display = total ? 'flex' : 'none';
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

// =========================================================
// Confetti (lightweight canvas burst — celebrates "all done")
// =========================================================
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti() {
  const colors = ['#7C6FF0', '#FF8FB1', '#4ECDC4', '#FFB84D'];
  const particles = Array.from({ length: 80 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 3,
    vx: (Math.random() - 0.5) * 12,
    vy: Math.random() * -10 - 4,
    size: Math.random() * 6 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    life: 0
  }));

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.vy += 0.35;
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (p.life < 120) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation + p.life * 4) * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });
    if (alive) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(frame);
}

// =========================================================
// Init
// =========================================================
initTheme();
render();

const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.innerHTML = `
      <span class="task-status pending">Pending</span>
      ${taskText}
      <div>
        <button class="status-btn" onclick="changeStatus(this, 'in-progress')">In Progress</button>
        <button class="status-btn" onclick="changeStatus(this, 'completed')">Completed</button>
        <button class="status-btn" onclick="deleteTask(this)">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
    taskInput.value = '';
  }
}

function changeStatus(button, newStatus) {
  const li = button.closest('.task-item');
  const statusSpan = li.querySelector('.task-status');
  statusSpan.textContent = newStatus;
  statusSpan.classList.remove('pending', 'in-progress', 'completed');
  statusSpan.classList.add(newStatus);
}

function deleteTask(button) {
  const li = button.closest('.task-item');
  li.remove();
}

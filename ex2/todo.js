
// State Management via LocalStorage
let tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [
    { id: '1', title: 'Design landing page mockup', category: 'Design', priority: 'High', status: 'todo' }
];

function renderBoard() {
    ['todo', 'inprogress', 'done'].forEach(status => {
        const list = document.getElementById(`list-${status}`);
        list.innerHTML = '';
        const filteredTasks = tasks.filter(t => t.status === status);
        
        filteredTasks.forEach(task => {
            const div = document.createElement('div');
            div.className = 'task-card'; div.draggable = true; div.dataset.id = task.id;
            div.innerHTML = `<div class="task-title">${task.title}</div>`;
            list.appendChild(div);
        });
        document.getElementById(`count-${status}`).innerText = filteredTasks.length;
    });
    setupDragAndDrop();
}

function setupDragAndDrop() {
    const cards = document.querySelectorAll('.task-card');
    const lists = document.querySelectorAll('.task-list');

    cards.forEach(card => {
        card.addEventListener('dragstart', () => card.classList.add('dragging'));
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });

    lists.forEach(list => {
        list.addEventListener('dragover', e => {
            e.preventDefault(); list.classList.add('drag-over');
            const draggingCard = document.querySelector('.dragging');
            if (draggingCard) list.appendChild(draggingCard);
        });
        list.addEventListener('drop', e => {
            list.classList.remove('drag-over');
            const draggingCard = document.querySelector('.dragging');
            if (draggingCard) {
                const taskId = draggingCard.dataset.id;
                const newStatus = list.parentElement.dataset.status;
                const taskIndex = tasks.findIndex(t => t.id === taskId);
                if (taskIndex > -1) {
                    tasks[taskIndex].status = newStatus;
                    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
                    renderBoard(); 
                }
            }
        });
    });
}
renderBoard();

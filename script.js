class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.STORAGE_KEY = 'todos';
        
        this.todoInput = document.getElementById('todoInput');
        this.todoDescription = document.getElementById('todoDescription');
        this.todoStatus = document.getElementById('todoStatus');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.clearBtn = document.getElementById('clearBtn');
        this.taskCount = document.getElementById('taskCount');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.statusTabs = document.querySelectorAll('.status-tab');
        this.statusFilter = 'all';
        this.modal = document.getElementById('descriptionModal');
        this.closeBtn = document.querySelector('.close');
        // edit modal elements
        this.editModal = document.getElementById('editModal');
        this.editCloseBtn = document.querySelector('.edit-close');
        this.editTodoText = document.getElementById('editTodoText');
        this.editTodoDescription = document.getElementById('editTodoDescription');
        this.editTodoStatus = document.getElementById('editTodoStatus');
        this.saveEditBtn = document.getElementById('saveEditBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');
        this.editingId = null;
        // add modal elements
        this.openAddBtn = document.getElementById('openAddBtn');
        this.addModal = document.getElementById('addModal');
        this.addCloseBtn = document.querySelector('.add-close');
        this.addTodoText = document.getElementById('addTodoText');
        this.addTodoDescription = document.getElementById('addTodoDescription');
        this.addTodoStatus = document.getElementById('addTodoStatus');
        this.saveAddBtn = document.getElementById('saveAddBtn');
        this.cancelAddBtn = document.getElementById('cancelAddBtn');
        // subtask elements
        this.subtaskInput = document.getElementById('subtaskInput');
        this.addSubtaskBtn = document.getElementById('addSubtaskBtn');
        this.subtasksList = document.getElementById('subtasksList');
        this.currentEditingId = null;

        this.init();
    }

    init() {
        this.loadTodos();
        this.attachEventListeners();
        this.render();
    }

    attachEventListeners() {
        if (this.addBtn) this.addBtn.addEventListener('click', () => this.addTodo());
        if (this.todoInput) this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        this.clearBtn.addEventListener('click', () => this.clearCompleted());

        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
            if (e.target === this.editModal) this.closeEditModal();
        });

        // edit modal listeners
        if (this.editCloseBtn) this.editCloseBtn.addEventListener('click', () => this.closeEditModal());
        if (this.cancelEditBtn) this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        if (this.saveEditBtn) this.saveEditBtn.addEventListener('click', () => this.saveEdit());
        // allow Enter to save in edit modal when focused on text
        if (this.editTodoText) this.editTodoText.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.saveEdit(); });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        // status tab listeners
        this.statusTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.statusTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.statusFilter = e.target.dataset.status;
                this.render();
            });
        });

        // add modal listeners
        if (this.openAddBtn) this.openAddBtn.addEventListener('click', () => this.openAddModal());
        if (this.addCloseBtn) this.addCloseBtn.addEventListener('click', () => this.closeAddModal());
        if (this.cancelAddBtn) this.cancelAddBtn.addEventListener('click', () => this.closeAddModal());
        if (this.saveAddBtn) this.saveAddBtn.addEventListener('click', () => this.addTodoFromModal());

        // subtask listeners
        if (this.addSubtaskBtn) this.addSubtaskBtn.addEventListener('click', () => this.addSubtask());
        if (this.subtaskInput) this.subtaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addSubtask();
        });

        // close menus when clicking outside
        document.addEventListener('click', () => this.closeAllMenus());

        // allow dropping to the end of the list by dropping on the container
        if (this.todoList) {
            this.todoList.addEventListener('dragover', (e) => e.preventDefault());
            this.todoList.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
                if (!isNaN(draggedId)) this.reorderToEnd(draggedId);
            });
        }

        // close add/edit/additional modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.addModal) this.closeAddModal();
        });
    }

    closeAllMenus() {
        const open = document.querySelectorAll('.dropdown');
        open.forEach(d => d.classList.add('hidden'));
        const sub = document.querySelectorAll('.submenu');
        sub.forEach(s => s.classList.add('hidden'));
    }

    // Reorder helpers for drag and drop
    reorder(draggedId, targetId) {
        const from = this.todos.findIndex(t => t.id === draggedId);
        const to = this.todos.findIndex(t => t.id === targetId);
        if (from === -1 || to === -1) return;
        const [item] = this.todos.splice(from, 1);
        // insert before target index (if moving down, target index already shifted)
        const insertIndex = (from < to) ? to : to;
        this.todos.splice(insertIndex, 0, item);
        this.saveTodos();
        this.render();
    }

    reorderToEnd(draggedId) {
        const from = this.todos.findIndex(t => t.id === draggedId);
        if (from === -1) return;
        const [item] = this.todos.splice(from, 1);
        this.todos.push(item);
        this.saveTodos();
        this.render();
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        const description = this.todoDescription.value.trim();
        const status = (this.todoStatus && this.todoStatus.value) ? this.todoStatus.value : 'new';
        
        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: text,
            description: description,
            status: status,
            completed: false,
            subtasks: [],
            createdAt: new Date().toLocaleString()
        };

        this.todos.push(newTodo);
        this.saveTodos();
        this.todoInput.value = '';
        this.todoDescription.value = '';
        if (this.todoStatus) this.todoStatus.value = 'new';
        this.todoInput.focus();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    clearCompleted() {
        if (this.todos.some(t => t.completed)) {
            if (confirm('Are you sure you want to delete all completed tasks?')) {
                this.todos = this.todos.filter(todo => !todo.completed);
                this.saveTodos();
                this.render();
            }
        }
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                // apply status filter on top of default/all
                if (!this.statusFilter || this.statusFilter === 'all') return this.todos;
                return this.todos.filter(t => (t.status || 'new') === this.statusFilter);
        }
    }

    render() {
        const filtered = this.getFilteredTodos();
        this.todoList.innerHTML = '';

        if (filtered.length === 0) {
            this.todoList.innerHTML = '<li style="text-align: center; padding: 20px; color: #999;">No tasks yet!</li>';
        } else {
            filtered.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                const descriptionPreview = todo.description ? todo.description.substring(0, 30) + (todo.description.length > 30 ? '...' : '') : '';
               const statusSafe = todo.status ? todo.status : 'new';
               const statusClass = `status-${statusSafe.replace(/\s+/g, '-')}`;
               const subtaskCount = todo.subtasks ? todo.subtasks.length : 0;
               const completedSubtasks = todo.subtasks ? todo.subtasks.filter(s => s.completed).length : 0;
               li.innerHTML = `
                       <div class="left">
                           <span class="drag-handle" title="Drag to reorder">≡</span>
                           <input 
                               type="checkbox" 
                               class="todo-checkbox" 
                               ${todo.completed ? 'checked' : ''}
                               data-id="${todo.id}"
                           >
                           <div class="todo-content">
                               <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                               ${subtaskCount > 0 ? `<span class="subtask-badge">${completedSubtasks}/${subtaskCount}</span>` : ''}
                               ${ todo.description  ? `<span class="todo-desc-preview">${this.escapeHtml( todo.description )}</span>` : ''}
                           </div>
                       </div>
                       <div class="right">
                           <span class="status-badge ${statusClass}">${this.escapeHtml(statusSafe)}</span>
                           <div class="action-menu" data-id="${todo.id}">
                               <button class="kebab" aria-label="Actions" data-id="${todo.id}">⋮</button>
                               <div class="dropdown hidden" data-id="${todo.id}">
                                   ${todo.description ? `<button class="dropdown-item view" data-id="${todo.id}">View description</button>` : ''}
                                   <button class="dropdown-item edit" data-id="${todo.id}">Edit task</button>
                                   <div class="dropdown-submenu">
                                       <div class="dropdown-item submenu-toggle">Change status ▾</div>
                                       <div class="submenu hidden">
                                           <button class="dropdown-item status-opt" data-id="${todo.id}" data-status="new">new</button>
                                           <button class="dropdown-item status-opt" data-id="${todo.id}" data-status="todo">todo</button>
                                           <button class="dropdown-item status-opt" data-id="${todo.id}" data-status="analiz">analiz</button>
                                           <button class="dropdown-item status-opt" data-id="${todo.id}" data-status="in dev">in dev</button>
                                           <button class="dropdown-item status-opt" data-id="${todo.id}" data-status="test">test</button>
                                           <button class="dropdown-item status-opt" data-id="${todo.id}" data-status="done">done</button>
                                       </div>
                                   </div>
                                   <button class="dropdown-item delete" data-id="${todo.id}">Delete</button>
                               </div>
                           </div>
                       </div>
                   `;

                // make the handle draggable to start drag reliably
                const handle = li.querySelector('.drag-handle');
                if (handle) {
                    handle.setAttribute('draggable', 'true');
                    handle.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', String(todo.id));
                        li.classList.add('dragging');
                    });
                    handle.addEventListener('dragend', (e) => {
                        li.classList.remove('dragging');
                        this.closeAllMenus();
                    });
                }

                // list item drop/over handlers (target of drops)
                li.addEventListener('dragover', (e) => { e.preventDefault(); li.classList.add('drag-over'); });
                li.addEventListener('dragleave', (e) => { li.classList.remove('drag-over'); });
                li.addEventListener('drop', (e) => {
                    e.preventDefault();
                    li.classList.remove('drag-over');
                    const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
                    const targetId = todo.id;
                    if (!isNaN(draggedId) && draggedId !== targetId) {
                        this.reorder(draggedId, targetId);
                    }
                });

                // checkbox
                li.querySelector('.todo-checkbox').addEventListener('change', (e) => {
                    this.toggleTodo(parseInt(e.target.dataset.id));
                });

                // dropdown menu wiring
                const kebab = li.querySelector('.kebab');
                const dropdown = li.querySelector('.dropdown');
                if (kebab && dropdown) {
                    kebab.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.closeAllMenus();
                        dropdown.classList.toggle('hidden');
                    });

                    // view
                    const vbtn = dropdown.querySelector('.dropdown-item.view');
                    if (vbtn) vbtn.addEventListener('click', (e) => { this.showDescription(parseInt(e.target.dataset.id)); this.closeAllMenus(); });

                    // edit
                    const eb = dropdown.querySelector('.dropdown-item.edit');
                    if (eb) eb.addEventListener('click', (e) => { this.openEditModal(parseInt(e.target.dataset.id)); this.closeAllMenus(); });

                    // delete
                    const db = dropdown.querySelector('.dropdown-item.delete');
                    if (db) db.addEventListener('click', (e) => { if (confirm('Delete this task?')) { this.deleteTodo(parseInt(e.target.dataset.id)); } this.closeAllMenus(); });

                    // submenu toggle
                    const submenuToggle = dropdown.querySelector('.submenu-toggle');
                    const submenu = dropdown.querySelector('.submenu');
                    if (submenuToggle && submenu) {
                        submenuToggle.addEventListener('click', (e) => { e.stopPropagation(); submenu.classList.toggle('hidden'); });
                        // status options
                        const opts = submenu.querySelectorAll('.status-opt');
                        opts.forEach(opt => opt.addEventListener('click', (e) => { this.changeStatus(parseInt(e.target.dataset.id), e.target.dataset.status); this.closeAllMenus(); }));
                    }
                }
                this.todoList.appendChild(li);
            });
        }

        // ensure status-tab active class is correct if tabs exist (in case render called from other places)
        if (this.statusTabs && this.statusTabs.length) {
            this.statusTabs.forEach(t => t.classList.toggle('active', t.dataset.status === this.statusFilter));
        }

        this.updateStats();
    }

    updateStats() {
        const activeTodos = this.todos.filter(t => !t.completed).length;
        const completedTodos = this.todos.filter(t => t.completed).length;
        
        this.taskCount.textContent = `${activeTodos} active, ${completedTodos} completed`;
        this.clearBtn.disabled = completedTodos === 0;
    }

    saveTodos() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
    }

    loadTodos() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        this.todos = saved ? JSON.parse(saved) : [];
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    showDescription(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo && todo.description) {
            document.getElementById('modalTitle').textContent = todo.text;
            document.getElementById('modalDescription').textContent = todo.description;
            this.modal.style.display = 'block';
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    /* Edit modal methods */
    openEditModal(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;
        this.editingId = id;
        this.currentEditingId = id;
        this.editTodoText.value = todo.text;
        this.editTodoDescription.value = todo.description || '';
        if (this.editTodoStatus) this.editTodoStatus.value = todo.status || 'new';
        this.editModal.style.display = 'block';
        this.renderSubtasksList();
        this.editTodoText.focus();
    }

    closeEditModal() {
        if (this.editModal) this.editModal.style.display = 'none';
        this.editingId = null;
    }

    /* Add modal methods */
    openAddModal() {
        if (!this.addModal) return;
        this.addModal.style.display = 'block';
        if (this.addTodoText) this.addTodoText.focus();
    }

    closeAddModal() {
        if (!this.addModal) return;
        this.addModal.style.display = 'none';
        if (this.addTodoText) this.addTodoText.value = '';
        if (this.addTodoDescription) this.addTodoDescription.value = '';
        if (this.addTodoStatus) this.addTodoStatus.value = 'new';
    }

    addTodoFromModal() {
        const text = this.addTodoText ? this.addTodoText.value.trim() : '';
        const description = this.addTodoDescription ? this.addTodoDescription.value.trim() : '';
        const status = this.addTodoStatus ? this.addTodoStatus.value : 'new';
        if (!text) { alert('Please enter a task'); return; }
        const newTodo = {
            id: Date.now(),
            text: text,
            description: description,
            status: status,
            completed: false,
            subtasks: [],
            createdAt: new Date().toLocaleString()
        };
        this.todos.push(newTodo);
        this.saveTodos();
        this.closeAddModal();
        this.render();
    }

    saveEdit() {
        if (this.editingId == null) return;
        const text = this.editTodoText.value.trim();
        const description = this.editTodoDescription.value.trim();
        const status = (this.editTodoStatus && this.editTodoStatus.value) ? this.editTodoStatus.value : 'new';
        if (text === '') {
            alert('Task cannot be empty');
            return;
        }
        const todo = this.todos.find(t => t.id === this.editingId);
        if (!todo) return;
        todo.text = text;
        todo.description = description;
        todo.status = status;
        this.saveTodos();
        this.closeEditModal();
        this.render();
    }

    changeStatus(id, newStatus) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;
        todo.status = newStatus;
        this.saveTodos();
        this.render();
    }

    /* Subtask methods */
    addSubtask() {
        if (!this.currentEditingId || !this.subtaskInput) return;
        const text = this.subtaskInput.value.trim();
        if (!text) {
            alert('Please enter a subtask');
            return;
        }
        const todo = this.todos.find(t => t.id === this.currentEditingId);
        if (!todo) return;
        if (!todo.subtasks) todo.subtasks = [];
        const newSubtask = {
            id: Date.now(),
            text: text,
            completed: false
        };
        todo.subtasks.push(newSubtask);
        this.subtaskInput.value = '';
        this.saveTodos();
        this.renderSubtasksList();
    }

    renderSubtasksList() {
        if (!this.subtasksList) return;
        const todo = this.todos.find(t => t.id === this.currentEditingId);
        if (!todo || !todo.subtasks) {
            this.subtasksList.innerHTML = '';
            return;
        }
        this.subtasksList.innerHTML = '';
        todo.subtasks.forEach(subtask => {
            const li = document.createElement('li');
            li.className = 'subtask-item';
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="subtask-checkbox" 
                    data-id="${subtask.id}"
                    ${subtask.completed ? 'checked' : ''}
                >
                <span class="subtask-text ${subtask.completed ? 'completed' : ''}">${this.escapeHtml(subtask.text)}</span>
                <button class="delete-subtask" data-id="${subtask.id}" title="Delete">✕</button>
            `;
            const checkbox = li.querySelector('.subtask-checkbox');
            checkbox.addEventListener('change', () => {
                this.toggleSubtask(this.currentEditingId, subtask.id);
            });
            const deleteBtn = li.querySelector('.delete-subtask');
            deleteBtn.addEventListener('click', () => {
                this.deleteSubtask(this.currentEditingId, subtask.id);
            });
            this.subtasksList.appendChild(li);
        });
    }

    toggleSubtask(todoId, subtaskId) {
        const todo = this.todos.find(t => t.id === todoId);
        if (!todo || !todo.subtasks) return;
        const subtask = todo.subtasks.find(s => s.id === subtaskId);
        if (subtask) {
            subtask.completed = !subtask.completed;
            this.saveTodos();
            this.renderSubtasksList();
            this.render();
        }
    }

    deleteSubtask(todoId, subtaskId) {
        const todo = this.todos.find(t => t.id === todoId);
        if (!todo || !todo.subtasks) return;
        todo.subtasks = todo.subtasks.filter(s => s.id !== subtaskId);
        this.saveTodos();
        this.renderSubtasksList();
        this.render();
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

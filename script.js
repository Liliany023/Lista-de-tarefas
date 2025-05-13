document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const filterAll = document.getElementById('filter-all');
    const filterCompleted = document.getElementById('filter-completed');
    const filterPending = document.getElementById('filter-pending');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';
    
    addButton.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTodo();
    });
    
    filterAll.addEventListener('click', () => setFilter('all'));
    filterCompleted.addEventListener('click', () => setFilter('completed'));
    filterPending.addEventListener('click', () => setFilter('pending'));

    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };
            todos.unshift(newTodo);
            saveAndRender();
            todoInput.value = '';
        }
    }
    
    function renderTodos() {
        todoList.innerHTML = '';
        
        const filteredTodos = getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            showEmptyMessage();
            return;
        }
        
        filteredTodos.forEach((todo, index) => {
            const todoItem = createTodoElement(todo);
            
            if (index < filteredTodos.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'divider';
                todoItem.appendChild(divider);
            }
            
            todoList.appendChild(todoItem);
        });
    }
    
    function getFilteredTodos() {
        switch(currentFilter) {
            case 'completed': return todos.filter(todo => todo.completed);
            case 'pending': return todos.filter(todo => !todo.completed);
            default: return [...todos];
        }
    }
    
    function showEmptyMessage() {
        const messages = {
            'all': 'Nenhuma tarefa adicionada',
            'completed': 'Nenhuma tarefa concluída',
            'pending': 'Nenhuma tarefa pendente'
        };
        
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = messages[currentFilter];
        todoList.appendChild(emptyMessage);
    }
    
    function createTodoElement(todo) {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        
        const todoContent = document.createElement('div');
        todoContent.className = 'todo-content';
        
        const switchContainer = document.createElement('label');
        switchContainer.className = 'switch-container';
        
        const switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchInput.className = 'switch';
        switchInput.checked = todo.completed;
        switchInput.addEventListener('change', () => toggleTodo(todo.id));
        
        const slider = document.createElement('span');
        slider.className = 'slider';
        
        switchContainer.appendChild(switchInput);
        switchContainer.appendChild(slider);
        
        const todoText = document.createElement('span');
        todoText.className = `todo-text ${todo.completed ? 'completed-text' : ''}`;
        todoText.textContent = todo.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        
        todoContent.appendChild(switchContainer);
        todoContent.appendChild(todoText);
        todoContent.appendChild(deleteBtn);
        todoItem.appendChild(todoContent);
        
        return todoItem;
    }
    
    function toggleTodo(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveAndRender();
    }
    
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveAndRender();
    }
    
    function setFilter(filter) {
        currentFilter = filter;
        updateActiveFilter();
        renderTodos();
    }
    
    function updateActiveFilter() {
        [filterAll, filterCompleted, filterPending].forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(`filter-${currentFilter}`).classList.add('active');
    }
    
    function saveAndRender() {
        saveToLocalStorage();
        renderTodos();
    }
    
    function saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    updateActiveFilter();
    renderTodos();
});

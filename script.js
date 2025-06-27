document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const inputArea = document.querySelector('.input-area');

    // Sound effect elements
    const addSound = document.getElementById('add-sound');
    const editSound = document.getElementById('edit-sound');
    const deleteSound = document.getElementById('delete-sound');
    const completeSound = document.getElementById('complete-sound');
    const uncheckSound = document.getElementById('uncheck-sound'); // <-- NEW
    const allCompleteSound = document.getElementById('all-complete-sound');
    

    const playSound = (audio) => {
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    };

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const checkAllTasksCompleted = () => {
        const tasks = taskList.querySelectorAll('li');
        if (tasks.length > 0 && Array.from(tasks).every(li => li.querySelector('.checkbox').checked)) {
            playSound(allCompleteSound);
        }
    };

    const addTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();
        if(!taskText) {
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''} />
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        
        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }
        
        checkbox.addEventListener('change', () => {
    const isChecked = checkbox.checked;
    li.classList.toggle('completed', isChecked);
    editBtn.disabled = isChecked; 
    editBtn.style.opacity = isChecked ? '0.5' : '1';
    editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
    saveTaskToLocalStorage();
if (isChecked) {

        const allChecked = Array.from(taskList.querySelectorAll('.checkbox')).every(cb => cb.checked);
        if (allChecked) {
            playSound(allCompleteSound);
        } else {
            playSound(completeSound);
        }
    } else {
        playSound(uncheckSound);
    }
});

// ... previous code ...
const editSound = document.getElementById('edit-sound');
// ... other audio elements and code ...

editBtn.addEventListener('click', () => {
    if(!checkbox.checked) {
        taskInput.value = li.querySelector('span').textContent;
        li.remove();
        toggleEmptyState();
        saveTaskToLocalStorage();
        playSound(editSound); // play edit sound
    }
});
li.querySelector('.delete-btn').addEventListener('click', () => {
    li.remove();
    toggleEmptyState();
    saveTaskToLocalStorage();
    playSound(deleteSound);
    // Do NOT call checkAllTasksCompleted() here
});

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        saveTaskToLocalStorage();
        playSound(addSound); // Play add sound here!
    };

    inputArea.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });

    taskInput.addEventListener('keypress', (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            addTask();
        }
    });

    toggleEmptyState();

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) => addTask(text, completed, false));
        toggleEmptyState();
    };

    loadTasksFromLocalStorage();
});
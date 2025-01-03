import { format } from "date-fns";
import { Task, Checklist } from "./taskSystem";

export class RenderProjectList {
    constructor(listContainer, renderDisplay, projectLibrary,renderHome) {
        this.container = document.querySelector(listContainer);
        this.renderDisplay = renderDisplay;
        this.projectLibrary = projectLibrary;
        this.renderHome = renderHome;
    }

    renderList(project) {
        this.container.innerHTML = '';

        project.forEach((project) => {
            const listElement = createElement('li', 'list-name', project.name);
            const icon = createIcon('blur_on');
            icon.classList.add('project-icon');
            listElement.prepend(icon);

            listElement.addEventListener('click', () => {
                this.handleSelection(project, listElement);
            });

            // Add delete button
            const deleteButton = createElement('button', 'delete-button', null);
            deleteButton.setAttribute('data-action', 'delete');

            const deleteIcon = createElement('i', 'material-icons', 'delete');
            deleteButton.prepend(deleteIcon);

            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent triggering selection when deleting
                this.handleDeleteProject(project);
            });


            listElement.appendChild(deleteButton);
            this.container.appendChild(listElement);
        });
    }

    handleSelection(project, element) {
        this.container.querySelectorAll('.list-name').forEach(item => {
            item.classList.remove('active-project');
        });

        element.classList.add('active-project');

        this.renderDisplay.renderMain(project);
    }

    handleDeleteProject(project) {
        // Delete the project from the library
        this.projectLibrary.deleteProject(project);

        // Re-render the project list
        this.renderList(this.projectLibrary.getProjects());
        this.renderHome.updateStats(this.projectLibrary.getProjects());

        // Clear the main display if the deleted project is active
        if (this.renderDisplay.currentProject && this.renderDisplay.currentProject.name === project.name) {
            this.renderDisplay.clearDisplay();
        }
    }
}

export class RenderDisplay {
    constructor(displayContainer) {
        this.container = document.querySelector(displayContainer);
        this.currentProject = null;
    }

    renderMain(project) {
        this.container.innerHTML = '';

        this.currentProject = project;

        const infoDiv = this.createMainHeader(project);
        const taskGrid = createElement('div', 'task-grid', null);
        const dialog = this.createTaskDialog();

        this.container.appendChild(infoDiv);
        this.container.appendChild(taskGrid);
        this.container.appendChild(dialog);

        project.tasks.forEach((task, index) => {
            const taskCard = this.createTaskCard(task, index);
            taskGrid.appendChild(taskCard);
        })
    }

    createMainHeader(project) {
        const infoDiv = createElement('div', 'project-info', null);
        const projectTitle = createElement('h2', null, `${project.name}`);
        const taskCount = createElement('p', 'task-count', `${project.tasks.length} Task${project.tasks.length !== 1 ? 's' : ''} Remaining`);
        const infoContainer = createElement('div', 'info-container', null);

        const buttonWrapper = this.createButtonWrapper();

        infoContainer.appendChild(projectTitle);
        infoContainer.appendChild(taskCount);
        infoDiv.appendChild(infoContainer);
        infoDiv.appendChild(buttonWrapper);

        return infoDiv;
    }

    createButtonWrapper() {
        const buttonWrapper = createElement('div', 'button-wrapper', null);

        // Add button
        const TaskDialogButton = createElement('button', 'add-task-btn', 'Add Task');
        TaskDialogButton.setAttribute('data-action', 'add Task');

        const addIcon = createElement('i', 'material-icons', 'add_box');
        TaskDialogButton.prepend(addIcon);

        // Add event listener for showing the dialog
        TaskDialogButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent propagation if nested in other elements
            const dialog = document.querySelector('#taskDialog');
            dialog.showModal(); // Open the dialog

        });

        buttonWrapper.appendChild(TaskDialogButton);

        return buttonWrapper;
    }

    createTaskDialog() {
        // Create dialog element
        const dialog = createElement('dialog', 'task-dialog', null);
        dialog.id = 'taskDialog';

        // Create modal content wrapper
        const modalContent = createElement('div', 'modal-content', null);
        dialog.appendChild(modalContent);

        // Create modal header with title and close button
        const modalHeader = createElement('div', 'modal-header', null);
        const dialogTitle = createElement('h2', 'dialog-title', 'Add New Task');
        const closeButton = createElement('span', 'close-btn', null);
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            dialog.close();
        });

        modalHeader.appendChild(dialogTitle);
        modalHeader.appendChild(closeButton);
        modalContent.appendChild(modalHeader);

        // Create and append the task form to the modal content
        const taskForm = this.createTaskForm();
        modalContent.appendChild(taskForm);

        // Append dialog to container
        this.container.appendChild(dialog);

        // Close dialog when clicking outside of it
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });

        return dialog;
    }

    createTaskForm() {
        const form = createElement('form', 'task-form', null);
        form.setAttribute('method', 'dialog');
        form.id = 'taskForm';

        // Add input fields to the form
        const taskTitleInput = this.createInputField('taskTitle', 'Title', 'text', true);
        const taskPrioritySelect = this.createSelectField('taskPriority', ['None', 'High', 'Medium', 'Low'], true);
        const taskDateInput = this.createInputField('taskDate', 'Date', 'date');
        const taskDescriptionTextarea = this.createTextareaField('taskDescription', 'Description');

        // Menu with buttons (Cancel, Add Task)
        const menu = createElement('menu', 'button-menu', null);

        const cancelButton = createElement('button', null, 'Cancel');
        cancelButton.value = 'cancel';
        cancelButton.addEventListener('click', () => {
            taskDialog.close();
        });

        const addButton = createElement('button', null, 'Add Task');
        addButton.type = 'submit'; // Ensure the button submits the form
        addButton.value = 'confirm';
    
        // Handle form submission
        form.addEventListener('submit', (event) => {
            event.preventDefault();
    
            // Gather the task data
            const taskTitle = taskTitleInput.value.trim();
            const taskPriority = taskPrioritySelect.value;
            const taskDate = taskDateInput.value;
            const taskDescription = taskDescriptionTextarea.value.trim();
            const taskTag = this.currentProject.name;
    
            const capitalizedDescription = capitalizeFirstWord(taskDescription);
    
            // Make sure all required fields are filled
            if (!taskTitle) {
                alert("Please add a Title");
                return;
            }
    
            // Create the new task for the current project
            if (form.dataset.mode === 'edit' && form.dataset.taskId) {
                // Update existing task
                const taskToUpdate = this.currentProject.tasks[form.dataset.taskId];
                taskToUpdate.title = taskTitle;
                taskToUpdate.priority = taskPriority;
                taskToUpdate.date = taskDate;
                taskToUpdate.description = capitalizedDescription;
    
                form.dataset.mode = 'add';
            } else {
                // Add a new task
                const newTask = new Task(
                    taskTitle,
                    taskPriority,
                    taskDate,
                    capitalizedDescription,
                    taskTag,
                    [],
                    this.currentProject
                );
            }
    
            // Re-render the tasks for the current project
            this.renderMain(this.currentProject);
    
            // Reset and close the dialog
            taskDialog.close();
        });

        menu.appendChild(cancelButton);
        menu.appendChild(addButton);
    
        // Append fields and buttons to the form
        form.appendChild(taskTitleInput);
        form.appendChild(taskPrioritySelect);
        form.appendChild(taskDateInput);
        form.appendChild(taskDescriptionTextarea);
        form.appendChild(menu);
    
        return form;
    }

    createInputField(id, placeholder, type, required = false) {
        const input = createElement('input', null, null);
        input.type = type;
        input.id = id;
        input.name = id;
        input.placeholder = placeholder;
        input.required = required;
        return input;
    }

    createSelectField(id, options, required = false) {
        const select = createElement('select', null, null);
        select.id = id;
        select.name = id;
        select.required = required;

        options.forEach(optionText => {
            const option = createElement('option', null, optionText);
            option.value = optionText;
            select.appendChild(option);
        });

        return select;
    }

    createTextareaField(id, placeholder) {
        const textarea = createElement('textarea', null, null);
        textarea.id = id;
        textarea.name = id;
        textarea.placeholder = placeholder;
        return textarea;
    }

    createTaskCard(task, taskIndex) {
        const taskCard = createElement('div', 'task-card', null);
        const cardHeader = createElement('div', 'card-header', null);

        // Card header content
        const leftSection = createElement('div', 'left', null);
        const taskTitle = createElement('h3', 'task-title', task.title);

        // Check if the task is overdue
        const dueDateText = task.date
            ? (task.isOverdue() ? 'Past Due!' : format(new Date(task.date), 'MMM dd, yyyy'))
            : 'No Rush';
        const dueDate = createElement('h3', 'due-date', dueDateText);

        if (task.isOverdue()) {
            dueDate.style.color = 'orange';
        }

        leftSection.appendChild(taskTitle);
        cardHeader.appendChild(leftSection);
        cardHeader.appendChild(dueDate)


        taskCard.appendChild(cardHeader);

        // Card description
        const description = createElement('div', 'description', task.description);
        taskCard.appendChild(description);

        // Checklist Section
        const checklistWrapper = createElement('div', 'checklist-wrapper', null);
        const checklistTitle = createElement('h3', 'checklist-title', 'Checklist:');
        const checklistContainer = createElement('div', 'checklist', null);

        checklistWrapper.appendChild(checklistTitle);
        checklistWrapper.appendChild(checklistContainer);

        this.renderChecklist(task, checklistContainer, taskIndex);

        taskCard.appendChild(checklistWrapper);

        const cardFooter = this.createCardFooter(task, taskCard);
        taskCard.appendChild(cardFooter);

        return taskCard;
    }

    createCardFooter(task, taskCard) {
        const footer = createElement('div', 'card-footer', null);
        const buttonContainer = this.createButtonContainer(task, taskCard);
        const priority = createElement('p', 'priority', task.priority);

        if (task.priority === 'High') {
            priority.style.color = 'rgb(255, 165, 0)';
            taskCard.style.borderTop = '12px solid rgba(255, 165, 0, 0.4)';
        }

        if (task.priority === 'Medium') {
            priority.style.color = 'rgb(255, 255, 0)';
            taskCard.style.borderTop = '12px solid rgba(255, 255, 0, 0.4)';
        }

        if (task.priority === 'Low') {
            priority.style.color = 'rgb(0, 212, 0)';
            taskCard.style.borderTop = '12px solid rgba(0, 212, 0, 0.4)';
        }

        if (task.priority === 'None') {
            priority.style.color = 'rgba(255, 255, 255, 0.7)';
            taskCard.style.borderTop = '12px solid transparent'
            priority.style.display = 'none';
        }

        footer.appendChild(buttonContainer);
        footer.prepend(priority);

        return footer;
    }

    createButtonContainer(task, taskCard) {
        const buttonContainer = createElement('div', 'button-container', null);

        // Define the buttons and their icons
        const buttons = [
            { icon: 'format_list_bulleted_add', action: 'add' },
            { icon: 'edit', action: 'edit' },
            { icon: 'delete', action: 'delete' },
            { icon: 'assignment_turned_in', action: 'complete' }
        ];

        // Create buttons and append them to the container
        buttons.forEach(buttonInfo => {
            const button = document.createElement('button');
            button.setAttribute('data-action', buttonInfo.action);

            const icon = createElement('i', 'material-icons', buttonInfo.icon);
            button.appendChild(icon);

            if (buttonInfo.action === 'add') {
                button.addEventListener('click', () => {
                    this.createChecklistForm(task, taskCard.querySelector('.checklist'));
                });
            }

            if (buttonInfo.action === 'delete') {
                button.addEventListener('click', () => {
                    // Delete the task
                    const project = this.currentProject;
                    project.deleteTask(task);

                    // Re-render the task list for the project
                    this.renderMain(project);
                });
            }

            if (buttonInfo.action === 'edit') {
                button.addEventListener('click', () => {
                    this.openEditForm(task);
                });
            }

            if (buttonInfo.action === 'complete') {
                button.addEventListener('click', () => {
                    const allCompleted = task.checklist.every(item => item.completed);

                    if (allCompleted) {
                        task.checklist.forEach(item => {
                            item.completed = false;
                        });
                        icon.textContent = 'assignment_turned_in';
                    } else {
                        task.checklist.forEach(item => {
                            item.completed = true;
                        });
                        icon.textContent = 'assignment_return';

                    }
    
                    const checklistContainer = taskCard.querySelector('.checklist');
                    this.renderChecklist(task, checklistContainer);
                });
            }


            buttonContainer.appendChild(button);
        });

        return buttonContainer;
    }

    createChecklistForm(task, checklistContainer) {
        if (checklistContainer.querySelector('form')) {
            return;
        }

        if (checklistContainer.querySelector('.placeholder')) {
            checklistContainer.innerHTML = '';
        }

        const form = createElement('form', 'checklist-form', null);
        const inputField = this.createInputField('new-item', 'Add an item...', 'text', true);


        const cancelButton = createElement('button', 'cancel-checklist-btn', 'Cancel');
        cancelButton.type = 'button';

        // Append input and buttons to the form
        form.appendChild(inputField);
        form.appendChild(cancelButton);

        checklistContainer.appendChild(form);

        // Add event listeners
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const itemName = capitalizeFirstWord(inputField.value.trim());

            if (itemName) {
                // Add the item to the task checklist
                const newItem = new Checklist(itemName, false, task);
                task.addListItem(newItem);

                // Re-render the checklist
                this.renderChecklist(task, checklistContainer);
            }
        });

        cancelButton.addEventListener('click', () => {
            // Re-render the checklist without the form
            this.renderChecklist(task, checklistContainer);
        });
    }

    renderChecklist(task, checklistContainer, taskIndex) {
        checklistContainer.innerHTML = '';

        if (task.checklist.length === 0) {
            const placeholderText = createElement('p', 'placeholder', 'Nothing to do here... yet');
            placeholderText.style.color = 'var(--txt-secondary)';
            checklistContainer.appendChild(placeholderText);
        }

        task.checklist.forEach((item, index) => {
            const listItem = createElement('div', 'list-item', null)

            const checkboxId = `task-${taskIndex + 1}-item-${index + 1}`;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = checkboxId;
            checkbox.checked = item.completed;

            const label = document.createElement('label');
            label.setAttribute('for', checkboxId);

            const customCheckbox = createElement('span', 'custom-checkbox', null);
            label.appendChild(customCheckbox);

            const labelText = document.createTextNode(item.text);
            label.appendChild(labelText);

            const deleteButton = createElement('button', 'delete-item-btn', null);
            deleteButton.innerHTML = '&times;'
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent triggering the checkbox

                // Remove the item from the checklist
                task.checklist.splice(index, 1);

                // Re-render the checklist
                this.renderChecklist(task, checklistContainer);
            });

            // Update checklist state on change
            checkbox.addEventListener('change', () => {
                    item.completed = checkbox.checked
            })

            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            listItem.appendChild(deleteButton);
            checklistContainer.appendChild(listItem);
        })
    }

    openEditForm(task) {
        const taskTitleInput = document.querySelector('#taskTitle');
        const taskPrioritySelect = document.querySelector('#taskPriority');
        const taskDateInput = document.querySelector('#taskDate');
        const taskDescriptionTextarea = document.querySelector('#taskDescription');
        const form = document.querySelector('#taskForm');
    
        // Pre-populate the form with the task's values
        taskTitleInput.value = task.title;
        taskPrioritySelect.value = task.priority;
        taskDateInput.value = task.date;
        taskDescriptionTextarea.value = task.description;
    
        // Set the form to edit mode
        form.dataset.mode = 'edit';
        form.dataset.taskId = this.currentProject.tasks.indexOf(task);
    
        const submitButton = form.querySelector('button[value="confirm"]');
        submitButton.textContent = 'Update Task';

        const dialogTitle = document.querySelector('.dialog-title');
        dialogTitle.innerHTML = 'Update Task';
    
        const dialog = document.querySelector('#taskDialog');
        dialog.showModal();
    }

    clearDisplay() {
        this.container.innerHTML = '';
    }
}

export function createElement(element, className, innerText) {
    const el = document.createElement(element);
    if (className) el.classList.add(className);
    if (innerText) el.innerText = innerText;
    return el;
}

export function createIcon(iconName) {
    const icon = document.createElement('i');
    icon.classList.add('material-icons');
    icon.innerText = iconName;

    return icon;
}

function capitalizeFirstWord(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
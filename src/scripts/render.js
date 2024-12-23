import { format } from "date-fns";

export class RenderProjectList {
    constructor(listContainer, renderDisplay, projectLibrary) {
        this.container = document.querySelector(listContainer);
        this.renderDisplay = renderDisplay;
        this.projectLibrary = projectLibrary;
    }

    renderList(project) {
        this.container.innerHTML = '';

        project.forEach((project) => {
            const listElement = document.createElement('li');
            listElement.classList.add('list-name');
            listElement.innerHTML = project.name;

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

        // this.storage.save(this.projectLibrary.getProjects());
        // Re-render the project list
        this.renderList(this.projectLibrary.getProjects());

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

        this.container.appendChild(infoDiv);
        this.container.appendChild(taskGrid);

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

        // Define the buttons and their icons
        const buttons = [
            { icon: 'edit', action: 'edit', text: 'Edit Project' },
            { icon: 'delete', action: 'delete', text: 'Delete Project' },
        ];

        // Create buttons and append them to the container
        buttons.forEach(buttonInfo => {
            const button = createElement('button', 'project-button', buttonInfo.text);
            button.setAttribute('data-action', buttonInfo.action); // Optional, for identifying the button's purpose

            const icon = createElement('i', 'material-icons', buttonInfo.icon);
            button.prepend(icon);

            buttonWrapper.appendChild(button);
        });

        return buttonWrapper;
    }

    createTaskCard(task, taskIndex) {
        const taskCard = createElement('div', 'task-card', null);
        const cardHeader = createElement('div', 'card-header', null);

        // Card header content
        const leftSection = createElement('div', 'left', null);
        const taskTitle = createElement('h3', 'task-title', task.title);
        const dueDate = createElement('h3', 'due-date', format(new Date(task.date), 'MMM dd'));

        leftSection.appendChild(taskTitle);
        leftSection.appendChild(dueDate);



        const priority = createElement('p', 'priority', task.priority);

        if (task.priority === 'High') {
            priority.style.color = 'rgb(255, 165, 0)';
            taskCard.style.borderLeft = '10px solid rgba(255, 165, 0, 0.4)';
        }

        if (task.priority === 'Medium') {
            priority.style.color = 'rgb(255, 255, 0)';
            taskCard.style.borderLeft = '10px solid rgba(255, 255, 0, 0.4)';
        }

        if (task.priority === 'Low') {
            priority.style.color = 'rgb(0, 212, 0)';
            taskCard.style.borderLeft = '10px solid rgba(0, 212, 0, 0.4)';
        }


        cardHeader.appendChild(leftSection);
        cardHeader.appendChild(priority);

        taskCard.appendChild(cardHeader);

        // Card description
        const description = createElement('div', 'description', task.description);
        taskCard.appendChild(description);

        // Checklist Section
        const checklistContainer = createElement('div', 'checklist', null);

        task.checklist.forEach((item, index) => {
            const listItem = createElement('div', 'list-item', null)

            const checkboxId = `task-${taskIndex}-item-${index + 1}`;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = checkboxId;

            const label = document.createElement('label');
            label.setAttribute('for', checkboxId);

            const customCheckbox = createElement('span', 'custom-checkbox', null);
            label.appendChild(customCheckbox);

            const labelText = document.createTextNode(item);
            label.appendChild(labelText);

            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            checklistContainer.appendChild(listItem);
        })

        taskCard.appendChild(checklistContainer);

        const buttonContainer = this.createButtonContainer();
        taskCard.appendChild(buttonContainer);

        return taskCard;
    }

    createButtonContainer() {
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
            button.setAttribute('data-action', buttonInfo.action); // Optional, for identifying the button's purpose

            const icon = createElement('i', 'material-icons', buttonInfo.icon);
            button.appendChild(icon);

            buttonContainer.appendChild(button);
        });

        return buttonContainer;
    }

    clearDisplay() {
        this.container.innerHTML = '';
    }
}

function createElement(element, className, innerText) {
    const el = document.createElement(element);
    if (className) el.classList.add(className);
    if (innerText) el.innerText = innerText;
    return el;
}

function createIcon(iconName) {
    const icon = document.createElement('i');
    icon.classList.add('material-icons');
    icon.innerText = iconName;

    return icon;
}
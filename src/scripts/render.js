import { format } from "date-fns";

export class RenderProjectList {
    constructor(listContainer, renderDisplay) {
        this.container = document.querySelector(listContainer);
        this.renderDisplay = renderDisplay;
    }

    renderList(project) {
        this.container.innerHTML = '';

        project.forEach((project) => {
            const listElement = document.createElement('li');
            listElement.classList.add('list-name');
            listElement.innerHTML = project.name;

            const icon = createIcon('incomplete_circle');
            listElement.prepend(icon);

            listElement.addEventListener('click', () => {
                this.handleSelection(project, listElement);
            });

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
}

export class RenderDisplay {
    constructor(displayContainer) {
        this.container = document.querySelector(displayContainer);
    }

    renderMain(project) {
        this.container.innerHTML = '';

        const infoDiv = this.createMainHeader(project);
        const lineBreak = document.createElement('hr');
        const taskGrid = createElement('div', 'task-grid', null);

        this.container.appendChild(infoDiv);
        this.container.appendChild(lineBreak);
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

        infoDiv.appendChild(projectTitle);
        infoDiv.appendChild(taskCount);

        return infoDiv;
    }

    createTaskCard(task, taskIndex) {
        const taskCard = createElement('div', 'task-card', null);
        const cardHeader = createElement('div', 'card-header', null);

        // Card header content
        const leftSection = createElement('div', 'left', null);
        const taskTitle = createElement('h3', 'task-title', task.title);
        const dueDate = createElement('h3', 'due-date', task.dueDate);

        leftSection.appendChild(taskTitle);
        leftSection.appendChild(dueDate);

        const priority = createElement('p', 'priority', task.priority);
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

        // Add new-item-creator
        // const newItemCreator = createElement('div', 'new-item-creator', null);
        // const form = document.createElement('form');
        // const input = createElement('input', 'new-item', null);
        // input.type = 'text';
        // input.placeholder = 'New item';
        // input.setAttribute('aria-label', 'Name');
        // form.appendChild(input);
        // newItemCreator.appendChild(form);
        // checklistContainer.appendChild(newItemCreator);
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
import { createElement, createIcon } from "./render";
import { format } from 'date-fns';

export class RenderHome {
    constructor(displayContainer, RenderDisplay) {
        this.container = displayContainer;
        this.RenderDisplay = RenderDisplay;
    }

    renderHome(project) {
        this.container.innerHTML = '';

        const overview = this.createOverview(project);
        const title = createElement('h2', 'home-title', this.createTitle(project));
        const taskGrid = this.createTaskGrid(project);

        if (title.innerText === `Nothing to do at the moment. Let's start planning`) {
            title.style.color = 'var(--txt-secondary)';
            title.style.textAlign = 'center';
        }

        this.container.appendChild(overview);
        this.container.appendChild(title);
        this.container.appendChild(taskGrid);
    }

    createTitle(projects) {
        const totalTasks = projects.map(project => project.tasks.length).reduce((sum, count) => sum + count, 0);

        if (totalTasks === 0) {
            return `Nothing to do at the moment. Let's start planning`;
        } else {
            return `All tasks`;
        }
    }

    createOverview(projects) {
        const overviewContainer = createElement('div', 'overview-container', null);
        const overviewTitle = createElement('h2', 'overview-title', 'Overview');
        const statDiv = createElement('div', 'stats', null);

        const projectCount = projects.length;
        const totalTasks = projects.map(project => project.tasks.length).reduce((sum, count) => sum + count, 0);

        const projectInfo = `${projectCount} Project${projectCount !== 1 ? 's' : ''}`;
        const taskInfo = `${totalTasks} Task${totalTasks !== 1 ? 's' : ''}`;

        const projectStat = this.createStat('token', projectInfo);
        const taskStat = this.createStat('assignment', taskInfo);

        statDiv.append(projectStat, taskStat);
        overviewContainer.appendChild(overviewTitle);
        overviewContainer.appendChild(statDiv);

        return overviewContainer;
    }

    createStat(iconName, statName) {
        const container = createElement('div', 'statistic', null);
        const icon = createIcon(iconName);
        icon.classList.add('icon-token');
        const statistic = document.createElement('h3');
        statistic.innerText = statName;

        container.appendChild(icon);
        container.appendChild(statistic);

        return container;
    }

    createTaskGrid(projects) {
        const taskGridContainer = createElement('div', 'task-grid', null);

        // Loop through projects and their tasks
        projects.forEach(project => {
            project.tasks.forEach(task => {
                const taskCard = this.createTaskCard(task);
                taskGridContainer.appendChild(taskCard);
            });
        });

        return taskGridContainer;
    }

    updateStats(projects) {
        const statDiv = document.querySelector('.stats');
        if (!statDiv) return;

        const projectCount = projects.length;
        const totalTasks = projects.map(project => project.tasks.length).reduce((sum, count) => sum + count, 0);

        const projectInfo = `${projectCount} Project${projectCount !== 1 ? 's' : ''}`;
        const taskInfo = `${totalTasks} Task${totalTasks !== 1 ? 's' : ''}`;

        statDiv.innerHTML = ''; // Clear existing stats
        statDiv.append(
            this.createStat('token', projectInfo),
            this.createStat('assignment', taskInfo)
        );
    }

    createTaskCard(task) {
        const taskCard = createElement('div', 'task-card', null);
        const cardHeader = createElement('div', 'card-header', null);
        const priority = createElement('p', 'priority', task.priority);

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

        if (task.priority === 'High') {
            priority.style.color = 'rgb(255, 165, 0)';
            taskCard.style.borderLeft = '12px solid rgba(255, 165, 0, 0.4)';
        }

        if (task.priority === 'Medium') {
            priority.style.color = 'rgb(255, 255, 0)';
            taskCard.style.borderLeft = '12px solid rgba(255, 255, 0, 0.4)';
        }

        if (task.priority === 'Low') {
            priority.style.color = 'rgb(0, 212, 0)';
            taskCard.style.borderLeft = '12px solid rgba(0, 212, 0, 0.4)';
        }

        if (task.priority === 'None') {
            priority.style.color = 'rgba(255, 255, 255, 0.7)';
            taskCard.style.borderLeft = '12px solid transparent'
            priority.style.display = 'none';
        }

        leftSection.appendChild(taskTitle);
        cardHeader.appendChild(leftSection);
        cardHeader.appendChild(dueDate)


        taskCard.appendChild(cardHeader);

        // Card description
        const description = createElement('div', 'description', task.description);
        taskCard.appendChild(description);

        const footer = createElement('div', 'cardHome-footer', null);
        footer.appendChild(priority);
        taskCard.appendChild(footer);

        return taskCard;
    }
}
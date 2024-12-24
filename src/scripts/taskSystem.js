export class ProjectLibrary {
    constructor() {
        this.projects = [];
    }

    addNewProject(project) {
        this.projects.push(project);
    }

    deleteProject(project) {
        const projectIndex = this.projects.indexOf(project);
        this.projects.splice(projectIndex, 1);
    }

    getProjects() {
        return this.projects;
    }
}

export class Project {
    constructor(name) {
        this.name = capitalize(name);
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    deleteTask(task) {
        const taskIndex = this.tasks.indexOf(task);
        this.tasks.splice(taskIndex, 1);
    }
}

export class Task {
    constructor(title, priority, date, description, tag, checklist = [], project, completed = false) {
        this.title = capitalize(title);
        this.priority = priority;
        this.date = date;
        this.description = description;
        this.tag = tag;
        this.checklist = checklist;
        this.completed = completed;
        project.addTask(this);
    }

    isOverdue() {
        const taskDate = new Date(this.date);
        const currentDate = new Date();

        return taskDate < currentDate && !this.completed;
    }

    addListItem(item) {
        this.checklist.push(item);
    }
}

// Method to capitalize the first letter of each word
function capitalize(name) {
    return name
        .trim()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
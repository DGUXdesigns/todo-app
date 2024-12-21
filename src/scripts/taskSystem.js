export class ProjectLibrary {
    constructor() {
        this.projects = [];
    }

    addNewProject(project) {
        this.projects.push(project);
    }

    deleteProject(index) {
        this.projects.splice(index, 1);
    }

    getProjects() {
        return this.projects;
    }
}


export class Project {
    constructor(name, projectLibrary) {
        this.name = this.capitalize(name);
        this.tasks = [];
        projectLibrary.addNewProject(this);
    }

    // Method to capitalize the first letter of each word
    capitalize(name) {
        return name
            .trim()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    addTask(task) {
        this.tasks.push(task);
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
    }
}

export class Task {
    constructor(title, priority, date, description, tag, checklist = [], project, completed = false) {
        this.title = title;
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
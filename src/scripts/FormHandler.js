import { Project, ProjectLibrary } from "./taskSystem";

export class FormHandler {
    constructor(formSelector, inputSelector, formContainerSelector, addButtonSelector, projectLibrary, renderProjectList, storage) {
        this.form = document.querySelector(formSelector);
        this.input = document.querySelector(inputSelector);
        this.formContainer = document.querySelector(formContainerSelector);
        this.addButton = document.querySelector(addButtonSelector);
        this.projectLibrary = projectLibrary;
        this.renderProjectList = renderProjectList;
        this.storage = storage;

        this.addEventListeners();
    }

    addEventListeners() {
        this.addButton.addEventListener('click', () => this.showForm());

        this.form.addEventListener('submit', (event) => this.handleFormSubmit(event));
    }

    showForm() {
        this.formContainer.style.display = 'block';
        this.input.focus();
    }

    hideForm() {
        this.formContainer.style.display = 'none';
    }

    handleFormSubmit(event) {
        event.preventDefault();
    
        const projectName = this.input.value.trim();
        if (!projectName) return;

        if (projectName) {
            // Create a new project and add it to the project library
            const newProject = new Project(projectName, this.projectLibrary);
            this.projectLibrary.addNewProject(newProject);
    
            // Save the updated projects to localStorage
            this.storage.save(this.projectLibrary.getProjects());
    
            // Re-render the project list
            this.renderProjectList.renderList(this.projectLibrary.getProjects());
    
            // Clear the input and hide the form
            this.input.value = '';
            this.hideForm();
        }
    }
}
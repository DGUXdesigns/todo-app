import './style.css';
import { ProjectLibrary, Project, Task } from './scripts/taskSystem';
import { Storage } from './scripts/storage';
import { RenderProjectList, RenderDisplay } from './scripts/render';
import { FormHandler } from './scripts/FormHandler';

// Initialize
const LOCAL_STORAGE_PROJECT_KEY = 'myProjects';
const storage = new Storage(LOCAL_STORAGE_PROJECT_KEY);
const myProjects = new ProjectLibrary();

// Load existing projects from localStorage
const savedProjects = storage.load();
if (savedProjects) {
    savedProjects.forEach(savedProject => {
        if (savedProject && savedProject.name) {
            const project = new Project(savedProject.name, myProjects);
            savedProject.tasks.forEach(savedTask => {
                new Task(
                    savedTask.title,
                    savedTask.priority,
                    savedTask.date,
                    savedTask.description,
                    savedTask.tag,
                    savedTask.checklist,
                    project,
                    savedTask.completed
                );
            });

        } else {
            console.error('Invalid project data found:', savedProject);
        }
    });
}

// Start Rendering
const projectList = new RenderProjectList('[data-projects]', new RenderDisplay('[data-main]'));

// Render the loaded projects
projectList.renderList(myProjects.getProjects());

// Initialize FormHandler for new project creation
new FormHandler(
    '[data-new-project-form]',
    '[data-new-project-input]',
    '[data-new-project-form-container]',
    'button',
    myProjects,
    projectList,
    storage
);

// Save data when a project or task changes
window.addEventListener('beforeunload', () => {
    storage.save(myProjects.getProjects());
});
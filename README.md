# 📝 To-Do List App

This To-Do List App is a dynamic web application built using HTML, CSS, JavaScript, npm, webpack, and JSON. The app allows users to create, manage, and track tasks within projects. Tasks can be marked as complete or incomplete, with the data being saved locally using JSON for persistence.

The main purpose of this project is to demonstrate my skills in frontend development, focusing on creating interactive features, managing application state, and using local storage for data persistence.

## Features 🚀

- **Create and Manage Projects**: Users can add new projects and delete them as needed.
- **Add and Manage Tasks**: Tasks can be added to projects, edited, or deleted. Each task includes priority, due date, description, and a checklist of items to complete.
- **Mark Tasks as Complete**: Tasks can be marked as completed or incomplete.
- **Overdue Task Highlighting**: Overdue tasks are visually indicated with a special style.
- **Save Data Locally**: Task and project data is saved to local storage using JSON, allowing persistence across sessions.

## Purpose 🎯

The goal of this project is to demonstrate proficiency in frontend development and the ability to create interactive, persistent applications. This app showcases my ability to:

- Implement CRUD operations (Create, Read, Update, Delete) for both projects and tasks.
- Dynamically update the DOM in response to user actions.
- Utilize local storage for saving and loading data using JSON.
- Use JavaScript classes for object-oriented design and manage application state.

## Technologies Used ⚙️

- **HTML**: For structuring the app and creating the interface.
- **CSS**: For styling the app with modern design techniques, including animations and responsive layouts.
- **JavaScript**: For managing the app’s core functionality, including object-oriented design with classes and DOM manipulation.
- **npm**: For managing project dependencies.
- **webpack**: For bundling and optimizing JavaScript files.
- **JSON**: For saving task and project data to local storage, ensuring data persists across sessions.

## How to Use 🛠️
1 **Create a new project**: Click on the "Add Project" button to create a new project.

2 **Add tasks**: Within each project, you can add tasks, set priorities, and specify due dates.

3 **Manage data**: Projects and tasks are saved to local storage using JSON, so your progress is saved between sessions.

## Installation ⚡

To run the app locally:

1. Clone the repository:
    ```bash
    git clone git@github.com:DGUXdesigns/todo-list-app.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Bundle the app using webpack:
    ```bash
    npm run build
    ```

4. Open the `dist/index.html` file in your browser to use the app.

## Future Improvements 🌱

- **Authentication**: Add user authentication to allow users to save their tasks and projects to the cloud.
- **Task Notifications**: Implement notifications for overdue tasks or upcoming deadlines.
- **Drag-and-Drop**: Allow users to reorder tasks or projects using drag-and-drop functionality.
- **Task Search**: Implement a search feature to filter tasks by title, project, or priority.
- **Resonsiveness**: Implement responsive design so app can be used on any device.

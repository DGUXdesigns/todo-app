export class RenderProjectList {
    constructor(listContainer) {
        this.container = document.querySelector(listContainer);
    }

    renderList(project) {
        this.container.innerHTML = '';

        project.forEach((project, index) => {
            const listElement = document.createElement('li');
            listElement.classList.add('list-name');
            listElement.innerHTML = project.name;

            const icon = this.createIcon('incomplete_circle');
            listElement.prepend(icon);
    
            listElement.addEventListener('click', () => {
                this.handleSelection(listElement);
            });

            this.container.appendChild(listElement);
        });
    }

    createIcon(iconName) {
        const icon = document.createElement('i');
        icon.classList.add('material-icons');
        icon.innerText = iconName;

        return icon;
    }

    handleSelection(element) {
        this.container.querySelectorAll('.list-name').forEach(item => {
            item.classList.remove('active-project');
        });

        element.classList.add('active-project');
    }
}
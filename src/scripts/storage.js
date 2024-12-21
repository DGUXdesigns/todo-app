export class Storage {
    constructor(key) {
        this.key = key; // Key for local storage
    }

    save(data) {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
        } catch (e) {
            console.error('Could not save to local storage', error);
        }
    }

    load() {
        try {
            if (localStorage.getItem(this.key)) {
                return JSON.parse(localStorage.getItem(this.key));
            } else {
                return null;
            }
        } catch(e) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }
}
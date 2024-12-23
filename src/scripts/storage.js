export class Storage {
    constructor(key) {
        this.key = key; // Key for local storage
    }

    save(data) {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
        } catch (e) {
            console.error('Could not save to local storage', e);
        }
    }

    load() {
        try {
            const savedData = localStorage.getItem(this.key);
            return savedData ? JSON.parse(savedData) : null;  // Return the saved data if available
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            return null;
        }
    }
}
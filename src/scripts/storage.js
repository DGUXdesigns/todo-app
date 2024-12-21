export class Storage {
    constructor(key) {
        this.key = key; // Key for local storage
    }

    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    load() {
        if (localStorage.getItem(this.key)) {
            return JSON.parse(localStorage.getItem(this.key));
        } else {
            return null;
        }
    }
}
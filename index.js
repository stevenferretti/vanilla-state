const equal = require('lodash.isequal');
const clone = require('lodash.clonedeep');

class VanillaState {
    
    constructor(stateObject, items) {
        this.objectHandler = {
            stateObject,
            stateObjectSave: clone(stateObject),
            items: (items || Object.keys(stateObject)),
            versionHistory: [] 
        }
        this.stampVersion();
    }

    get changes() {
        const changes= [];
        for (const field of this.objectHandler.items) {
            if (!equal(this.objectHandler.stateObject[field], this.objectHandler.stateObjectSave[field])){
                changes.push({
                    field,
                    originalState: this.objectHandler.stateObjectSave[field],
                    currentState: this.objectHandler.stateObject[field]
                });
            }
        }
        return changes;
    }
    
    get items() {
        return this.objectHandler.items;
    }

    get currentState() {
        return this.objectHandler.stateObject;
    }

    get lastSavedState() {
        return this.objectHandler.stateObjectSave;
    }

    get versionHistory() {
        return this.objectHandler.versionHistory;
    }
    
    stampVersion() {
        this.objectHandler.versionHistory.push(clone(this.objectHandler.stateObjectSave));
    }

    revert(field) {
        if (this.objectHandler.items.includes(field)){
            this.objectHandler.stateObject[field] = clone(this.objectHandler.stateObjectSave[field]);
        }
    }

    revertAll() {
        for (const field of this.objectHandler.items) {
            this.revert(field);
        }
    }

    save(field) {
        if (this.objectHandler.items.includes(field)){
            this.objectHandler.stateObjectSave[field] = clone(this.objectHandler.stateObject[field]);
        }
        stampVersion();
    }

    saveAll() {
        for (const field of this.objectHandler.items) {
            this.save(field);
        }
        stampVersion();
    }
    
}

module.exports = VanillaState;
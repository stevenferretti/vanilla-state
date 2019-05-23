const equal = require('lodash.isequal');
const Eot = require('eloquent-object-tools');
const eot = new(Eot);

class VanillaState {
    
    constructor(stateObject, items, saveCallBack) {
        this.objectHandler = {
            saveCallBack,
            stateObject,
            stateObjectSave: eot.clone(stateObject),
            items: (items || Object.keys(stateObject)),
            versionHistory: [] 
        }
        this.stampVersion(true);
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

    revertToVersion(versionNumber) {
        if (this.objectHandler.versionHistory[versionNumber]) {
            this.objectHandler.stateObject = {
                ...this.objectHandler.stateObject,
                ...this.objectHandler.versionHistory[versionNumber]
            }
            this.saveAll();
        }
    }
    
    stampVersion(initial) {
        let savedObject = {};
        for (const field of this.objectHandler.items) {
            savedObject[field] = eot.clone(this.objectHandler.stateObjectSave[field]);
        }
        this.objectHandler.versionHistory.push(savedObject);
        if (this.objectHandler.saveCallBack && (typeof this.objectHandler.saveCallBack === "function") && !initial){
            this.objectHandler.saveCallBack(this.objectHandler.stateObjectSave);
        }
    }

    revert(field) {
        if (this.objectHandler.items.includes(field)){
            this.objectHandler.stateObject[field] = eot.clone(this.objectHandler.stateObjectSave[field]);
        }
    }

    revertAll() {
        for (const field of this.objectHandler.items) {
            this.revert(field);
        }
    }

    save(field, save = true) {
        if (this.objectHandler.items.includes(field)){
            this.objectHandler.stateObjectSave[field] = eot.clone(this.objectHandler.stateObject[field]);
        }
        if (save){
            this.stampVersion();
        }
    }

    saveAll() {
        for (const field of this.objectHandler.items) {
            this.save(field, false);
        }
        this.stampVersion();
    }
    
}

module.exports = VanillaState;
const equal = require('lodash.isequal');
const clone = require('lodash.clonedeep');

class VanillaState {
    
    constructor(stateObject, fields) {
        this.objectHandler = {
            stateObject,
            stateObjectSave: clone(stateObject),
            fields: (fields || Object.keys(stateObject)) 
        }
    }

    get changes() {
        const changes= [];
        for (const field of this.objectHandler.fields) {
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

    revert(field) {
        if (this.objectHandler.fields.includes(field)){
            this.objectHandler.stateObject[field] = clone(this.objectHandler.stateObjectSave[field]);
        }
    }

    revertAll() {
        for (const field of this.objectHandler.fields) {
            this.revert(field);
        }
    }

    save(field) {
        if (this.objectHandler.fields.includes(field)){
            this.objectHandler.stateObjectSave[field] = clone(this.objectHandler.stateObject[field]);
        }
    }

    saveAll() {
        for (const field of this.objectHandler.fields) {
            this.save(field);
        }
    }
    
}
/// <reference path="ICookingAction.ts" />

class Recipe {
    $type : string = 'Recipe';
    constructor(protected name: string,
                protected actions: Array<ICookingAction>) {
        
    }
    
    getActions() : Array<ICookingAction> {
        return this.actions;
    }
}
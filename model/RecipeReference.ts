/// <reference path="ICookingStep.ts" />

class RecipeReference {
    $type : string = 'RecipeReference';
    constructor(public name: string = "",
                public actions: Array<ICookingStep> = []) {
        
    }
    
    public static load(data : any) : RecipeReference {
        let curContext : any = window;
        let newObj : RecipeReference = new RecipeReference();
        newObj.name = data.name;
        newObj.actions = (data.actions as Array<any>).map(p => curContext[p.$type].load(p));
        return newObj;
    }
    
    getActions() : Array<ICookingStep> {
        return this.actions;
    }
    getName() : string {
        return this.name;
    }
}
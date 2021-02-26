/// <reference path="ICookingAction.ts" />

class Recipe {
    $type : string = 'Recipe';
    constructor(public name: string = "",
                public actions: Array<ICookingAction> = [] 
    
    ) {
        
    }
    
    public static load(data : any) : Recipe {
        let curContext : any = window;
        let newObj : Recipe = new Recipe();
        newObj.name = data.name;
        newObj.actions = (data.actions as Array<any>).map(p => curContext[p.$type].load(p));
        return newObj;
    }
    
    getActions() : Array<ICookingAction> {
        return this.actions;
    }
    getName() : string {
        return this.name;
    }
}
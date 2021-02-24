/// <reference path="CookingAction.ts" />

class Filter extends CookingAction {
    $type : string = 'Heat';
    constructor() {
        super();
    }
    
    public compare(action : ICookingAction) : string {
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.$type;
        }
        return "";
    }
    public compareFilter(action : Filter) : string {
        return "";
    }
    
    analyse(action: ICookingAction): number | null {
        if (action instanceof Filter) {
            this.analyseFilter(action);
        }
        return null;

    }

    analyseFilter(action: Filter): number | null {
        return 1;
    }
}
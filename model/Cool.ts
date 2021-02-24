/// <reference path="CookingAction.ts" />

class Cool extends CookingAction {
    $type : string = 'Heat';
    constructor(protected degrees: number = 0) {
        super();
    }
    
    public compare(action : ICookingAction) : string {
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.$type;
        }
        let addIngredient = action as Cool;
        return this.compareHeat(addIngredient);
    }
    public compareHeat(action : Cool) : string {
        if (this.degrees > action.degrees) {
            return "Le rafraichissement est trop important";
        }
        if (this.degrees < action.degrees) {
            return "Le rafraichissement est trop faible";
        }
        return "";
    }
    
    analyse(action: ICookingAction): number | null {
        if (action instanceof Cool) {
            this.analyseCool(action);
        }
        return null;

    }

    analyseCool(action: Cool): number | null {
        return this.notation(this.degrees, action.degrees);
    }
}
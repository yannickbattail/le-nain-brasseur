/// <reference path="CookingAction.ts" />
/// <reference path="Ingredient.ts" />

class AddIngredient extends CookingAction {
    $type : string = 'AddIngredient';
    constructor(protected ingredient: Ingredient,
                protected quantity: number = 0) {
        super();
        
    }

    public compare(action : ICookingAction) : string {
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.$type;
        }
        let addIngredient = action as AddIngredient;
        return this.compareAddIngredient(addIngredient);
    }
    public compareAddIngredient(action : AddIngredient) : string {
        if (this.ingredient.getName() != action.ingredient.getName()) {
            return "Ingredient n'est pas le bon, il devrait être: "+this.ingredient.getName();
        }
        if (this.quantity > action.quantity) {
            return "Il y n'a pas assez de "+this.ingredient.getName();
        }
        if (this.quantity < action.quantity) {
            return "Il y a trop de "+this.ingredient.getName();
        }
        return "";
    }

    analyse(action: ICookingAction): number | null {
        if (action instanceof AddIngredient) {
            this.analyseAddIngredient(action);
        }
        return null;

    }

    analyseAddIngredient(action: AddIngredient): number | null {
        if (this.ingredient.getName() != action.ingredient.getName()) {
            return 0;
        }
        return  this.notation(this.quantity, action.quantity);
    }
}
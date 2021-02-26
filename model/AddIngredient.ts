/// <reference path="./IResource.ts" />
/// <reference path="./Resource.ts" />
/// <reference path="./IQuantity.ts" />
/// <reference path="./Quantity.ts" />
/// <reference path="./ICookingAction.ts" />
/// <reference path="./CookingAction.ts" />

class AddIngredient extends CookingAction {
    $type : string = 'AddIngredient';
    constructor(public quantity: IQuantity) {
        super();
        
    }

    getName() : string {
        return "Ajout un ingrédient";
    }
    getImage() : string {
        return "AddIngredient.svg";
    }
    public compare(action : ICookingAction) : string {
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.$type;
        }
        let addIngredient = action as AddIngredient;
        return this.compareAddIngredient(addIngredient);
    }
    compareAddIngredient(action : AddIngredient) : string {
        if (this.quantity.getResource().getName() != action.quantity.getResource().getName()) {
            return "Ingredient n'est pas le bon, il devrait être: "+this.quantity.getResource().getName();
        }
        if (this.quantity > action.quantity) {
            return "Il y n'a pas assez de "+this.quantity.getResource().getName();
        }
        if (this.quantity < action.quantity) {
            return "Il y a trop de "+this.quantity.getResource().getName();
        }
        return "";
    }

    public analyse(action: ICookingAction): number | null {
        if (action instanceof AddIngredient) {
            this.analyseAddIngredient(action);
        }
        return null;

    }

    analyseAddIngredient(action: AddIngredient): number | null {
        if (this.quantity.getResource().getName() != action.quantity.getResource().getName()) {
            return 0;
        }
        return this.notation(this.quantity.getQuantity(), action.quantity.getQuantity());
    }
}

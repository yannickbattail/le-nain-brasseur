/// <reference path="./IResource.ts" />
/// <reference path="./Resource.ts" />
/// <reference path="./IQuantity.ts" />
/// <reference path="./Quantity.ts" />
/// <reference path="./ICookingStep.ts" />
/// <reference path="./CookingStep.ts" />

class AddIngredient extends CookingStep {
    $type : string = 'AddIngredient';
    constructor(public quantity: IQuantity = EMPTY_QUANTITY) {
        super();
        
    }
    
    public static load(data : any) : AddIngredient {
        let curContext : any = window;
        let newObj : AddIngredient = new AddIngredient();
        newObj.quantity = curContext[data.quantity.$type].load(data.player);
        return newObj;
    }
    
    getName() : string {
        return "Ajout un ingrédient";
    }
    getImage() : string {
        return "AddIngredient.svg";
    }
    public compare(action : ICookingStep) : string {
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

    public analyse(action: ICookingStep): number | null {
        if (action instanceof AddIngredient) {
            this.analyseAddIngredient(action);
        }
        return null;
    }

    analyseAddIngredient(action: AddIngredient): number | null {
        if (this.quantity.getResource().getName() != action.quantity.getResource().getName()) {
            return 0;
        }
        return this.scoring(this.quantity.getQuantity(), action.quantity.getQuantity());
    }
}

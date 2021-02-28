/// <reference path="CookingStep.ts" />

class Cool extends CookingStep {
    $type : string = 'Cool';
    constructor(public degrees: number = 0) {
        super();
    }

    public static load(data : any) : Cool {
        let newObj : Cool = new Cool();
        newObj.degrees = data.degrees;
        return newObj;
    }

    getName() : string {
        return "Refroidir";
    }
    getImage() : string {
        return "cool.svg";
    }
    public compare(action : ICookingStep) : string {
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
    
    analyse(action: ICookingStep): number | null {
        if (action instanceof Cool) {
            this.analyseCool(action);
        }
        return null;

    }

    analyseCool(action: Cool): number | null {
        return RecipeAnalysis.scoring(this.degrees, action.degrees);
    }
}
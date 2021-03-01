/// <reference path="./IResource.ts" />
/// <reference path="./Resource.ts" />
/// <reference path="./IQuantity.ts" />
/// <reference path="./Quantity.ts" />
/// <reference path="./ICookingStep.ts" />
/// <reference path="./CookingStep.ts" />

class AddIngredient extends CookingStep {
    $type : string = 'AddIngredient';
    
    constructor(stepParameters: Array<StepParameter> = []) {
        super(stepParameters);
        this.validate();
    }
    
    public static load(data : any) : AddIngredient {
        let curContext : any = window;
        let newObj : AddIngredient = new AddIngredient();
        newObj.stepParameters = (data.stepParameters as Array<any>).map(p => curContext[p.$type].load(p));
        return newObj;
    }
    
    getName() : string {
        return "Ajout un ingrédient";
    }
    getImage() : string {
        return "AddIngredient.svg";
    }
    
    getStepParameters() : Array<StepParameter> {
        return this.stepParameters;
    }
    getStepParameter(index : number) : StepParameter {
        if (index != 1) {
            throw "AddIngredient has only one StepParameter.";
        }
        return this.stepParameters[index];
    }
    
    validate() : void {
        if (this.stepParameters.length != 1) {
            throw "AddIngredient should have only one StepParameter.";
        }
        if (this.stepParameters[0].resource == null) {
            throw "StepParameter should have a resource.";
        }
    }
    
    public getQuantity() {
        let res = new Resource("nothing");
        if (this.stepParameters[0].resource !== null) {
            res = this.stepParameters[0].resource;
        }
        return Q(this.stepParameters[0].value, res);
    }
    
    public compare(action : ICookingStep) : string {
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.getName();
        }
        let addIngredient = action as AddIngredient;
        return this.compareAddIngredient(addIngredient);
    }
    compareAddIngredient(action : AddIngredient) : string {
        if (this.getStepParameter(0).resource?.getName() != action.getStepParameter(0).resource?.getName()) {
            return "Ingredient n'est pas le bon, il devrait être: " + this.getStepParameter(0).resource?.getName();
        }
        if (this.getStepParameter(0).value > action.getStepParameter(0).value) {
            return "Il y n'a pas assez de " + this.getStepParameter(0).resource?.getName();
        }
        if (this.getStepParameter(0).value < action.getStepParameter(0).value) {
            return "Il y a trop de " + this.getStepParameter(0).resource?.getName();
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
        if (this.getStepParameter(0).resource?.getName() != action.getStepParameter(0).resource?.getName()) {
            return 0;
        }
        return RecipeAnalysis.scoring(this.getStepParameter(0).value, action.getStepParameter(0).value);
    }
}

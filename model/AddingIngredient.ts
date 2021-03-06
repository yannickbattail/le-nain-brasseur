/// <reference path="./IResource.ts" />
/// <reference path="./Resource.ts" />
/// <reference path="./IQuantity.ts" />
/// <reference path="./Quantity.ts" />
/// <reference path="./ICookingStep.ts" />
/// <reference path="./CookingStep.ts" />

class AddingIngredient extends CookingStep {
    $type : string = 'AddingIngredient';
    
    constructor(stepParameters: Array<StepParameter> = []) {
        super(stepParameters);
        this.validate();
    }
    
    public static load(data : any) : AddingIngredient {
        let curContext : any = window;
        let stepParameters = (data.stepParameters as Array<any>).map(p => curContext[p.$type].load(p));
        let newObj : AddingIngredient = new AddingIngredient(stepParameters);
        return newObj;
    }
    
    getName() : string {
        return "Ajout un ingrédient";
    }
    getImage() : string {
        return "AddIngredient.svg";
    }
    getResource() : Resource {
        return this.stepParameters[0].resource?this.stepParameters[0].resource:new Resource("nothing");
    }
    
    getStepParameters() : Array<StepParameter> {
        return this.stepParameters;
    }
    getStepParameter(index : number) : StepParameter {
        if (index != 0) {
            throw "AddIngredient has only one StepParameter.";
        }
        return this.stepParameters[index];
    }
    
    validate() : void {
        if (this.stepParameters.length != 1) {
            throw "AddIngredient should have only one StepParameter.";
        }
        if (this.stepParameters[0].name != "quantité") {
            throw "stepParameters name should be quantité";
        }
        if (this.stepParameters[0].resource == null) {
            throw "StepParameter should have a resource.";
        }
    }
    
    public analyse(action: ICookingStep, level: AnalysisLevel): void {
        if (this.$type != action.$type) {
            this.getStepParameter(0).problem = "L'étape devrait être "+this.getName();
        }
        if (action instanceof AddingIngredient) {
            this.analyseStep(this.getStepParameter(0), action.getStepParameter(0), level,
            "Il y a trop d'ingrédient pour la recette.",
            "Il y n'a pas assez d'ingrédient pour la recette.",
            true);
        }
    }
}

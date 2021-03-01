/// <reference path="CookingStep.ts" />

class Cooling extends CookingStep {
    $type : string = 'Cooling';
    
    constructor(stepParameters: Array<StepParameter> = []) {
        super(stepParameters);
        this.validate();
    }

    public static load(data : any) : Brewing {
        let curContext : any = window;
        let stepParameters = (data.stepParameters as Array<any>).map(p => curContext[p.$type].load(p));
        let newObj : Brewing = new Brewing(stepParameters);
        return newObj;
    }
    
    getName() : string {
        return "Refroidir";
    }
    getImage() : string {
        return "cool.svg";
    }
    
    getStepParameters() : Array<StepParameter> {
        return this.stepParameters;
    }
    getStepParameter(index : number) : StepParameter {
        if (index != 1) {
            throw "Cool has only one StepParameter.";
        }
        return this.stepParameters[index];
    }

    validate() : void {
        if (this.stepParameters.length != 1) {
            throw "Cool should have only one StepParameter.";
        }
        if (this.stepParameters[0].name == "température") {
            throw "stepParameters name should be température";
        }
        if (this.stepParameters[0].resource != null) {
            throw "StepParameter should have not a resource.";
        }
    }

    
    public compare(action : ICookingStep) : string {
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.getName();
        }
        let addIngredient = action as Cooling;
        return this.compareHeat(addIngredient);
    }
    
    public compareHeat(action : Cooling) : string {
        if (this.getStepParameter(0).value > action.getStepParameter(0).value) {
            return "Le rafraichissement est trop important";
        }
        if (this.getStepParameter(0).value < action.getStepParameter(0).value) {
            return "Le rafraichissement est trop faible";
        }
        return "";
    }
    
    analyse(action: ICookingStep): number | null {
        if (action instanceof Cooling) {
            this.analyseCool(action);
        }
        return null;

    }

    analyseCool(action: Cooling): number | null {
        return RecipeAnalysis.scoring(this.getStepParameter(0).value, action.getStepParameter(0).value);
    }
}
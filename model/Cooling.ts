/// <reference path="CookingStep.ts" />

class Cooling extends CookingStep {
    $type : string = 'Cooling';
    
    constructor(stepParameters: Array<StepParameter> = []) {
        super(stepParameters);
        this.validate();
    }

    public static load(data : any) : Cooling {
        let curContext : any = window;
        let stepParameters = (data.stepParameters as Array<any>).map(p => curContext[p.$type].load(p));
        let newObj : Cooling = new Cooling(stepParameters);
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
        if (index != 0) {
            throw "Cool has only one StepParameter.";
        }
        return this.stepParameters[index];
    }

    validate() : void {
        if (this.stepParameters.length != 1) {
            throw "Cool should have only one StepParameter.";
        }
        if (this.stepParameters[0].name != "température") {
            throw "stepParameters name should be température";
        }
        if (this.stepParameters[0].resource != null) {
            throw "StepParameter should have not a resource.";
        }
    }
    
    public analyse(action: ICookingStep) {
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.getName();
        }
        if (action instanceof Cooling) {
            this.analyseCool(this.getStepParameter(0), action.getStepParameter(0));
        }
    }

    analyseCool(step: StepParameter, stepRef: StepParameter) {
        step.problem = "";
        step.advice = "";
        step.score = null;
        if (step.value < stepRef.value) {
            if (step.value < stepRef.value/2) {
                step.problem += "La température n'est pas assez chaude";
            } else {
                step.advice += "La température n'est pas assez chaude";
            }
        }
        if (step.value > stepRef.value) {
            if (step.value > stepRef.value + stepRef.value/2) {
                step.problem += "La température est trop chaude";
            } else {
                step.advice += "La température est trop chaude";
            }
        }
        if (step.problem == "") {
            step.problem = null;
        }
        if (step.advice == "") {
            step.advice = null;
        }
        step.score = RecipeAnalysis.scoring(step.value, stepRef.value);
    }
    
}
/// <reference path="CookingStep.ts" />

class Filter extends CookingStep {
    $type : string = 'Filter';
    
    constructor(stepParameters: Array<StepParameter> = []) {
        super(stepParameters);
        this.validate();
    }

    public static load(data : any) : AddIngredient {
        let curContext : any = window;
        let stepParameters = (data.stepParameters as Array<any>).map(p => curContext[p.$type].load(p));
        let newObj : AddIngredient = new AddIngredient(stepParameters);
        return newObj;
    }
    
    getStepParameters() : Array<StepParameter> {
        return this.stepParameters;
    }
    getStepParameter(index : number) : StepParameter {
        if (index != 0) {
            throw "Filter has no StepParameter.";
        }
        return this.stepParameters[index];
    }

    validate() : void {
        if (this.stepParameters.length != 0) {
            throw "Brewing should have no StepParameter.";
        }
    }

    getName() : string {
        return "Filtrer";
    }
    getImage() : string {
        return "strainer.svg";
    }
    public compare(action : ICookingStep) : string {
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.getName();
        }
        return "";
    }
    
    analyse(action: ICookingStep): number | null {
        if (action instanceof Filter) {
            this.analyseFilter(action);
        }
        return null;
    }

    analyseFilter(action: Filter): number | null {
        return 1;
    }
}

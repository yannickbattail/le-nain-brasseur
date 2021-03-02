/// <reference path="CookingStep.ts" />

class Filtering extends CookingStep {
    $type : string = 'Filtering';
    
    constructor(stepParameters: Array<StepParameter> = []) {
        super(stepParameters);
        this.validate();
    }

    public static load(data : any) : Filtering {
        let curContext : any = window;
        let stepParameters = (data.stepParameters as Array<any>).map(p => curContext[p.$type].load(p));
        let newObj : Filtering = new Filtering(stepParameters);
        return newObj;
    }
    
    getStepParameters() : Array<StepParameter> {
        return this.stepParameters;
    }
    getStepParameter(index : number) : StepParameter {
        throw "Filter has no StepParameter.";
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
    
    public analyse(action: ICookingStep) {
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.getName();
        }
    }
}

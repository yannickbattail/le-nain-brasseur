/// <reference path="CookingStep.ts" />

class Filtering extends CookingStep {
    $type : string = 'Filtering';
    
    constructor(stepParameters: Array<StepParameter> = []) {
        super(stepParameters);
        this.validate();
    }

    public static load(data : any) : Filtering {
        const curContext : any = window;
        const stepParameters = (data.stepParameters as Array<any>).map(p => curContext[p.$type].load(p));
        const newObj : Filtering = new Filtering(stepParameters);
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
    
    public analyse(action: ICookingStep, level: AnalysisLevel): void {
        if (this.$type != action.$type) {
            //return "L'étape devrait être "+this.getName();
        }
    }
}

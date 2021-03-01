/// <reference path="ICookingStep.ts" />

abstract class CookingStep implements ICookingStep {
    abstract $type: string;
    
    constructor(public stepParameters: Array<StepParameter>  = []) {

    }
    
    abstract getName() : string;
    abstract getImage() : string;
    abstract getStepParameters() : Array<StepParameter>;
    abstract getStepParameter(index : number) : StepParameter;
    abstract validate() : void;
    abstract compare(action: ICookingStep) : string;
    abstract analyse(action: ICookingStep) : number|null;
}

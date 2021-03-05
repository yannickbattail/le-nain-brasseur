
interface ICookingStep {
    $type: string;

    getName() : string;
    getImage() : string;
    getStepParameters() : Array<StepParameter>;
    getStepParameter(index : number) : StepParameter;
    validate() : void;

    analyse(action: ICookingStep, level: AnalysisLevel) : void;
}

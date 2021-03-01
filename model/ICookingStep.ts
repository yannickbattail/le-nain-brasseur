
interface ICookingStep {
    $type: string;

    getName() : string;
    getImage() : string;
    getStepParameters() : Array<StepParameter>;
    getStepParameter(index : number) : StepParameter;
    validate() : void;
    compare(action: ICookingStep) : string;
    analyse(action: ICookingStep) : number|null;
}

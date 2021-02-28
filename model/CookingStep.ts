/// <reference path="ICookingStep.ts" />

abstract class CookingStep implements ICookingStep {
    abstract $type: string;

    abstract getName() : string;
    abstract getImage() : string;
    abstract compare(action: ICookingStep) : string;
    abstract analyse(action: ICookingStep) : number|null;
}

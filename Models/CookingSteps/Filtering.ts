import { CookingStep } from './CookingStep.js';
import { StepParameter } from './StepParameter.js';
import { ICookingStep } from './ICookingStep.js';
import { ClassLoader } from '../../Services/ClassLoader.js';

export class Filtering extends CookingStep {
    $type: string = 'Filtering';

    constructor(stepParameters: Array<StepParameter> = []) {
        super(stepParameters);
        this.validate();
    }

    public static load(data: unknown): Filtering {
        const obj: Filtering = data as Filtering;
        const stepParameters = obj.stepParameters.map((p) => ClassLoader.load(p) as StepParameter);
        return new Filtering(stepParameters);
    }

    getStepParameters(): Array<StepParameter> {
        return this.stepParameters;
    }

    getStepParameter(index: number): StepParameter {
        throw `Filter has no StepParameter. ${index}`;
    }

    validate(): void {
        if (this.stepParameters.length != 0) {
            throw 'Brewing should have no StepParameter.';
        }
    }

    getName(): string {
        return 'Filtrer';
    }

    getImage(): string {
        return 'strainer.svg';
    }

    public analyse(action: ICookingStep): void {
        if (this.$type != action.$type) {
            this.getStepParameter(0).problem = "L'étape devrait être " + this.getName();
        }
    }
}

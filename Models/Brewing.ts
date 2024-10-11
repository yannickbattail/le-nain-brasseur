import { CookingStep } from './CookingSteps/CookingStep.js';
import { StepParameter } from './CookingSteps/StepParameter.js';
import { ICookingStep } from './CookingSteps/ICookingStep.js';
import { AnalysisLevel } from './AnalysisLevel.js';
import { ClassLoader } from '../Services/ClassLoader.js';

export class Brewing extends CookingStep {
    $type: string = 'Brewing';

    constructor(stepParameters: Array<StepParameter> = []) {
        super(stepParameters);
        this.validate();
    }

    public static load(obj: unknown): Brewing {
        const data = obj as Brewing;
        const stepParameters = data.stepParameters.map((p) => ClassLoader.load(p) as StepParameter);
        return new Brewing(stepParameters);
    }

    getName(): string {
        return 'Fermenter';
    }

    getImage(): string {
        return 'boiling-bubbles.svg';
    }

    getStepParameters(): Array<StepParameter> {
        return this.stepParameters;
    }

    getStepParameter(index: number): StepParameter {
        if (index != 0) {
            throw 'Brewing has only one StepParameter.';
        }
        return this.stepParameters[index];
    }

    validate(): void {
        if (this.stepParameters.length != 1) {
            throw 'Brewing should have only one StepParameter.';
        }
        if (this.stepParameters[0].name != 'jour') {
            throw 'stepParameters name should be jour';
        }
        if (this.stepParameters[0].resource != null) {
            throw 'StepParameter should have not a resource.';
        }
    }

    public analyse(action: ICookingStep, level: AnalysisLevel): void {
        if (this.$type != action.$type) {
            this.getStepParameter(0).problem = "L'étape devrait être " + this.getName();
        }
        if (action instanceof Brewing) {
            this.analyseStep(
                this.getStepParameter(0),
                action.getStepParameter(0),
                level,
                'La fermentation est trop longue',
                'La fermentation est trop courte',
            );
        }
    }
}

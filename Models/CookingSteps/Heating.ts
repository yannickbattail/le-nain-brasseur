import { CookingStep } from './CookingStep.js';
import { StepParameter } from './StepParameter.js';
import { ICookingStep } from './ICookingStep.js';
import { AnalysisLevel } from '../AnalysisLevel.js';
import { ClassLoader } from '../../Services/ClassLoader.js';

export class Heating extends CookingStep {
    $type: string = 'Heating';

    constructor(stepParameters: Array<StepParameter> = []) {
        super(stepParameters);
        this.validate();
    }

    public static load(data: unknown): Heating {
        const obj: Heating = data as Heating;
        const stepParameters = obj.stepParameters.map((p) => ClassLoader.load(p) as StepParameter);
        return new Heating(stepParameters);
    }

    getName(): string {
        return 'Chauffer';
    }
    getImage(): string {
        return 'camp-cooking-pot.svg';
    }

    getStepParameters(): Array<StepParameter> {
        return this.stepParameters;
    }
    getStepParameter(index: number): StepParameter {
        if (index != 0 && index != 1) {
            throw 'Heat has 2 StepParameters.';
        }
        return this.stepParameters[index];
    }

    validate(): void {
        if (this.stepParameters.length != 2) {
            throw 'Heat should have 2 StepParameters.';
        }
        if (this.stepParameters[0].name != 'température') {
            throw 'stepParameters name should be température';
        }
        if (this.stepParameters[1].name != 'durée') {
            throw 'stepParameters name should be durée';
        }
        if (this.stepParameters[0].resource != null || this.stepParameters[1].resource != null) {
            throw 'StepParameter should have not a resource.';
        }
    }

    public analyse(action: ICookingStep, level: AnalysisLevel): void {
        if (this.$type != action.$type) {
            this.getStepParameter(0).problem = "L'étape devrait être " + this.getName();
        }
        if (action instanceof Heating) {
            this.analyseStep(
                this.getStepParameter(0),
                action.getStepParameter(0),
                level,
                'La température est trop chaude',
                "La température n'est pas assez chaude",
            );
            this.analyseStep(
                this.getStepParameter(1),
                action.getStepParameter(1),
                level,
                'La cuisson est trop longue',
                'La cuisson est trop courte',
            );
        }
    }
}

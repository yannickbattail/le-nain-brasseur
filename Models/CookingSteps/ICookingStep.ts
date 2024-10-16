import { StepParameter } from './StepParameter.js';

export interface ICookingStep {
    score?: number;
    stepParameters: Array<StepParameter>;
}

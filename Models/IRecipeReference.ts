import { ICookingStep } from './CookingSteps/ICookingStep.js';

export interface IRecipeReference {
    name: string;
    steps: Array<ICookingStep>;
    level: number;
}

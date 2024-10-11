import { ICookingStep } from './CookingSteps/ICookingStep.js';
import { ClassLoader } from '../Services/ClassLoader.js';

export class RecipeReference {
    $type: string = 'RecipeReference';

    constructor(
        public name: string = '',
        public steps: Array<ICookingStep> = [],
        protected level: number = 0,
    ) {}

    public static load(data: unknown): RecipeReference {
        const obj: RecipeReference = data as RecipeReference;
        const newObj: RecipeReference = new RecipeReference();
        newObj.name = obj.name;
        newObj.level = obj.level;
        newObj.steps = obj.steps.map((p) => ClassLoader.load(p) as ICookingStep);
        return newObj;
    }

    getCookingSteps(): Array<ICookingStep> {
        return this.steps;
    }

    getName(): string {
        return this.name;
    }

    getLevel(): number {
        return this.level;
    }
}

import { Resource } from '../Resources/Resource.js';
import { IQuantity } from '../Resources/IQuantity.js';
import { Q } from '../../Scenario.js';
import { ClassLoader } from '../../Services/ClassLoader.js';

export class StepParameter {
    $type: string = 'StepParameter';

    constructor(
        public name: string,
        public value: number,
        public resource: Resource | null = null,
        public problem: string = '',
        public advice: string = '',
        public score: number | null = null,
    ) {}

    public static load(data: unknown): StepParameter {
        const jsonObj: StepParameter = data as StepParameter;
        const newObj: StepParameter = new StepParameter(jsonObj.name, jsonObj.value);
        newObj.resource = jsonObj.resource != null ? (ClassLoader.load(jsonObj.resource) as Resource) : null;
        newObj.problem = jsonObj.problem;
        newObj.advice = jsonObj.advice;
        newObj.score = jsonObj.score;
        return newObj;
    }

    getName(): string {
        return this.name;
    }

    getValue(): number {
        return this.value;
    }

    public getQuantity(): IQuantity | null {
        if (this.resource == null) {
            return null;
        }
        return Q(this.value, this.resource);
    }
}

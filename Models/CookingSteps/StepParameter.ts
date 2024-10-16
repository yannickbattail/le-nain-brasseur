import { Resource } from '../Resources/Resource.js';
import { IQuantity } from '../Resources/IQuantity.js';
import { Q } from '../../Scenario.js';

export class StepParameter {
    $type: string = 'StepParameter';

    constructor(
        public name: string,
        public value: number,
        public resource?: Resource,
        public problem: string = '',
        public advice: string = '',
        public score?: number,
    ) {}

    public static load(data: unknown): StepParameter {
        const jsonObj: StepParameter = data as StepParameter;
        const newObj: StepParameter = new StepParameter(jsonObj.name, jsonObj.value);
        newObj.resource = jsonObj.resource;
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

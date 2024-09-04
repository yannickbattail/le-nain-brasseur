import { Resource } from "./Resource";
import { IQuantity } from "./IQuantity";
import { Q } from "../Scenario";

export class StepParameter {
  $type: string = "StepParameter";

  constructor(
    public name: string,
    public value: number,
    public resource: Resource | null = null,
    public problem: string = "",
    public advice: string = "",
    public score: number | null = null,
  ) {}

  public static load(data: any): StepParameter {
    const curContext: any = window;
    const newObj: StepParameter = new StepParameter(data.name, data.value);
    newObj.resource =
      data.resource != null
        ? curContext[data.resource.$type].load(data.resource)
        : null;
    newObj.problem = data.problem;
    newObj.advice = data.advice;
    newObj.score = data.score;
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

import { CookingStep } from "./CookingStep";
import { StepParameter } from "./StepParameter";
import { AnalysisLevel } from "./AnalysisLevel";
import { ICookingStep } from "./ICookingStep";

export class Cooling extends CookingStep {
  $type: string = "Cooling";

  constructor(stepParameters: Array<StepParameter> = []) {
    super(stepParameters);
    this.validate();
  }

  public static load(data: any): Cooling {
    const curContext: any = window;
    const stepParameters = (data.stepParameters as Array<any>).map((p) =>
      curContext[p.$type].load(p),
    );
    const newObj: Cooling = new Cooling(stepParameters);
    return newObj;
  }

  getName(): string {
    return "Refroidir";
  }

  getImage(): string {
    return "cool.svg";
  }

  getStepParameters(): Array<StepParameter> {
    return this.stepParameters;
  }

  getStepParameter(index: number): StepParameter {
    if (index != 0) {
      throw "Cool has only one StepParameter.";
    }
    return this.stepParameters[index];
  }

  validate(): void {
    if (this.stepParameters.length != 1) {
      throw "Cool should have only one StepParameter.";
    }
    if (this.stepParameters[0].name != "température") {
      throw "stepParameters name should be température";
    }
    if (this.stepParameters[0].resource != null) {
      throw "StepParameter should have not a resource.";
    }
  }

  public analyse(action: ICookingStep, level: AnalysisLevel): void {
    if (this.$type != action.$type) {
      this.getStepParameter(0).problem =
        "L'étape devrait être " + this.getName();
    }
    if (action instanceof Cooling) {
      this.analyseStep(
        this.getStepParameter(0),
        action.getStepParameter(0),
        level,
        "La température est trop chaude",
        "La température n'est pas assez chaude",
      );
    }
  }
}

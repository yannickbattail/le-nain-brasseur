import { StepParameter } from "./StepParameter";
import { AnalysisLevel } from "./AnalysisLevel";
import { CookingStep } from "./CookingStep";
import { ICookingStep } from "./ICookingStep";

export class Brewing extends CookingStep {
  $type: string = "Brewing";

  constructor(stepParameters: Array<StepParameter> = []) {
    super(stepParameters);
    this.validate();
  }

  public static load(data: any): Brewing {
    const curContext: any = window;
    const stepParameters = (data.stepParameters as Array<any>).map((p) =>
      curContext[p.$type].load(p),
    );
    const newObj: Brewing = new Brewing(stepParameters);
    return newObj;
  }

  getName(): string {
    return "Fermenter";
  }

  getImage(): string {
    return "boiling-bubbles.svg";
  }

  getStepParameters(): Array<StepParameter> {
    return this.stepParameters;
  }

  getStepParameter(index: number): StepParameter {
    if (index != 0) {
      throw "Brewing has only one StepParameter.";
    }
    return this.stepParameters[index];
  }

  validate(): void {
    if (this.stepParameters.length != 1) {
      throw "Brewing should have only one StepParameter.";
    }
    if (this.stepParameters[0].name != "jour") {
      throw "stepParameters name should be jour";
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
    if (action instanceof Brewing) {
      this.analyseStep(
        this.getStepParameter(0),
        action.getStepParameter(0),
        level,
        "La fermentation est trop longue",
        "La fermentation est trop courte",
      );
    }
  }
}

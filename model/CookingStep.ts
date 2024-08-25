/// <reference path="ICookingStep.ts" />

abstract class CookingStep implements ICookingStep {
  abstract $type: string;
  public score: number | null = null;

  constructor(public stepParameters: Array<StepParameter> = []) {}

  abstract getName(): string;

  abstract getImage(): string;

  abstract getStepParameters(): Array<StepParameter>;

  abstract getStepParameter(index: number): StepParameter;

  abstract validate(): void;

  abstract analyse(action: ICookingStep, level: AnalysisLevel): void;

  public getQuantity(): IQuantity | null {
    if (this.stepParameters.length == 0) {
      return null;
    }
    return this.stepParameters[0].getQuantity();
  }

  analyseStep(
    step: StepParameter,
    stepRef: StepParameter,
    level: AnalysisLevel,
    tooHighMsg: string,
    tooLowMsg: string,
    analyseResource: boolean = false,
  ) {
    if (level == AnalysisLevel.NONE) {
      return;
    }
    if (
      analyseResource &&
      step.resource?.getName() != stepRef.resource?.getName()
    ) {
      step.problem +=
        "Ingredient n'est pas le bon, il devrait être: " +
        this.getStepParameter(0).resource?.getName();
    }
    if (step.value < stepRef.value) {
      if (step.value < stepRef.value / 2) {
        step.problem += tooLowMsg;
      } else {
        if (level == AnalysisLevel.ADVISE) {
          step.advice += tooLowMsg;
        }
      }
    }
    if (step.value > stepRef.value) {
      if (step.value > stepRef.value + stepRef.value / 2) {
        step.problem += tooHighMsg;
      } else {
        if (level == AnalysisLevel.ADVISE) {
          step.advice += tooHighMsg;
        }
      }
    }
    if (level >= AnalysisLevel.SCORE) {
      step.score = RecipeAnalysis.scoring(step.value, stepRef.value);
    }
  }
}

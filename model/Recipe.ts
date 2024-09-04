import { RecipeReference } from "./RecipeReference";
import { AnalysisLevel } from "./AnalysisLevel";
import { ICookingStep } from "./ICookingStep";
import { IQuantity } from "./IQuantity";
import { Beer } from "./Beer";
import { GOLD, Q } from "../Scenario";
import { Article } from "./Article";

export class Recipe extends RecipeReference {
  $type: string = "Recipe";
  public score: number | null = null;
  public problem: string = "";
  public analysisLevel: AnalysisLevel = AnalysisLevel.NONE;

  constructor(
    public name: string = "",
    public steps: Array<ICookingStep> = [],
    public recipeRef: RecipeReference | null = null,
    protected level: number = 0,
  ) {
    super(name, steps);
  }

  public static load(data: any): Recipe {
    const curContext: any = window;
    const name = data.name;
    const steps = (data.steps as Array<any>).map((p) =>
      curContext[p.$type].load(p),
    );
    const recipeRef =
      data.recipeRef != null
        ? curContext[data.recipeRef.$type].load(data.recipeRef)
        : null;
    const newObj: Recipe = new Recipe(name, steps, recipeRef);
    newObj.level = data.level;
    newObj.score = data.score;
    newObj.problem = data.problem;
    newObj.analysisLevel = data.analysisLevel;
    return newObj;
  }

  getCookingSteps(): Array<ICookingStep> {
    return this.steps;
  }

  getName(): string {
    return this.name;
  }

  getBeer(): IQuantity {
    const liters = this.steps[0].getStepParameter(0).value;
    const beer = new Beer(
      this.name,
      "l",
      "beer.svg",
      "beer",
      "Beer à partir de " + this.recipeRef?.name,
      this,
    );
    return Q(liters, beer);
  }

  getCost(): number {
    const liters = this.getBeer().getQuantity() / 100;
    const cost = this.level * (this.score ?? 0) * liters * 2;
    return Math.round(cost * 10) / 10;
  }

  getArticle(): Article {
    return new Article(Q(this.getCost(), GOLD), this.getBeer().opposite());
  }

  public hasProblem(): boolean {
    return this.getCookingSteps()
      .map((s) =>
        s
          .getStepParameters()
          .map((s) => s.problem != null && s.problem != "")
          .reduce((a, b) => a || b, false),
      )
      .reduce((a, b) => a || b, false);
  }
}

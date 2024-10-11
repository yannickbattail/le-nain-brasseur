import { RecipeReference } from './RecipeReference.js';
import { AnalysisLevel } from './AnalysisLevel.js';
import { ICookingStep } from './CookingSteps/ICookingStep.js';
import { IQuantity } from './Resources/IQuantity.js';
import { Beer } from './Resources/Beer.js';
import { GOLD, Q, WATER } from '../Scenario.js';
import { Article } from './Article.js';
import { ClassLoader } from '../Services/ClassLoader.js';

export class Recipe extends RecipeReference {
    $type: string = 'Recipe';
    public score: number | null = null;
    public problem: string = '';
    public analysisLevel: AnalysisLevel = AnalysisLevel.NONE;

    constructor(
        public name: string = '',
        public steps: Array<ICookingStep> = [],
        public recipeRef: RecipeReference | null = null,
        protected level: number = 0,
    ) {
        super(name, steps);
    }

    public static load(data: unknown): Recipe {
        const obj: Recipe = data as Recipe;
        const name = obj.name;
        const steps = obj.steps.map((p) => ClassLoader.load(p) as ICookingStep);
        const recipeRef = ClassLoader.load(obj.recipeRef) as RecipeReference;
        const newObj: Recipe = new Recipe(name, steps, recipeRef);
        newObj.level = obj.level;
        newObj.score = obj.score;
        newObj.problem = obj.problem;
        newObj.analysisLevel = obj.analysisLevel;
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
        const beer = new Beer(this.name, 'l', 'beer.svg', 'beer', 'Beer à partir de ' + this.recipeRef?.name, this);
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
                    .map((s) => s.problem != null && s.problem != '')
                    .reduce((a, b) => a || b, false),
            )
            .reduce((a, b) => a || b, false);
    }

    public static createRecipe(recipeRef: RecipeReference): Recipe {
        const recipe = Recipe.load(JSON.parse(JSON.stringify(recipeRef)));
        recipe.name = 'ma ' + recipeRef.name;
        recipe.recipeRef = recipeRef;
        recipe.steps.forEach((s) =>
            s.getStepParameters().forEach((p) => {
                if (p.resource?.getName() != WATER.getName()) p.value = 0;
            }),
        );
        return recipe;
    }

    public static duplicate(recipeRef: RecipeReference): Recipe {
        const recipe = Recipe.load(JSON.parse(JSON.stringify(recipeRef)));
        recipe.name = recipeRef.name + '#';
        return recipe;
    }
}

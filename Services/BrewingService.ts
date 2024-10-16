import { IRecipe } from '../Models/IRecipe';
import { IRecipeReference } from '../Models/IRecipeReference';
import { IQuantity } from '../Models/Resources/IQuantity.js';
import { Beer } from '../Models/Resources/Beer.js';
import { GOLD, Q, WATER } from '../Scenario.js';
import { IArticle } from '../Models/IArticle';

export class BrewingService {
    public duplicateRecipe(recipeRef: IRecipeReference): IRecipe {
        const recipe = JSON.parse(JSON.stringify(recipeRef));
        recipe.name = recipeRef.name + '#';
        return recipe;
    }

    getBeer(recipe: IRecipe): IQuantity {
        const liters = recipe.steps[0].getStepParameter(0).value;
        const beer = new Beer(recipe.name, 'l', 'beer.svg', 'beer', 'Beer à partir de ' + recipe.recipeRef?.name, recipe);
        return Q(liters, beer);
    }

    getCost(recipe: IRecipe): number {
        const liters = this.getBeer(recipe).getQuantity() / 100;
        const cost = recipe.level * (recipe.score ?? 0) * liters * 2;
        return Math.round(cost * 10) / 10;
    }

    getArticle(recipe: IRecipe): IArticle {
        return new IArticle(Q(this.getCost(recipe), GOLD), this.getBeer(recipe).opposite());
    }

    public hasProblem(recipe: IRecipe): boolean {
        return recipe.steps
            .map((s) =>
                s
                    .getStepParameters()
                    .map((s) => s.problem != null && s.problem != '')
                    .reduce((a, b) => a || b, false),
            )
            .reduce((a, b) => a || b, false);
    }

    public createRecipe(recipeRef: IRecipeReference): IRecipe {
        const recipe = JSON.parse(JSON.stringify(recipeRef));
        recipe.name = 'ma ' + recipeRef.name;
        recipe.recipeRef = recipeRef;
        for (const s of recipe.steps) {
            for (const p of s.getStepParameters()) {
                if (p.resource?.getName() != WATER.getName()) p.value = 0;
            }
        }
        return recipe;
    }
}

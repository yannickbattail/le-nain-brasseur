/// <reference path="ICookingStep.ts" />
/// <reference path="Recipe.ts" />

class RecipeAnalysis {

    public static analyse(recipe : Recipe, player : IPlayer, level : AnalysisLevel) {
        if (!recipe.recipeRef) {
            throw "no recipeRef";
        }
        this.resetScore(recipe);
        this.playerHasIngredient(recipe, player)
        const steps = recipe.getCookingSteps();
        const stepsRef = recipe.recipeRef.getCookingSteps();
        let index : number = 0;
        while (index < stepsRef.length && index < steps.length) {
            if (stepsRef[index].$type != steps[index].$type) {
                recipe.problem = "L'étape #"+(index+1)+" devrait être "+steps[index].$type;
                return ;
            }
            steps[index].analyse(stepsRef[index], level);
            index++;
        }
        if (stepsRef.length > steps.length) {
            recipe.problem = "Il manque "+(stepsRef.length - steps.length)+" étape(s).";
        }
        else if (stepsRef.length < steps.length) {
            recipe.problem = "Il y a "+(stepsRef.length - steps.length)+" étape(s) en trop.";
        }

        recipe.score = steps.map(
            s => s.getStepParameters()
                .map(s => s.score!=null?s.score:0)
                .reduce((a, b) => Math.min(a, b), 1)
        )
        .reduce((a, b) => Math.min(a, b), 1);
        recipe.analysisLevel = level;
    }


    private static playerHasIngredient(recipe : Recipe, player : IPlayer) {
        recipe.getCookingSteps().forEach(
            s => {
                if (s.getStepParameters().length != 0) {
                    const param = s.getStepParameter(0);
                    const quantity = param.getQuantity();
                    if (quantity != null) {
                        if (!player.hasResources([quantity])) {
                            param.problem += "Il n'y a pas assez de cet ingrédient dans le stockage. ";
                        }
                    }
                }
            }
        )
    }

    private static resetScore(recipe : Recipe) {
        recipe.problem = "";
        recipe.score = null;
        recipe.getCookingSteps().forEach(
            step => {
                step.getStepParameters().forEach(param => {
                    param.problem = "";
                    param.advice = "";
                    param.score = null;
                });
            }
        );
    }

    public static scoring(actual: number, expected: number): number {
        const halfExpected = expected / 2;
        const diff = Math.abs(expected - actual);
        if (diff > halfExpected) {
            return 0;
        }
        return 1 - (diff / halfExpected);
    }
}

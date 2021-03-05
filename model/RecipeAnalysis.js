"use strict";
var RecipeAnalysis = (function () {
    function RecipeAnalysis() {
    }
    RecipeAnalysis.analyse = function (recipe, level) {
        if (!recipe.recipeRef) {
            throw "no recipeRef";
        }
        this.resetScore(recipe);
        var steps = recipe.getCookingSteps();
        var stepsRef = recipe.recipeRef.getCookingSteps();
        var index = 0;
        while (index < stepsRef.length && index < steps.length) {
            if (stepsRef[index].$type != steps[index].$type) {
                recipe.problem = "L'étape #" + (index + 1) + " devrait être " + steps[index].$type;
                return;
            }
            steps[index].analyse(stepsRef[index], level);
            index++;
        }
        if (stepsRef.length > steps.length) {
            recipe.problem = "Il manque " + (stepsRef.length - steps.length) + " étape(s).";
        }
        else if (stepsRef.length < steps.length) {
            recipe.problem = "Il y a " + (stepsRef.length - steps.length) + " étape(s) en trop.";
        }
        recipe.score = steps.map(function (s) { return s.getStepParameters()
            .map(function (s) { return s.score != null ? s.score : 0; })
            .reduce(function (a, b) { return Math.min(a, b); }, 1); })
            .reduce(function (a, b) { return Math.min(a, b); }, 1);
        recipe.analysisLevel = level;
    };
    RecipeAnalysis.resetScore = function (recipe) {
        recipe.score = null;
        recipe.problem = null;
        recipe.getCookingSteps().forEach(function (step) {
            step.getStepParameters().forEach(function (param) {
                param.problem = null;
                param.advice = null;
                param.score = null;
            });
        });
    };
    RecipeAnalysis.scoring = function (actual, expected) {
        var halfExpected = expected / 2;
        var diff = Math.abs(expected - actual);
        if (diff > halfExpected) {
            return 0;
        }
        return 1 - (diff / halfExpected);
    };
    return RecipeAnalysis;
}());
//# sourceMappingURL=RecipeAnalysis.js.map
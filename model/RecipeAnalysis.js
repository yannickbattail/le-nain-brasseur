"use strict";
var RecipeAnalysis = (function () {
    function RecipeAnalysis(recipe) {
        this.recipe = recipe;
    }
    RecipeAnalysis.prototype.compare = function () {
        var actions1 = this.recipe.recipeRef.getCookingSteps();
        var actions2 = this.recipe.getCookingSteps();
        var index = 0;
        while (index < actions1.length && index < actions2.length) {
            if (actions1[index].$type != actions2[index].$type) {
                return "L'étape #" + index + " devrait être " + actions2[index].$type;
            }
            var comp = actions1[index].compare(actions2[index]);
            if (comp !== null && comp !== "") {
                return "Problème avec l'étape #" + index + " " + comp;
            }
            index++;
        }
        if (actions1.length > actions2.length) {
            return "Il manque " + (actions1.length - actions2.length) + " étape(s).";
        }
        else if (actions1.length < actions2.length) {
            return "Il y a " + (actions1.length - actions2.length) + " étape(s) en trop.";
        }
        else {
            return "";
        }
    };
    RecipeAnalysis.prototype.analyse = function () {
        var actionsRef = this.recipe.recipeRef.getCookingSteps();
        var actions = this.recipe.getCookingSteps();
        var index = 0;
        var notes = [];
        while (index < actionsRef.length && index < actions.length) {
            if (actionsRef[index].$type != actions[index].$type) {
                return null;
            }
            var note = actionsRef[index].analyse(actions[index]);
            if (note === null) {
                return null;
            }
            notes.push(note);
            index++;
        }
        var sum = notes.reduce(function (a, b) { return a + b; }, 0);
        var avg = (sum / notes.length) || 0;
        return avg;
    };
    RecipeAnalysis.scoring = function (expected, actual) {
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
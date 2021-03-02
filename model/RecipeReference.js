"use strict";
var RecipeReference = (function () {
    function RecipeReference(name, steps) {
        if (name === void 0) { name = ""; }
        if (steps === void 0) { steps = []; }
        this.name = name;
        this.steps = steps;
        this.$type = 'RecipeReference';
    }
    RecipeReference.load = function (data) {
        var curContext = window;
        var newObj = new RecipeReference();
        newObj.name = data.name;
        newObj.steps = data.steps.map(function (p) { return curContext[p.$type].load(p); });
        return newObj;
    };
    RecipeReference.prototype.getCookingSteps = function () {
        return this.steps;
    };
    RecipeReference.prototype.getName = function () {
        return this.name;
    };
    RecipeReference.prototype.createRecipe = function () {
        var recipe = Recipe.load(JSON.parse(JSON.stringify(this)));
        recipe.name = "ma " + this.name;
        recipe.recipeRef = this;
        recipe.steps.forEach(function (s) { return s.getStepParameters().forEach(function (p) { return p.value = 0; }); });
        return recipe;
    };
    return RecipeReference;
}());
//# sourceMappingURL=RecipeReference.js.map
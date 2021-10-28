"use strict";
var RecipeReference = (function () {
    function RecipeReference(name, steps, level) {
        if (name === void 0) { name = ""; }
        if (steps === void 0) { steps = []; }
        if (level === void 0) { level = 0; }
        this.name = name;
        this.steps = steps;
        this.level = level;
        this.$type = 'RecipeReference';
    }
    RecipeReference.load = function (data) {
        var curContext = window;
        var newObj = new RecipeReference();
        newObj.name = data.name;
        newObj.level = data.level;
        newObj.steps = data.steps.map(function (p) { return curContext[p.$type].load(p); });
        return newObj;
    };
    RecipeReference.prototype.getCookingSteps = function () {
        return this.steps;
    };
    RecipeReference.prototype.getName = function () {
        return this.name;
    };
    RecipeReference.prototype.getLevel = function () {
        return this.level;
    };
    RecipeReference.prototype.createRecipe = function () {
        var recipe = Recipe.load(JSON.parse(JSON.stringify(this)));
        recipe.name = "ma " + this.name;
        recipe.recipeRef = this;
        recipe.steps.forEach(function (s) { return s.getStepParameters().forEach(function (p) {
            var _a;
            if (((_a = p.resource) === null || _a === void 0 ? void 0 : _a.getName()) != WATER.getName())
                p.value = 0;
        }); });
        return recipe;
    };
    RecipeReference.prototype.duplicate = function () {
        var recipe = Recipe.load(JSON.parse(JSON.stringify(this)));
        recipe.name = this.name + "#";
        return recipe;
    };
    return RecipeReference;
}());
//# sourceMappingURL=RecipeReference.js.map
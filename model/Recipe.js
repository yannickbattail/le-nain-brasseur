"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Recipe = (function (_super) {
    __extends(Recipe, _super);
    function Recipe(name, steps, recipeRef) {
        if (name === void 0) { name = ""; }
        if (steps === void 0) { steps = []; }
        if (recipeRef === void 0) { recipeRef = null; }
        var _this = _super.call(this, name, steps) || this;
        _this.name = name;
        _this.steps = steps;
        _this.recipeRef = recipeRef;
        _this.$type = 'Recipe';
        _this.score = null;
        _this.problem = null;
        _this.analysisLevel = AnalysisLevel.NONE;
        return _this;
    }
    Recipe.load = function (data) {
        var curContext = window;
        var name = data.name;
        var steps = data.steps.map(function (p) { return curContext[p.$type].load(p); });
        var recipeRef = data.recipeRef != null ? curContext[data.recipeRef.$type].load(data.recipeRef) : null;
        var newObj = new Recipe(name, steps, recipeRef);
        newObj.score = data.score;
        newObj.problem = data.problem;
        newObj.analysisLevel = data.analysisLevel;
        return newObj;
    };
    Recipe.prototype.getCookingSteps = function () {
        return this.steps;
    };
    Recipe.prototype.getName = function () {
        return this.name;
    };
    Recipe.prototype.hasProblem = function () {
        var prob = this.getCookingSteps().map(function (s) { return s.getStepParameters()
            .map(function (s) { return (s.problem != null && s.problem != ""); })
            .reduce(function (a, b) { return (a || b); }, false); }).reduce(function (a, b) { return (a || b); }, false);
        return prob;
    };
    return Recipe;
}(RecipeReference));
//# sourceMappingURL=Recipe.js.map
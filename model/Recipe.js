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
    function Recipe(name, steps, recipeRef, level) {
        if (name === void 0) { name = ""; }
        if (steps === void 0) { steps = []; }
        if (recipeRef === void 0) { recipeRef = null; }
        if (level === void 0) { level = 0; }
        var _this = _super.call(this, name, steps) || this;
        _this.name = name;
        _this.steps = steps;
        _this.recipeRef = recipeRef;
        _this.level = level;
        _this.$type = 'Recipe';
        _this.score = null;
        _this.problem = "";
        _this.analysisLevel = AnalysisLevel.NONE;
        return _this;
    }
    Recipe.load = function (data) {
        var curContext = window;
        var name = data.name;
        var steps = data.steps.map(function (p) { return curContext[p.$type].load(p); });
        var recipeRef = data.recipeRef != null ? curContext[data.recipeRef.$type].load(data.recipeRef) : null;
        var newObj = new Recipe(name, steps, recipeRef);
        newObj.level = data.level;
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
    Recipe.prototype.getBeer = function () {
        var _a;
        var liters = this.steps[0].getStepParameter(0).value;
        var beer = new Beer(this.name, 'l', 'beer.svg', "beer", 'Beer à partir de ' + ((_a = this.recipeRef) === null || _a === void 0 ? void 0 : _a.name), this);
        return Q(liters, beer);
    };
    Recipe.prototype.getCost = function () {
        var _a;
        var liters = this.getBeer().getQuantity() / 100;
        var cost = this.level * ((_a = this.score) !== null && _a !== void 0 ? _a : 0) * liters * 2;
        return Math.round(cost * 10) / 10;
    };
    Recipe.prototype.getArticle = function () {
        return new Article(Q(this.getCost(), GOLD), this.getBeer().opposite());
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
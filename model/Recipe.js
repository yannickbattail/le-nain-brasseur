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
    function Recipe(name, actions, recipeRef) {
        if (name === void 0) { name = ""; }
        if (actions === void 0) { actions = []; }
        var _this = _super.call(this, name, actions) || this;
        _this.name = name;
        _this.actions = actions;
        _this.recipeRef = recipeRef;
        _this.$type = 'Recipe';
        return _this;
    }
    Recipe.load = function (data) {
        var curContext = window;
        var name = data.name;
        var actions = data.actions.map(function (p) { return curContext[p.$type].load(p); });
        var recipeRef = curContext[data.recipeRef.$type].load(data.recipeRef);
        var newObj = new Recipe(name, actions, recipeRef);
        return newObj;
    };
    Recipe.prototype.getCookingSteps = function () {
        return this.actions;
    };
    Recipe.prototype.getName = function () {
        return this.name;
    };
    return Recipe;
}(RecipeReference));
//# sourceMappingURL=Recipe.js.map
"use strict";
var Recipe = (function () {
    function Recipe(name, actions) {
        this.name = name;
        this.actions = actions;
        this.$type = 'Recipe';
    }
    Recipe.prototype.getActions = function () {
        return this.actions;
    };
    Recipe.prototype.getName = function () {
        return this.name;
    };
    return Recipe;
}());
//# sourceMappingURL=Recipe.js.map
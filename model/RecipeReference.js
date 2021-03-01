"use strict";
var RecipeReference = (function () {
    function RecipeReference(name, actions) {
        if (name === void 0) { name = ""; }
        if (actions === void 0) { actions = []; }
        this.name = name;
        this.actions = actions;
        this.$type = 'RecipeReference';
    }
    RecipeReference.load = function (data) {
        var curContext = window;
        var newObj = new RecipeReference();
        newObj.name = data.name;
        newObj.actions = data.actions.map(function (p) { return curContext[p.$type].load(p); });
        return newObj;
    };
    RecipeReference.prototype.getCookingSteps = function () {
        return this.actions;
    };
    RecipeReference.prototype.getName = function () {
        return this.name;
    };
    return RecipeReference;
}());
//# sourceMappingURL=RecipeReference.js.map
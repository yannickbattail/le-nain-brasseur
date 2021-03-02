"use strict";
var Brew = (function () {
    function Brew(name, recipe) {
        if (name === void 0) { name = ""; }
        this.name = name;
        this.recipe = recipe;
        this.$type = 'Recipe';
    }
    Brew.load = function (data) {
        var curContext = window;
        var recipe = curContext[data.recipe.$type].load(data.recipe);
        var newObj = new Brew(data.name, recipe);
        return newObj;
    };
    Brew.prototype.getName = function () {
        return this.name;
    };
    return Brew;
}());
//# sourceMappingURL=Brew.js.map
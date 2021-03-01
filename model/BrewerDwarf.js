"use strict";
var BrewerDwarf = (function () {
    function BrewerDwarf() {
        this.$type = 'BrewerDwarf';
        this.tickInterval = 100;
        this.fastMode = 0;
        this.saveCallback = function () { };
        this.status = BrewerDwarfStatus.NOT_YET_STARTED;
        this.player = new Player("");
        this.recipes = new Array();
        this.intervalId = 0;
    }
    BrewerDwarf.load = function (data) {
        var curContext = window;
        var newObj = new BrewerDwarf();
        newObj.tickInterval = data.tickInterval;
        newObj.status = data.status;
        newObj.player = curContext[data.player.$type].load(data.player);
        newObj.recipes = data.recipes.map(function (p) { return curContext[p.$type].load(p); });
        newObj.fastMode = data.fastMode;
        return newObj;
    };
    BrewerDwarf.prototype.brew = function (recipeName) {
        var recipe = this.getRecipeNameByName(recipeName);
    };
    BrewerDwarf.prototype.getRecipeNameByName = function (recipeName) {
        var recipes = this.recipes.filter(function (src) { return src.getName() == recipeName; });
        if (recipes.length == 0) {
            return null;
        }
        return recipes[0];
    };
    BrewerDwarf.prototype.run = function (tickInterval, saveCallback) {
        var _this = this;
        this.tickInterval = tickInterval;
        this.saveCallback = saveCallback;
        if (this.status == BrewerDwarfStatus.NOT_YET_STARTED) {
            this.status = BrewerDwarfStatus.IN_PROGRESS;
        }
        this.intervalId = window.setInterval(function () { return _this.onTick(); }, this.tickInterval);
    };
    BrewerDwarf.prototype.stop = function () {
        window.clearInterval(this.intervalId);
    };
    BrewerDwarf.prototype.onTick = function () {
        if (this.status == BrewerDwarfStatus.LOOSE || this.status == BrewerDwarfStatus.WIN) {
            console.log("Status is " + this.status + ", STOP");
            this.stop();
        }
        this.saveCallback(this);
    };
    return BrewerDwarf;
}());
//# sourceMappingURL=BrewerDwarf.js.map
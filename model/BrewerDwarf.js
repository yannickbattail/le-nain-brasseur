"use strict";
var BrewerDwarf = (function () {
    function BrewerDwarf() {
        this.$type = 'BrewerDwarf';
        this.tickInterval = 100;
        this.fastMode = 0;
        this.saveCallback = function () { };
        this.status = BrewerDwarfStatus.NOT_YET_STARTED;
        this.player = new Player("");
        this.intervalId = 0;
    }
    BrewerDwarf.load = function (data) {
        var curContext = window;
        var newObj = new BrewerDwarf();
        newObj.tickInterval = data.tickInterval;
        newObj.status = data.status;
        newObj.player = curContext[data.player.$type].load(data.player);
        newObj.fastMode = data.fastMode;
        return newObj;
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
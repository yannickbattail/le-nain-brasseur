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
var Brew = (function (_super) {
    __extends(Brew, _super);
    function Brew(duration) {
        if (duration === void 0) { duration = 0; }
        var _this = _super.call(this) || this;
        _this.duration = duration;
        _this.$type = 'Heat';
        return _this;
    }
    Brew.prototype.getName = function () {
        return "Fermenter";
    };
    Brew.prototype.getImage = function () {
        return "boiling-bubbles.svg";
    };
    Brew.prototype.compare = function (action) {
        if (this.$type != action.$type) {
            return "L'étape devrait être " + this.$type;
        }
        var addIngredient = action;
        return this.compareHeat(addIngredient);
    };
    Brew.prototype.compareHeat = function (action) {
        if (this.duration > action.duration) {
            return "La fermentation est trop courte";
        }
        if (this.duration < action.duration) {
            return "La fermentation est trop longue";
        }
        return "";
    };
    Brew.prototype.analyse = function (action) {
        if (action instanceof Brew) {
            this.analyseBrew(action);
        }
        return null;
    };
    Brew.prototype.analyseBrew = function (action) {
        return this.notation(this.duration, action.duration);
    };
    return Brew;
}(CookingAction));
//# sourceMappingURL=Brew.js.map
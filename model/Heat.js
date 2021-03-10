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
var Heat = (function (_super) {
    __extends(Heat, _super);
    function Heat(duration, degrees) {
        if (duration === void 0) { duration = 0; }
        if (degrees === void 0) { degrees = 0; }
        var _this = _super.call(this) || this;
        _this.duration = duration;
        _this.degrees = degrees;
        _this.$type = 'Heat';
        return _this;
    }
    Heat.prototype.getName = function () {
        return "Chauffer";
    };
    Heat.prototype.getImage = function () {
        return "camp-cooking-pot.svg";
    };
    Heat.prototype.compare = function (action) {
        if (action instanceof Heat) {
            return "L'étape devrait être " + this.$type;
        }
        if (this.$type != action.$type) {
            return "L'étape devrait être " + this.$type;
        }
        var addIngredient = action;
        return this.compareHeat(addIngredient);
    };
    Heat.prototype.compareHeat = function (action) {
        if (this.degrees > action.degrees) {
            return "La cuisson n'est pas assez chaude";
        }
        if (this.degrees < action.degrees) {
            return "La cuisson est trop chaude";
        }
        if (this.duration > action.duration) {
            return "La cuisson est trop courte";
        }
        if (this.duration < action.duration) {
            return "La cuisson est trop longue";
        }
        return "";
    };
    Heat.prototype.analyse = function (action) {
        if (action instanceof Heat) {
            this.analyseHeat(action);
        }
        return null;
    };
    Heat.prototype.analyseHeat = function (action) {
        var degreeNote = this.notation(this.degrees, action.degrees);
        var durationNote = this.notation(this.duration, action.duration);
        return Math.min(degreeNote, durationNote);
    };
    return Heat;
}(CookingAction));
//# sourceMappingURL=Heat.js.map
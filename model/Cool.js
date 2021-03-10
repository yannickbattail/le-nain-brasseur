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
var Cool = (function (_super) {
    __extends(Cool, _super);
    function Cool(degrees) {
        if (degrees === void 0) { degrees = 0; }
        var _this = _super.call(this) || this;
        _this.degrees = degrees;
        _this.$type = 'Heat';
        return _this;
    }
    Cool.prototype.getName = function () {
        return "Refroidir";
    };
    Cool.prototype.getImage = function () {
        return "cool.svg";
    };
    Cool.prototype.compare = function (action) {
        if (this.$type != action.$type) {
            return "L'étape devrait être " + this.$type;
        }
        var addIngredient = action;
        return this.compareHeat(addIngredient);
    };
    Cool.prototype.compareHeat = function (action) {
        if (this.degrees > action.degrees) {
            return "Le rafraichissement est trop important";
        }
        if (this.degrees < action.degrees) {
            return "Le rafraichissement est trop faible";
        }
        return "";
    };
    Cool.prototype.analyse = function (action) {
        if (action instanceof Cool) {
            this.analyseCool(action);
        }
        return null;
    };
    Cool.prototype.analyseCool = function (action) {
        return this.notation(this.degrees, action.degrees);
    };
    return Cool;
}(CookingAction));
//# sourceMappingURL=Cool.js.map
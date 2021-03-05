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
var Filtering = (function (_super) {
    __extends(Filtering, _super);
    function Filtering(stepParameters) {
        if (stepParameters === void 0) { stepParameters = []; }
        var _this = _super.call(this, stepParameters) || this;
        _this.$type = 'Filtering';
        _this.validate();
        return _this;
    }
    Filtering.load = function (data) {
        var curContext = window;
        var stepParameters = data.stepParameters.map(function (p) { return curContext[p.$type].load(p); });
        var newObj = new Filtering(stepParameters);
        return newObj;
    };
    Filtering.prototype.getStepParameters = function () {
        return this.stepParameters;
    };
    Filtering.prototype.getStepParameter = function (index) {
        throw "Filter has no StepParameter.";
    };
    Filtering.prototype.validate = function () {
        if (this.stepParameters.length != 0) {
            throw "Brewing should have no StepParameter.";
        }
    };
    Filtering.prototype.getName = function () {
        return "Filtrer";
    };
    Filtering.prototype.getImage = function () {
        return "strainer.svg";
    };
    Filtering.prototype.analyse = function (action, level) {
        if (this.$type != action.$type) {
        }
    };
    return Filtering;
}(CookingStep));
//# sourceMappingURL=Filtering.js.map
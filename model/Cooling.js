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
var Cooling = (function (_super) {
    __extends(Cooling, _super);
    function Cooling(stepParameters) {
        if (stepParameters === void 0) { stepParameters = []; }
        var _this = _super.call(this, stepParameters) || this;
        _this.$type = 'Cooling';
        _this.validate();
        return _this;
    }
    Cooling.load = function (data) {
        var curContext = window;
        var stepParameters = data.stepParameters.map(function (p) { return curContext[p.$type].load(p); });
        var newObj = new Cooling(stepParameters);
        return newObj;
    };
    Cooling.prototype.getName = function () {
        return "Refroidir";
    };
    Cooling.prototype.getImage = function () {
        return "cool.svg";
    };
    Cooling.prototype.getStepParameters = function () {
        return this.stepParameters;
    };
    Cooling.prototype.getStepParameter = function (index) {
        if (index != 0) {
            throw "Cool has only one StepParameter.";
        }
        return this.stepParameters[index];
    };
    Cooling.prototype.validate = function () {
        if (this.stepParameters.length != 1) {
            throw "Cool should have only one StepParameter.";
        }
        if (this.stepParameters[0].name != "température") {
            throw "stepParameters name should be température";
        }
        if (this.stepParameters[0].resource != null) {
            throw "StepParameter should have not a resource.";
        }
    };
    Cooling.prototype.analyse = function (action) {
        if (this.$type != action.$type) {
            return "L'étape devrait être " + this.getName();
        }
        if (action instanceof Cooling) {
            this.analyseStep(this.getStepParameter(0), action.getStepParameter(0), "La température est trop chaude", "La température n'est pas assez chaude");
        }
    };
    return Cooling;
}(CookingStep));
//# sourceMappingURL=Cooling.js.map
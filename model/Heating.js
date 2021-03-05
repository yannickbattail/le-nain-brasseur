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
var Heating = (function (_super) {
    __extends(Heating, _super);
    function Heating(stepParameters) {
        if (stepParameters === void 0) { stepParameters = []; }
        var _this = _super.call(this, stepParameters) || this;
        _this.$type = 'Heating';
        _this.validate();
        return _this;
    }
    Heating.load = function (data) {
        var curContext = window;
        var stepParameters = data.stepParameters.map(function (p) { return curContext[p.$type].load(p); });
        var newObj = new Heating(stepParameters);
        return newObj;
    };
    Heating.prototype.getName = function () {
        return "Chauffer";
    };
    Heating.prototype.getImage = function () {
        return "camp-cooking-pot.svg";
    };
    Heating.prototype.getStepParameters = function () {
        return this.stepParameters;
    };
    Heating.prototype.getStepParameter = function (index) {
        if (index != 0 && index != 1) {
            throw "Heat has 2 StepParameters.";
        }
        return this.stepParameters[index];
    };
    Heating.prototype.validate = function () {
        if (this.stepParameters.length != 2) {
            throw "Heat should have 2 StepParameters.";
        }
        if (this.stepParameters[0].name != "température") {
            throw "stepParameters name should be température";
        }
        if (this.stepParameters[1].name != "durée") {
            throw "stepParameters name should be durée";
        }
        if (this.stepParameters[0].resource != null
            || this.stepParameters[1].resource != null) {
            throw "StepParameter should have not a resource.";
        }
    };
    Heating.prototype.analyse = function (action, level) {
        if (this.$type != action.$type) {
            this.getStepParameter(0).problem = "L'étape devrait être " + this.getName();
        }
        if (action instanceof Heating) {
            this.analyseStep(this.getStepParameter(0), action.getStepParameter(0), level, "La température est trop chaude", "La température n'est pas assez chaude");
            this.analyseStep(this.getStepParameter(1), action.getStepParameter(1), level, "La cuisson est trop longue", "La cuisson est trop courte");
        }
    };
    return Heating;
}(CookingStep));
//# sourceMappingURL=Heating.js.map
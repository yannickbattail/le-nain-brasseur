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
var Brewing = (function (_super) {
    __extends(Brewing, _super);
    function Brewing(stepParameters) {
        if (stepParameters === void 0) { stepParameters = []; }
        var _this = _super.call(this, stepParameters) || this;
        _this.$type = 'Brewing';
        _this.validate();
        return _this;
    }
    Brewing.load = function (data) {
        var curContext = window;
        var stepParameters = data.stepParameters.map(function (p) { return curContext[p.$type].load(p); });
        var newObj = new Brewing(stepParameters);
        return newObj;
    };
    Brewing.prototype.getName = function () {
        return "Fermenter";
    };
    Brewing.prototype.getImage = function () {
        return "boiling-bubbles.svg";
    };
    Brewing.prototype.getStepParameters = function () {
        return this.stepParameters;
    };
    Brewing.prototype.getStepParameter = function (index) {
        if (index != 1) {
            throw "Brewing has only one StepParameter.";
        }
        return this.stepParameters[index];
    };
    Brewing.prototype.validate = function () {
        if (this.stepParameters.length != 1) {
            throw "Brewing should have only one StepParameter.";
        }
        if (this.stepParameters[0].name == "durée") {
            throw "stepParameters name should be durée";
        }
        if (this.stepParameters[0].resource != null) {
            throw "StepParameter should have not a resource.";
        }
    };
    Brewing.prototype.compare = function (action) {
        if (this.$type != action.$type) {
            return "L'étape devrait être " + this.getName();
        }
        var addIngredient = action;
        return this.compareHeat(addIngredient);
    };
    Brewing.prototype.compareHeat = function (action) {
        if (this.getStepParameter(0).value > action.getStepParameter(0).value) {
            return "La fermentation est trop courte";
        }
        if (this.getStepParameter(0).value < action.getStepParameter(0).value) {
            return "La fermentation est trop longue";
        }
        return "";
    };
    Brewing.prototype.analyse = function (action) {
        if (action instanceof Brewing) {
            this.analyseBrewing(action);
        }
        return null;
    };
    Brewing.prototype.analyseBrewing = function (action) {
        return RecipeAnalysis.scoring(this.getStepParameter(0).value, action.getStepParameter(0).value);
    };
    return Brewing;
}(CookingStep));
//# sourceMappingURL=Brewing.js.map
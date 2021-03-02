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
var AddingIngredient = (function (_super) {
    __extends(AddingIngredient, _super);
    function AddingIngredient(stepParameters) {
        if (stepParameters === void 0) { stepParameters = []; }
        var _this = _super.call(this, stepParameters) || this;
        _this.$type = 'AddingIngredient';
        _this.validate();
        return _this;
    }
    AddingIngredient.load = function (data) {
        var curContext = window;
        var stepParameters = data.stepParameters.map(function (p) { return curContext[p.$type].load(p); });
        var newObj = new AddingIngredient(stepParameters);
        return newObj;
    };
    AddingIngredient.prototype.getName = function () {
        return "Ajout un ingrédient";
    };
    AddingIngredient.prototype.getImage = function () {
        return "AddIngredient.svg";
    };
    AddingIngredient.prototype.getResource = function () {
        return this.stepParameters[0].resource ? this.stepParameters[0].resource : new Resource("nothing");
    };
    AddingIngredient.prototype.getQuantity = function () {
        return Q(this.stepParameters[0].value, this.getResource());
    };
    AddingIngredient.prototype.getStepParameters = function () {
        return this.stepParameters;
    };
    AddingIngredient.prototype.getStepParameter = function (index) {
        if (index != 0) {
            throw "AddIngredient has only one StepParameter.";
        }
        return this.stepParameters[index];
    };
    AddingIngredient.prototype.validate = function () {
        if (this.stepParameters.length != 1) {
            throw "AddIngredient should have only one StepParameter.";
        }
        if (this.stepParameters[0].name != "quantité") {
            throw "stepParameters name should be quantité";
        }
        if (this.stepParameters[0].resource == null) {
            throw "StepParameter should have a resource.";
        }
    };
    AddingIngredient.prototype.analyse = function (action) {
        if (this.$type != action.$type) {
            return "L'étape devrait être " + this.getName();
        }
        if (action instanceof AddingIngredient) {
            this.analyseStep(this.getStepParameter(0), action.getStepParameter(0), "Il y a trop d'ingrédient", "Il y n'a pas assez d'ingrédient", true);
        }
    };
    return AddingIngredient;
}(CookingStep));
//# sourceMappingURL=AddingIngredient.js.map
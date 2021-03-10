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
var AddIngredient = (function (_super) {
    __extends(AddIngredient, _super);
    function AddIngredient(quantity) {
        var _this = _super.call(this) || this;
        _this.quantity = quantity;
        _this.$type = 'AddIngredient';
        return _this;
    }
    AddIngredient.prototype.getName = function () {
        return "Ajout un ingrédient";
    };
    AddIngredient.prototype.getImage = function () {
        return "AddIngredient.svg";
    };
    AddIngredient.prototype.compare = function (action) {
        if (this.$type != action.$type) {
            return "L'étape devrait être " + this.$type;
        }
        var addIngredient = action;
        return this.compareAddIngredient(addIngredient);
    };
    AddIngredient.prototype.compareAddIngredient = function (action) {
        if (this.quantity.getResource().getName() != action.quantity.getResource().getName()) {
            return "Ingredient n'est pas le bon, il devrait être: " + this.quantity.getResource().getName();
        }
        if (this.quantity > action.quantity) {
            return "Il y n'a pas assez de " + this.quantity.getResource().getName();
        }
        if (this.quantity < action.quantity) {
            return "Il y a trop de " + this.quantity.getResource().getName();
        }
        return "";
    };
    AddIngredient.prototype.analyse = function (action) {
        if (action instanceof AddIngredient) {
            this.analyseAddIngredient(action);
        }
        return null;
    };
    AddIngredient.prototype.analyseAddIngredient = function (action) {
        if (this.quantity.getResource().getName() != action.quantity.getResource().getName()) {
            return 0;
        }
        return this.notation(this.quantity.getQuantity(), action.quantity.getQuantity());
    };
    return AddIngredient;
}(CookingAction));
//# sourceMappingURL=AddIngredient.js.map
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
var Beer = (function (_super) {
    __extends(Beer, _super);
    function Beer(name, unit, image, category, description, recipe) {
        var _this = _super.call(this, name, unit, image, category, description) || this;
        _this.name = name;
        _this.unit = unit;
        _this.image = image;
        _this.category = category;
        _this.description = description;
        _this.recipe = recipe;
        _this.$type = 'Beer';
        return _this;
    }
    Beer.load = function (data) {
        var curContext = window;
        var recipe = curContext[data.recipe.$type].load(data.recipe);
        var r = new Beer(data.name, data.unit, data.image, data.category, data.description, recipe);
        return r;
    };
    Beer.prototype.show = function (quantity) {
        var u = this.unit;
        var q = quantity;
        if (u == 'g') {
            if (quantity >= 1000000) {
                u = 'T';
                q = Math.round(q / 10000) / 100;
            }
            else if (quantity >= 1000) {
                u = 'kg';
                q = Math.round(q / 100) / 10;
            }
        }
        if (u == 'cl') {
            if (quantity >= 100) {
                u = 'l';
                q = Math.round(q / 10) / 10;
            }
        }
        return q + u;
    };
    return Beer;
}(CategorizedMaterial));
//# sourceMappingURL=Beer.js.map
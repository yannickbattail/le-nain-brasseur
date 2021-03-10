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
var CategorizedItem = (function (_super) {
    __extends(CategorizedItem, _super);
    function CategorizedItem(name, image, category, description) {
        var _this = _super.call(this, name) || this;
        _this.name = name;
        _this.image = image;
        _this.category = category;
        _this.description = description;
        _this.$type = 'CategorizedItem';
        return _this;
    }
    CategorizedItem.load = function (data) {
        var r = new CategorizedItem(data.name, data.image, data.category, data.description);
        return r;
    };
    CategorizedItem.prototype.show = function (quantity) {
        return "" + quantity;
    };
    return CategorizedItem;
}(Resource));
//# sourceMappingURL=CategorizedItem.js.map
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
var Filter = (function (_super) {
    __extends(Filter, _super);
    function Filter() {
        var _this = _super.call(this) || this;
        _this.$type = 'Heat';
        return _this;
    }
    Filter.prototype.getName = function () {
        return "Filtrer";
    };
    Filter.prototype.getImage = function () {
        return "strainer.svg";
    };
    Filter.prototype.compare = function (action) {
        if (this.$type != action.$type) {
            return "L'étape devrait être " + this.$type;
        }
        return "";
    };
    Filter.prototype.compareFilter = function (action) {
        return "";
    };
    Filter.prototype.analyse = function (action) {
        if (action instanceof Filter) {
            this.analyseFilter(action);
        }
        return null;
    };
    Filter.prototype.analyseFilter = function (action) {
        return 1;
    };
    return Filter;
}(CookingAction));
//# sourceMappingURL=Filter.js.map
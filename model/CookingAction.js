"use strict";
var CookingAction = (function () {
    function CookingAction() {
    }
    CookingAction.prototype.notation = function (val1, val2) {
        var degreeDiff = Math.abs(val1 - val2);
        if (degreeDiff > val1 / 2) {
            return 0;
        }
        return (val1 / 2 - degreeDiff) / degreeDiff;
    };
    return CookingAction;
}());
//# sourceMappingURL=CookingAction.js.map
"use strict";
var StepParameter = (function () {
    function StepParameter(name, value, resource, problem, advice, score) {
        if (resource === void 0) { resource = null; }
        if (problem === void 0) { problem = null; }
        if (advice === void 0) { advice = null; }
        if (score === void 0) { score = null; }
        this.name = name;
        this.value = value;
        this.resource = resource;
        this.problem = problem;
        this.advice = advice;
        this.score = score;
        this.$type = 'StepParameter';
    }
    StepParameter.load = function (data) {
        var curContext = window;
        var newObj = new StepParameter(data.name, data.value);
        newObj.resource = data.resource != null ? curContext[data.resource.$type].load(data.resource) : null;
        newObj.problem = data.problem;
        newObj.advice = data.advice;
        newObj.score = data.score;
        return newObj;
    };
    StepParameter.prototype.getName = function () {
        return this.name;
    };
    StepParameter.prototype.getValue = function () {
        return this.value;
    };
    return StepParameter;
}());
//# sourceMappingURL=StepParameter.js.map
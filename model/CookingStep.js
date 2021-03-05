"use strict";
var CookingStep = (function () {
    function CookingStep(stepParameters) {
        if (stepParameters === void 0) { stepParameters = []; }
        this.stepParameters = stepParameters;
        this.score = null;
    }
    CookingStep.prototype.getQuantity = function () {
        if (this.stepParameters.length == 0) {
            return null;
        }
        return this.stepParameters[0].getQuantity();
    };
    CookingStep.prototype.analyseStep = function (step, stepRef, level, tooHighMsg, tooLowMsg, analyseResource) {
        var _a, _b, _c;
        if (analyseResource === void 0) { analyseResource = false; }
        if (level == AnalysisLevel.NONE) {
            return;
        }
        if (analyseResource && ((_a = step.resource) === null || _a === void 0 ? void 0 : _a.getName()) != ((_b = stepRef.resource) === null || _b === void 0 ? void 0 : _b.getName())) {
            step.problem += "Ingredient n'est pas le bon, il devrait être: " + ((_c = this.getStepParameter(0).resource) === null || _c === void 0 ? void 0 : _c.getName());
        }
        if (step.value < stepRef.value) {
            if (step.value < stepRef.value / 2) {
                step.problem += tooLowMsg;
            }
            else {
                if (level == AnalysisLevel.ADVISE) {
                    step.advice += tooLowMsg;
                }
            }
        }
        if (step.value > stepRef.value) {
            if (step.value > stepRef.value + stepRef.value / 2) {
                step.problem += tooHighMsg;
            }
            else {
                if (level == AnalysisLevel.ADVISE) {
                    step.advice += tooHighMsg;
                }
            }
        }
        if (level >= AnalysisLevel.SCORE) {
            step.score = RecipeAnalysis.scoring(step.value, stepRef.value);
        }
    };
    return CookingStep;
}());
//# sourceMappingURL=CookingStep.js.map
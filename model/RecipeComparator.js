"use strict";
var RecipeComparator = (function () {
    function RecipeComparator(recipe1, recipe2) {
        this.recipe1 = recipe1;
        this.recipe2 = recipe2;
    }
    RecipeComparator.prototype.compare = function () {
        var actions1 = this.recipe1.getActions();
        var actions2 = this.recipe2.getActions();
        var index = 0;
        while (index < actions1.length && index < actions2.length) {
            if (actions1[index].$type != actions2[index].$type) {
                return "L'étape #" + index + " devrait être " + actions2[index].$type;
            }
            var comp = actions1[index].compare(actions2[index]);
            if (comp !== null && comp !== "") {
                return "Problème avec l'étape #" + index + " " + comp;
            }
            index++;
        }
        if (actions1.length > actions2.length) {
            return "Il manque " + (actions1.length - actions2.length) + " étape(s).";
        }
        else if (actions1.length < actions2.length) {
            return "Il y a " + (actions1.length - actions2.length) + " étape(s) en trop.";
        }
        else {
            return "";
        }
    };
    RecipeComparator.prototype.analyse = function () {
        var actions1 = this.recipe1.getActions();
        var actions2 = this.recipe2.getActions();
        var index = 0;
        var notes = [];
        while (index < actions1.length && index < actions2.length) {
            if (actions1[index].$type != actions2[index].$type) {
                return null;
            }
            var note = actions1[index].analyse(actions2[index]);
            if (note === null) {
                return null;
            }
            notes.push(note);
            index++;
        }
        var sum = notes.reduce(function (a, b) { return a + b; }, 0);
        var avg = (sum / notes.length) || 0;
        return avg;
    };
    return RecipeComparator;
}());
//# sourceMappingURL=RecipeComparator.js.map
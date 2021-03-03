"use strict";
var BrewerDwarf = (function () {
    function BrewerDwarf() {
        this.$type = 'BrewerDwarf';
        this.tickInterval = 100;
        this.fastMode = 0;
        this.saveCallback = function () { };
        this.status = BrewerDwarfStatus.NOT_YET_STARTED;
        this.player = new Player("");
        this.recipes = new Array();
        this.intervalId = 0;
    }
    BrewerDwarf.load = function (data) {
        var curContext = window;
        var newObj = new BrewerDwarf();
        newObj.tickInterval = data.tickInterval;
        newObj.status = data.status;
        newObj.player = curContext[data.player.$type].load(data.player);
        newObj.recipes = data.recipes.map(function (p) { return curContext[p.$type].load(p); });
        newObj.fastMode = data.fastMode;
        return newObj;
    };
    BrewerDwarf.prototype.brew = function () {
        if (confirm("Si la recette est n'a pas de problème, les ingrédient seront décomptés. Continuer ?")) {
            var recipe = this.player.getBrewingRecipe();
            if (recipe != null) {
                this.loadRecipe(recipe);
                RecipeAnalysis.analyse(recipe);
                if (!BrewerDwarf.hasProblem(recipe)) {
                    console.log('doBrew');
                    this.doBrew(recipe);
                }
            }
        }
    };
    BrewerDwarf.prototype.analyseBrew = function () {
        var recipe = this.player.getBrewingRecipe();
        if (recipe != null) {
            this.loadRecipe(recipe);
            RecipeAnalysis.analyse(recipe);
        }
    };
    BrewerDwarf.prototype.doBrew = function (recipe) {
        var _this = this;
        var _a;
        recipe.getCookingSteps()
            .map(function (s) { return (s instanceof AddingIngredient) ? s : null; })
            .forEach(function (s) {
            if (s != null) {
                _this.player.decreaseStorage(s.getQuantity());
            }
        });
        var liters = recipe.steps[0].getStepParameter(0).value;
        var beer = new Beer(recipe.name, 'l', 'beer.svg', "beer", 'Beer à partir de ' + ((_a = recipe.recipeRef) === null || _a === void 0 ? void 0 : _a.name), recipe);
        this.player.increaseStorage(Q(liters, beer));
        this.player.setBrewingRecipe(null);
        this.player.getRecipes().push(recipe);
    };
    BrewerDwarf.hasProblem = function (recipe) {
        var prob = recipe.getCookingSteps().map(function (s) { return s.getStepParameters()
            .map(function (s) { return s.score == null || s.score == 0 || (s.problem != null && s.problem != ""); })
            .reduce(function (a, b) { return (a || b); }, false); }).reduce(function (a, b) { return (a || b); }, false);
        return prob;
    };
    BrewerDwarf.prototype.loadRecipe = function (recipe) {
        var _this = this;
        recipe.name = this.val("recipeName");
        recipe.getCookingSteps().forEach(function (step, stepIndex) {
            step.getStepParameters().forEach(function (param, paramIndex) {
                param.value = parseFloat(_this.val(stepIndex + "_" + paramIndex + "_" + param.name));
                if (param.name == "durée") {
                    param.value *= 60 * 1000;
                }
                if (param.name == "jour") {
                    param.value *= 24 * 3600 * 1000;
                }
            });
        });
    };
    BrewerDwarf.prototype.val = function (id) {
        var elem = document.getElementById(id);
        if (elem != null && elem instanceof HTMLInputElement) {
            if (!elem.value) {
                throw "no value  for " + id + " " + elem.value;
            }
            return elem.value;
        }
        throw "no value for " + id;
    };
    BrewerDwarf.prototype.prepareBrew = function (recipeName) {
        var recipeRef = engine.getRecipeNameByName(recipeName);
        if (recipeRef == null) {
            throw "recette " + recipeName + " non dispo";
        }
        this.player.setBrewingRecipe(recipeRef.createRecipe());
    };
    BrewerDwarf.prototype.reprepareBrew = function (recipeName) {
        var recipe = engine.player.getRecipeNameByName(recipeName);
        if (recipe == null) {
            throw "recette " + recipeName + " non dispo";
        }
        this.player.setBrewingRecipe(recipe);
    };
    BrewerDwarf.prototype.getRecipeNameByName = function (recipeName) {
        var recipes = this.recipes.filter(function (src) { return src.getName() == recipeName; });
        if (recipes.length == 0) {
            return null;
        }
        return recipes[0];
    };
    BrewerDwarf.prototype.run = function (tickInterval, saveCallback) {
        var _this = this;
        this.tickInterval = tickInterval;
        this.saveCallback = saveCallback;
        if (this.status == BrewerDwarfStatus.NOT_YET_STARTED) {
            this.status = BrewerDwarfStatus.IN_PROGRESS;
        }
        this.intervalId = window.setInterval(function () { return _this.onTick(); }, this.tickInterval);
    };
    BrewerDwarf.prototype.stop = function () {
        window.clearInterval(this.intervalId);
    };
    BrewerDwarf.prototype.onTick = function () {
        if (this.status == BrewerDwarfStatus.LOOSE || this.status == BrewerDwarfStatus.WIN) {
            console.log("Status is " + this.status + ", STOP");
            this.stop();
        }
        this.saveCallback(this);
    };
    return BrewerDwarf;
}());
//# sourceMappingURL=BrewerDwarf.js.map
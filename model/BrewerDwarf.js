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
                RecipeAnalysis.analyse(recipe, this.player, AnalysisLevel.PROBLEM);
                if (!recipe.hasProblem()) {
                    RecipeAnalysis.analyse(recipe, this.player, AnalysisLevel.SCORE);
                    console.log('doBrew');
                    this.doBrew(recipe);
                }
            }
        }
    };
    BrewerDwarf.prototype.checkBrew = function () {
        var recipe = this.player.getBrewingRecipe();
        if (recipe != null) {
            this.loadRecipe(recipe);
            RecipeAnalysis.analyse(recipe, this.player, AnalysisLevel.PROBLEM);
        }
    };
    BrewerDwarf.prototype.advise = function () {
        var recipe = this.player.getBrewingRecipe();
        if (recipe != null) {
            this.loadRecipe(recipe);
            if (!this.player.hasResources([ADVISE_COST])) {
                recipe.problem = "Pas assez d'or pour acheter les conseils d'un maistre brasseur.";
                return;
            }
            this.player.decreaseStorage(ADVISE_COST);
            RecipeAnalysis.analyse(recipe, this.player, AnalysisLevel.ADVISE);
        }
    };
    BrewerDwarf.prototype.brewHasIngredient = function (recipe) {
        var ingredientList = recipe.getCookingSteps().map(function (s) { return s.getQuantity(); }).filter(function (q) { return q != null; });
        return this.player.hasResources(ingredientList);
    };
    BrewerDwarf.prototype.doBrew = function (recipe) {
        var _this = this;
        var _a;
        recipe.getCookingSteps()
            .forEach(function (s) {
            if (s != null) {
                var q = s.getQuantity();
                if (q != null) {
                    _this.player.decreaseStorage(q);
                }
            }
        });
        var liters = recipe.steps[0].getStepParameter(0).value;
        var beer = new Beer(recipe.name, 'l', 'beer.svg', "beer", 'Beer à partir de ' + ((_a = recipe.recipeRef) === null || _a === void 0 ? void 0 : _a.name), recipe);
        this.player.increaseStorage(Q(liters, beer));
        var maltStep = recipe.steps.filter(function (s) { var _a, _b; return ((_b = (_a = s.getStepParameters()[0]) === null || _a === void 0 ? void 0 : _a.resource) === null || _b === void 0 ? void 0 : _b.getName()) == MALT.getName(); });
        this.player.increaseStorage(Q(maltStep[0].getStepParameters()[0].value, DRECHE));
        this.player.setBrewingRecipe(null);
        this.player.getRecipes().push(recipe);
    };
    BrewerDwarf.prototype.loadRecipe = function (recipe) {
        var _this = this;
        recipe.name = this.val("recipeName");
        recipe.getCookingSteps().forEach(function (step, stepIndex) {
            step.getStepParameters().forEach(function (param, paramIndex) { return param.value = parseFloat(_this.val(stepIndex + "_" + paramIndex + "_" + param.name)); });
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
        this.player.setBrewingRecipe(recipe.duplicate());
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
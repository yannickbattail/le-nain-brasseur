"use strict";
var Player = (function () {
    function Player(name) {
        this.name = name;
        this.$type = 'Player';
        this.preventNegativeStorage = false;
        this.storage = new Array();
        this.recipes = new Array();
        this.brewingRecipe = null;
    }
    Player.load = function (data) {
        var curContext = window;
        var player = new Player(data.name);
        player.preventNegativeStorage = data.preventNegativeStorage;
        player.storage = data.storage.map(function (p) { return curContext[p.$type].load(p); });
        player.recipes = data.recipes.map(function (p) { return curContext[p.$type].load(p); });
        player.brewingRecipe = data.brewingRecipe != null ? curContext[data.brewingRecipe.$type].load(data.brewingRecipe) : null;
        return player;
    };
    Player.prototype.getName = function () {
        return this.name;
    };
    Player.prototype.getStorage = function () {
        return this.storage;
    };
    Player.prototype.getRecipes = function () {
        return this.recipes;
    };
    Player.prototype.setRecipes = function (recipes) {
        this.recipes = recipes;
        return this;
    };
    Player.prototype.getBrewingRecipe = function () {
        return this.brewingRecipe;
    };
    Player.prototype.setBrewingRecipe = function (brewingRecipe) {
        this.brewingRecipe = brewingRecipe;
        return this;
    };
    Player.prototype.getPreventNegativeStorage = function () {
        return this.preventNegativeStorage;
    };
    Player.prototype.setPreventNegativeStorage = function (preventNegativeStorage) {
        this.preventNegativeStorage = preventNegativeStorage;
        return this;
    };
    Player.prototype.getRecipeNameByName = function (recipeName) {
        var recipes = this.recipes.filter(function (src) { return src.getName() == recipeName; });
        if (recipes.length == 0) {
            return null;
        }
        return recipes[0];
    };
    Player.prototype.increaseStorage = function (quantity) {
        var resQ = this.getResourceInStorage(quantity.getResource().getName());
        if (resQ == null) {
            resQ = new Quantity(0, quantity.getResource());
            this.storage.push(resQ);
        }
        if ((resQ.getQuantity() + quantity.getQuantity()) < 0 && this.preventNegativeStorage) {
            resQ.setQuantity(0);
        }
        else {
            resQ.setQuantity(resQ.getQuantity() + quantity.getQuantity());
        }
    };
    Player.prototype.decreaseStorage = function (quantity) {
        var resQ = this.getResourceInStorage(quantity.getResource().getName());
        if (resQ == null) {
            resQ = new Quantity(0, quantity.getResource());
            this.storage.push(resQ);
        }
        if ((resQ.getQuantity() + -1 * quantity.getQuantity()) < 0 && this.preventNegativeStorage) {
            resQ.setQuantity(0);
        }
        else {
            resQ.setQuantity(resQ.getQuantity() + -1 * quantity.getQuantity());
        }
    };
    Player.prototype.getResourceInStorage = function (resourceName) {
        var res = this.storage.filter(function (res) { return res.getResource().getName() == resourceName; });
        if (res.length) {
            return res[0];
        }
        return null;
    };
    Player.prototype.hasResources = function (resourcesQuantity) {
        var _this = this;
        var hasRes = true;
        resourcesQuantity.forEach(function (resQ) {
            var playerRes = _this.getResourceInStorage(resQ.getResource().getName());
            if (playerRes == null || playerRes.getQuantity() < resQ.getQuantity()) {
                hasRes = false;
            }
        });
        return hasRes;
    };
    return Player;
}());
//# sourceMappingURL=Player.js.map
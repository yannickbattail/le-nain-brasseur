"use strict";
var Q = function (quantity, res) { return new Quantity(quantity, res); };
var LEVEL = new Level("level", "level.svg", [
    "rien",
    "Noob",
    "Brasseur amateur",
    "Brasseur",
    "Maitre brasseur",
]);
var WATER = new CategorizedMaterial("Eau", "L", "water.svg", "Ingredient", "eau");
var MALT = new CategorizedMaterial("Malt", "g", "grain.svg", "Ingredient", "Malt d'orge");
var HOUBLON = new CategorizedMaterial("Houblon", "g", "hops.svg", "Ingredient", "Houblon");
var LEVURE = new CategorizedMaterial("Levure", "g", "eyedropper.svg", "Ingredient", "Levure de bière");
var resourceList = [
    WATER, MALT, HOUBLON, LEVURE
];
var Scenario = (function () {
    function Scenario() {
    }
    Scenario.initEngine = function () {
        var engine = new BrewerDwarf();
        engine.player = new Player("Gurdil");
        engine.player.setPreventNegativeStorage(true);
        engine.player.setRecipes([
            new Recipe("Bière de base", [
                new AddIngredient(Q(10000, WATER)),
                new AddIngredient(Q(2000, MALT)),
                new AddIngredient(Q(50, HOUBLON)),
                new Heat(20 * 60 * 1000, 100),
                new Filter(),
                new Cool(30),
                new Brew(30 * 24 * 60 * 60 * 1000)
            ]),
            new Recipe("Bière de base2", [
                new AddIngredient(Q(10000, WATER)),
                new AddIngredient(Q(2000, MALT)),
                new AddIngredient(Q(50, HOUBLON)),
                new Heat(20 * 60 * 1000, 100),
                new Filter(),
                new Cool(30),
                new Brew(30 * 24 * 60 * 60 * 1000)
            ])
        ]);
        engine.player.increaseStorage(Q(1, LEVEL));
        engine.player.increaseStorage(Q(1000, WATER));
        engine.player.increaseStorage(Q(60 * 1000, MALT));
        engine.player.increaseStorage(Q(600, HOUBLON));
        engine.player.increaseStorage(Q(100, LEVURE));
        return engine;
    };
    return Scenario;
}());
//# sourceMappingURL=Scenario.js.map
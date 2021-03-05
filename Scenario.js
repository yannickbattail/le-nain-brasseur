"use strict";
var MINUTE = 60 * 1000;
var DAY = 24 * 60 * MINUTE;
var Q = function (quantity, res) { return new Quantity(quantity, res); };
var LEVEL = new Level("level", "level.svg", [
    "rien",
    "Brassouilleur ",
    "Brasseur amateur",
    "Brasseur",
    "Maitre brasseur",
]);
var WATER = new CategorizedMaterial("Eau", "cl", "water.svg", "Ingredient", "eau");
var MALT = new CategorizedMaterial("Malt", "g", "grain.svg", "Ingredient", "Malt d'orge");
var HOUBLON = new CategorizedMaterial("Houblon", "g", "hops.svg", "Ingredient", "Houblon");
var LEVURE = new CategorizedMaterial("Levure", "g", "eyedropper.svg", "Ingredient", "Levure de bière");
var DRECHE = new CategorizedMaterial("drêche", "g", "dreche.svg", "Ingredient", "reste de grain après brassage");
var BIERE = new CategorizedMaterial("Bière", "cl", "beer.svg", "Ingredient", "Bière");
var GOLD = new CategorizedItem("Or", "cash.svg", "Item", "Pièces d'or");
var resourceList = [
    WATER, MALT, HOUBLON, LEVURE, BIERE, DRECHE, GOLD
];
var ADVISE_COST = Q(100, GOLD);
var Scenario = (function () {
    function Scenario() {
    }
    Scenario.initEngine = function () {
        var engine = new BrewerDwarf();
        engine.recipes = [
            new Recipe("La Einegloïn", [
                new AddingIngredient([
                    new StepParameter('quantité', 10000, WATER)
                ]),
                new AddingIngredient([
                    new StepParameter('quantité', 2000, MALT)
                ]),
                new AddingIngredient([
                    new StepParameter('quantité', 50, HOUBLON)
                ]),
                new Heating([
                    new StepParameter('température', 100),
                    new StepParameter('durée', 20 * 60 * 1000)
                ]),
                new Filtering([]),
                new Cooling([
                    new StepParameter('température', 30)
                ]),
                new AddingIngredient([
                    new StepParameter('quantité', 10, LEVURE)
                ]),
                new Brewing([
                    new StepParameter('jour', 30 * 24 * 60 * 60 * 1000)
                ])
            ], engine.recipes[0]),
            new Recipe("La kronadil", [
                new AddingIngredient([
                    new StepParameter('quantité', 10000, WATER)
                ]),
                new AddingIngredient([
                    new StepParameter('quantité', 2000, MALT)
                ]),
                new AddingIngredient([
                    new StepParameter('quantité', 50, HOUBLON)
                ]),
                new Heating([
                    new StepParameter('température', 100),
                    new StepParameter('durée', 20 * 60 * 1000)
                ]),
                new Filtering([]),
                new Cooling([
                    new StepParameter('température', 30)
                ]),
                new AddingIngredient([
                    new StepParameter('quantité', 10, LEVURE)
                ]),
                new Brewing([
                    new StepParameter('jour', 30 * 24 * 60 * 60 * 1000)
                ])
            ], engine.recipes[0]),
        ];
        engine.player = new Player("Gurdil");
        engine.player.setPreventNegativeStorage(true);
        engine.player.increaseStorage(Q(1, LEVEL));
        engine.player.increaseStorage(Q(1000, WATER));
        engine.player.increaseStorage(Q(60 * 1000, MALT));
        engine.player.increaseStorage(Q(600, HOUBLON));
        engine.player.increaseStorage(Q(100, LEVURE));
        engine.player.increaseStorage(Q(1000, GOLD));
        return engine;
    };
    return Scenario;
}());
//# sourceMappingURL=Scenario.js.map
/// <reference path="./model/IResource.ts" />
/// <reference path="./model/Resource.ts" />
/// <reference path="./model/ICategorized.ts" />
/// <reference path="./model/CategorizedItem.ts" />
/// <reference path="./model/CategorizedMaterial.ts" />
/// <reference path="./model/Level.ts" />
/// <reference path="./model/IQuantity.ts" />
/// <reference path="./model/Quantity.ts" />
/// <reference path="./model/IPlayer.ts" />
/// <reference path="./model/Player.ts" />
/// <reference path="./model/Recipe.ts" />
/// <reference path="./model/BrewerDwarf.ts" />
/// <reference path="./model/BrewerDwarfStatus.ts" />

let Q = (quantity : number, res : IResource) => new Quantity(quantity, res);

const LEVEL = new Level("level", "level.svg", [
    "rien",
    "Brassouilleur ",
    "Brasseur amateur",
    "Brasseur",
    "Maitre brasseur",
]);
//    VARIABLE  TYPE (Material a une unité en plus)               unité         image                         catégorie                 description
const WATER     = new CategorizedMaterial("Eau",       "cl",   "water.svg",         "Ingredient",   "eau");
const MALT      = new CategorizedMaterial("Malt",      "g",    "grain.svg",         "Ingredient",   "Malt d'orge");
const HOUBLON   = new CategorizedMaterial("Houblon",   "g",    "hops.svg",          "Ingredient",   "Houblon");
const LEVURE    = new CategorizedMaterial("Levure",    "g",    "eyedropper.svg",    "Ingredient",   "Levure de bière");
const DRECHE    = new CategorizedMaterial("drêche",    "g",    "dreche.svg",        "Ingredient",   "reste de grain après brassage");
const BIERE     = new CategorizedMaterial("Bière",     "cl",   "beer.svg",          "Ingredient",   "Bière");
const GOLD      = new CategorizedItem("Or",                         "cash.svg",          "Item",         "Pièces d'or");

const resourceList : Array<CategorizedItem | CategorizedMaterial> = [
    WATER, MALT, HOUBLON, LEVURE, BIERE, DRECHE, GOLD
];

let ADVISE_COST = Q(50, GOLD);

class Scenario {
    public static initEngine() : BrewerDwarf {
        let engine = new BrewerDwarf();
        engine.recipes = [
            new Recipe("La Einegloïn", [
                    new AddingIngredient([
                        new StepParameter('quantité',1000, WATER)
                    ]),
                    new AddingIngredient([
                        new StepParameter('quantité',2000, MALT)
                    ]),
                    new Heating([
                        new StepParameter('température',62),
                        new StepParameter('durée',47)
                    ]),
                    new Filtering([]),
                    new AddingIngredient([
                        new StepParameter('quantité',50, HOUBLON)
                    ]),
                    new Heating([
                        new StepParameter('température',100),
                        new StepParameter('durée',65)
                    ]),
                    new Cooling([
                        new StepParameter('température',30)
                    ]),
                    new AddingIngredient([
                        new StepParameter('quantité',10, LEVURE)
                    ]),
                    new Brewing([
                        new StepParameter('jour',30)
                    ])
                ],
                engine.recipes[0], 1),
            new Recipe("La kronadil", [
                    new AddingIngredient([
                        new StepParameter('quantité',1000, WATER)
                    ]),
                    new AddingIngredient([
                        new StepParameter('quantité',2000, MALT)
                    ]),
                    new Heating([
                        new StepParameter('température',50),
                        new StepParameter('durée',15)
                    ]),
                    new Heating([
                        new StepParameter('température',68),
                        new StepParameter('durée',37)
                    ]),
                    new Filtering([]),
                    new AddingIngredient([
                        new StepParameter('quantité',50, HOUBLON)
                    ]),
                    new Heating([
                        new StepParameter('température',100),
                        new StepParameter('durée',78)
                    ]),
                    new Cooling([
                        new StepParameter('température',30)
                    ]),
                    new AddingIngredient([
                        new StepParameter('quantité',10, LEVURE)
                    ]),
                    new Brewing([
                        new StepParameter('jour',32)
                    ])
                ],
                engine.recipes[0], 1),
        ];
        engine.shopStorage = [
            new Article(Q(100000, WATER), Q(-10, GOLD)),
            new Article(Q(1000, MALT), Q(-5, GOLD)),
            new Article(Q(200, HOUBLON), Q(-10, GOLD)),
            new Article(Q(100, LEVURE), Q(-1, GOLD)),
            new Article(Q(1, GOLD), Q(-1000, DRECHE)),
        ];
        engine.player = new Player("Gurdil");
        engine.player.setPreventNegativeStorage(true);
        // initial storage
        engine.player.increaseStorage(Q(1, LEVEL));
        engine.player.increaseStorage(Q(100000, WATER));
        engine.player.increaseStorage(Q(60*1000, MALT));
        engine.player.increaseStorage(Q(600, HOUBLON));
        engine.player.increaseStorage(Q(100, LEVURE));
        engine.player.increaseStorage(Q(1000, GOLD));
        return engine;
    }
}
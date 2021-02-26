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
    "Noob",
    "Brasseur amateur",
    "Brasseur",
    "Maitre brasseur",
]);
//    VARIABLE  TYPE (Material a une unité en plus)         unité           image                   catégorie     description
const WATER     = new CategorizedMaterial("Eau",       "L",    "water.svg", "Ingredient",   "eau");
const MALT      = new CategorizedMaterial("Malt",      "g",    "grain.svg", "Ingredient",   "Malt d'orge");
const HOUBLON   = new CategorizedMaterial("Houblon",   "g",    "hops.svg",      "Ingredient",   "Houblon");
const LEVURE    = new CategorizedMaterial("Levure",    "g",    "eyedropper.svg","Ingredient",   "Levure de bière");

const resourceList : Array<CategorizedItem | CategorizedMaterial> = [
    WATER, MALT, HOUBLON, LEVURE
];

class Scenario {
    public static initEngine() : BrewerDwarf {
        let engine = new BrewerDwarf();
        engine.player = new Player("Gurdil");
        engine.player.setPreventNegativeStorage(true);
        engine.player.setRecipes([
            new Recipe("Ma 0ème Bièbière", [
                new AddIngredient(Q(0, WATER)),
                new AddIngredient(Q(0, MALT)),
                new AddIngredient(Q(0, HOUBLON)),
                new Heat(0, 0),
                new Filter(),
                new Cool(0),
                new AddIngredient(Q(0, LEVURE)),
                new Brewing(0)
            ])
        ]);
        engine.recipes = [
            new Recipe("La Einegloïn", [
                new AddIngredient(Q(10000, WATER)),
                new AddIngredient(Q(2000, MALT)),
                new AddIngredient(Q(50, HOUBLON)),
                new Heat(20*60*1000, 100),
                new Filter(),
                new Cool(30),
                new AddIngredient(Q(10, LEVURE)),
                new Brewing(30*24*60*60*1000)
            ]),
            new Recipe("La kroandil", [
                new AddIngredient(Q(10000, WATER)),
                new AddIngredient(Q(2000, MALT)),
                new AddIngredient(Q(50, HOUBLON)),
                new Heat(20*60*1000, 100),
                new Filter(),
                new Cool(30),
                new AddIngredient(Q(10, LEVURE)),
                new Brewing(30*24*60*60*1000)
            ])
        ];
        // initial storage
        engine.player.increaseStorage(Q(1, LEVEL));
        engine.player.increaseStorage(Q(1000, WATER));
        engine.player.increaseStorage(Q(60*1000, MALT));
        engine.player.increaseStorage(Q(600, HOUBLON));
        engine.player.increaseStorage(Q(100, LEVURE));
        return engine;
    }
}
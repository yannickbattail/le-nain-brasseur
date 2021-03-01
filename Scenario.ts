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
        engine.recipes = [
            new Recipe("La Einegloïn", [
                    new AddIngredient([
                        new StepParameter('quantité',10000, WATER)
                    ]),
                    new AddIngredient([
                        new StepParameter('quantité',2000, MALT)
                    ]),
                    new AddIngredient([
                        new StepParameter('quantité',50, HOUBLON)
                    ]),
                    new Heat([
                        new StepParameter('température',100),
                        new StepParameter('durée',20*60*1000)
                    ]),
                    new Filter([]),
                    new Cool([
                        new StepParameter('température',30)
                    ]),
                    new AddIngredient([
                        new StepParameter('quantité',10, LEVURE)
                    ]),
                    new Brewing([
                        new StepParameter('durée',30*24*60*60*1000)
                    ])
                ],
                engine.recipes[0]),
            new Recipe("La kronadil", [
                    new AddIngredient([
                        new StepParameter('quantité',10000, WATER)
                    ]),
                    new AddIngredient([
                        new StepParameter('quantité',2000, MALT)
                    ]),
                    new AddIngredient([
                        new StepParameter('quantité',50, HOUBLON)
                    ]),
                    new Heat([
                        new StepParameter('température',100),
                        new StepParameter('durée',20*60*1000)
                    ]),
                    new Filter([]),
                    new Cool([
                        new StepParameter('température',30)
                    ]),
                    new AddIngredient([
                        new StepParameter('quantité',10, LEVURE)
                    ]),
                    new Brewing([
                        new StepParameter('durée',30*24*60*60*1000)
                    ])
                ],
                engine.recipes[0]),
        ];
        engine.player = new Player("Gurdil");
        engine.player.setPreventNegativeStorage(true);
        engine.player.setRecipes([
            new Recipe("Ma 0ème Bièbière", [
                new AddIngredient([
                    new StepParameter('quantité',0, WATER)
                ]),
                new AddIngredient([
                    new StepParameter('quantité',0, MALT)
                ]),
                new AddIngredient([
                    new StepParameter('quantité',0, HOUBLON)
                ]),
                new Heat([
                    new StepParameter('température',0),
                    new StepParameter('durée',0)
                ]),
                new Filter([]),
                new Cool([
                    new StepParameter('température',0)
                ]),
                new AddIngredient([
                    new StepParameter('quantité',0, LEVURE)
                ]),
                new Brewing([
                    new StepParameter('durée',0)
                ])
            ],
            engine.recipes[0])
        ]);
        // initial storage
        engine.player.increaseStorage(Q(1, LEVEL));
        engine.player.increaseStorage(Q(1000, WATER));
        engine.player.increaseStorage(Q(60*1000, MALT));
        engine.player.increaseStorage(Q(600, HOUBLON));
        engine.player.increaseStorage(Q(100, LEVURE));
        return engine;
    }
}
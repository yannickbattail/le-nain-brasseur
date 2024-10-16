import { Quantity } from './Models/Resources/Quantity.js';
import { Level } from './Models/Resources/Level.js';
import { ICategorizedMaterial } from './Models/Resources/ICategorizedMaterial';
import { ICategorizedItem } from './Models/Resources/ICategorizedItem';
import { IBrewerDwarf } from './Models/IBrewerDwarf';
import { IRecipe } from './Models/IRecipe';
import { AddingIngredient } from './Models/CookingSteps/AddingIngredient.js';
import { StepParameter } from './Models/CookingSteps/StepParameter.js';
import { Heating } from './Models/CookingSteps/Heating.js';
import { Filtering } from './Models/CookingSteps/Filtering.js';
import { Cooling } from './Models/CookingSteps/Cooling.js';
import { Brewing } from './Models/CookingSteps/Brewing';
import { IArticle } from './Models/IArticle';
import { Player } from './Models/Player.js';
import { IResource } from './Models/Resources/IResource.js';

export const Q = (quantity: number, res: IResource) => new Quantity(quantity, res);

export const LEVEL = new Level('level', 'level.svg', ['rien', 'Brassouilleur ', 'Brasseur amateur', 'Brasseur', 'Maistre brasseur']);
//    VARIABLE  TYPE (Material a une unité en plus)               unité         image                         catégorie                 description
export const WATER = new ICategorizedMaterial('Eau', 'cl', 'water.svg', 'Ingredient', 'eau');
export const MALT = new ICategorizedMaterial('Malt', 'g', 'grain.svg', 'Ingredient', "Malt d'orge");
export const HOUBLON = new ICategorizedMaterial('Houblon', 'g', 'hops.svg', 'Ingredient', 'Houblon');
export const LEVURE = new ICategorizedMaterial('Levure', 'g', 'eyedropper.svg', 'Ingredient', 'Levure de bière');
export const DRECHE = new ICategorizedMaterial('drêche', 'g', 'dreche.svg', 'Ingredient', 'reste de grain après brassage');
export const BIERE = new ICategorizedMaterial('Bière', 'cl', 'beer.svg', 'Ingredient', 'Bière');
export const GOLD = new ICategorizedItem('Or', 'cash.svg', 'Item', "Pièces d'or");

export const resourceList: Array<ICategorizedItem | ICategorizedMaterial> = [WATER, MALT, HOUBLON, LEVURE, BIERE, DRECHE, GOLD];

export const ADVISE_COST = Q(50, GOLD);

export class Scenario {
    public static initEngine(): IBrewerDwarf {
        const engine = new IBrewerDwarf();
        engine.recipes = [
            new IRecipe(
                'La Einegloïn',
                [
                    new AddingIngredient([new StepParameter('quantité', 1000, WATER)]),
                    new AddingIngredient([new StepParameter('quantité', 2000, MALT)]),
                    new Heating([new StepParameter('température', 62), new StepParameter('durée', 47)]),
                    new Filtering([]),
                    new AddingIngredient([new StepParameter('quantité', 50, HOUBLON)]),
                    new Heating([new StepParameter('température', 100), new StepParameter('durée', 65)]),
                    new Cooling([new StepParameter('température', 30)]),
                    new AddingIngredient([new StepParameter('quantité', 10, LEVURE)]),
                    new Brewing([new StepParameter('jour', 30)]),
                ],
                engine.recipes[0],
                1,
            ),
            new IRecipe(
                'La kronadil',
                [
                    new AddingIngredient([new StepParameter('quantité', 1000, WATER)]),
                    new AddingIngredient([new StepParameter('quantité', 2000, MALT)]),
                    new Heating([new StepParameter('température', 50), new StepParameter('durée', 15)]),
                    new Heating([new StepParameter('température', 68), new StepParameter('durée', 37)]),
                    new Filtering([]),
                    new AddingIngredient([new StepParameter('quantité', 50, HOUBLON)]),
                    new Heating([new StepParameter('température', 100), new StepParameter('durée', 78)]),
                    new Cooling([new StepParameter('température', 30)]),
                    new AddingIngredient([new StepParameter('quantité', 10, LEVURE)]),
                    new Brewing([new StepParameter('jour', 32)]),
                ],
                engine.recipes[0],
                1,
            ),
        ];
        engine.shopStorage = [
            new IArticle(Q(100000, WATER), Q(-10, GOLD)),
            new IArticle(Q(1000, MALT), Q(-5, GOLD)),
            new IArticle(Q(200, HOUBLON), Q(-10, GOLD)),
            new IArticle(Q(100, LEVURE), Q(-1, GOLD)),
            new IArticle(Q(1, GOLD), Q(-1000, DRECHE)),
        ];
        engine.player = new Player('Gurdil');
        engine.player.setPreventNegativeStorage(true);
        // initial storage
        engine.player.increaseStorage(Q(1, LEVEL));
        engine.player.increaseStorage(Q(100000, WATER));
        engine.player.increaseStorage(Q(60 * 1000, MALT));
        engine.player.increaseStorage(Q(600, HOUBLON));
        engine.player.increaseStorage(Q(100, LEVURE));
        engine.player.increaseStorage(Q(1000, GOLD));
        return engine;
    }
}

import { BrewerDwarfStatus } from './BrewerDwarfStatus.js';
import { IPlayer } from './IPlayer.js';
import { IRecipeReference } from './IRecipeReference';
import { IArticle } from './IArticle';

export interface IBrewerDwarf {
    tickInterval: number;
    fastMode: number;
    status: BrewerDwarfStatus;
    player: IPlayer;
    recipes: Array<IRecipeReference>;
    shopStorage: Array<IArticle>;
    intervalId: number;
}

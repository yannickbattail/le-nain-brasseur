import { IRecipe } from './IRecipe';
import { Quantity } from './Resources/Quantity';

export interface IPlayer {
    name: string;
    preventNegativeStorage: boolean;
    storage: Array<Quantity>;
    recipes: Array<IRecipe>;
    brewingRecipe: IRecipe | null;
}

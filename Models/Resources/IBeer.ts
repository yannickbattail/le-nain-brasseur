import { IRecipe } from '../IRecipe';
import { ICategorizedMaterial } from './ICategorizedMaterial';

export interface IBeer extends ICategorizedMaterial {
    recipe: IRecipe;
}

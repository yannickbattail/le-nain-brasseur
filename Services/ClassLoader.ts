import { Resource } from '../Models/Resources/Resource.js';
import { AddingIngredient } from '../Models/CookingSteps/AddingIngredient.js';
import { Cooling } from '../Models/CookingSteps/Cooling.js';
import { Filtering } from '../Models/CookingSteps/Filtering.js';
import { Heating } from '../Models/CookingSteps/Heating.js';
import { Level } from '../Models/Resources/Level.js';
import { CategorizedItem } from '../Models/Resources/CategorizedItem.js';
import { CategorizedMaterial } from '../Models/Resources/CategorizedMaterial.js';
import { Quantity } from '../Models/Resources/Quantity.js';
import { Beer } from '../Models/Resources/Beer.js';
import { NamedStepResource } from '../Models/Resources/NamedStepResource.js';
import { StepParameter } from '../Models/CookingSteps/StepParameter.js';
import { IRecipeReference } from '../Models/IRecipeReference';
import { IRecipe } from '../Models/IRecipe';
import { IBrewerDwarf } from '../Models/IBrewerDwarf';
import { Player } from '../Models/Player.js';
import { IArticle } from '../Models/IArticle';
import { Brewing } from '../Models/CookingSteps/Brewing';

export class ClassLoader {
    public static load(data: unknown) {
        if (data === null) {
            return null;
        }
        if (typeof data !== 'object') {
            throw new Error(`Invalid resource data: ${data}`);
        }
        if (!('$type' in data)) {
            throw new Error(`Resource data missing $type: ${data}`);
        }
        // Cooking Steps
        if (data.$type === 'AddingIngredient') return AddingIngredient.load(data);
        if (data.$type === 'Cooling') return Cooling.load(data);
        if (data.$type === 'Filtering') return Filtering.load(data);
        if (data.$type === 'Heating') return Heating.load(data);
        if (data.$type === 'StepParameter') return StepParameter.load(data);
        // Resources
        if (data.$type === 'Resource') return Resource.load(data);
        if (data.$type === 'CategorizedItem') return CategorizedItem.load(data);
        if (data.$type === 'CategorizedMaterial') return CategorizedMaterial.load(data);
        if (data.$type === 'NamedStepResource') return NamedStepResource.load(data);
        if (data.$type === 'Quantity') return Quantity.load(data);
        if (data.$type === 'Beer') return Beer.load(data);
        if (data.$type === 'Level') return Level.load(data);
        // models
        if (data.$type === 'BrewerDwarf') return IBrewerDwarf.load(data);
        if (data.$type === 'Player') return Player.load(data);
        if (data.$type === 'Article') return IArticle.load(data);
        if (data.$type === 'Brewing') return Brewing.load(data);
        if (data.$type === 'RecipeReference') return IRecipeReference.load(data);
        if (data.$type === 'Recipe') return IRecipe.load(data);

        throw new Error(`Unknown resource type: ${data.$type}`);
    }
}

import { CategorizedMaterial } from './CategorizedMaterial.js';
import { IRecipe } from '../IRecipe';
import { ICategorized } from '../ICategorized.js';

export class Beer extends CategorizedMaterial implements ICategorized {
    public $type: string = 'Beer';

    constructor(
        public name: string,
        public unit: string,
        public image: string,
        public category: string,
        public description: string,
        public recipe: IRecipe,
    ) {
        super(name, unit, image, category, description);
    }

    public static load(obj: unknown): Beer {
        const data = obj as Beer;
        const recipe = IRecipe.load(data.recipe);
        return new Beer(data.name, data.unit, data.image, data.category, data.description, recipe);
    }
}

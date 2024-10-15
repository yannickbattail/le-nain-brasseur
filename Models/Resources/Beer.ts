import { CategorizedMaterial } from './CategorizedMaterial.js';
import { Recipe } from '../Recipe.js';
import { ICategorized } from '../ICategorized.js';

export class Beer extends CategorizedMaterial implements ICategorized {
    public $type: string = 'Beer';

    constructor(
        public name: string,
        public unit: string,
        public image: string,
        public category: string,
        public description: string,
        public recipe: Recipe,
    ) {
        super(name, unit, image, category, description);
    }

    public static load(obj: unknown): Beer {
        const data = obj as Beer;
        const recipe = Recipe.load(data.recipe);
        return new Beer(data.name, data.unit, data.image, data.category, data.description, recipe);
    }
}

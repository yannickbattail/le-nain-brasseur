import { Resource } from './Resource.js';
import { ICategorized } from '../ICategorized.js';

export class CategorizedItem extends Resource implements ICategorized {
    public $type: string = 'CategorizedItem';

    constructor(
        public name: string,
        public image: string,
        public category: string,
        public description: string,
    ) {
        super(name);
    }

    public static load(data: unknown): CategorizedItem {
        const obj: CategorizedItem = data as CategorizedItem;
        return new CategorizedItem(obj.name, obj.image, obj.category, obj.description);
    }

    public show(quantity: number): string {
        return '' + quantity;
    }
}

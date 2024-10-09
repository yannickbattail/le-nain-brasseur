import { Resource } from './Resource.js';
import { ICategorized } from '../ICategorized.js';

export class CategorizedMaterial extends Resource implements ICategorized {
    public $type: string = 'CategorizedMaterial';
    constructor(
        public name: string,
        public unit: string,
        public image: string,
        public category: string,
        public description: string,
    ) {
        super(name);
    }
    public static load(data: any): CategorizedMaterial {
        const r: CategorizedMaterial = new CategorizedMaterial(data.name, data.unit, data.image, data.category, data.description);
        return r;
    }
    public show(quantity: number): string {
        let u = this.unit;
        let q = quantity;
        if (u == 'g') {
            if (quantity >= 1000000) {
                u = 'T';
                q = Math.round(q / 10000) / 100;
            } else if (quantity >= 1000) {
                u = 'kg';
                q = Math.round(q / 100) / 10;
            }
        }
        if (u == 'cl') {
            if (quantity >= 100) {
                u = 'l';
                q = Math.round(q / 10) / 10;
            }
        }
        return q + u;
    }
}

import { ICategorized } from '../ICategorized.js';

export interface ICategorizedItem extends ICategorized {
    name: string;
    image: string;
    category: string;
    description: string;
}

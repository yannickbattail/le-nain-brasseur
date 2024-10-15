import { IQuantity } from './Resources/IQuantity.js';
import { Quantity } from './Resources/Quantity.js';

export class Article {
    $type: string = 'Article';

    constructor(
        public item: IQuantity,
        public cost: IQuantity,
    ) {}

    public static load(obj: unknown): Article {
        const data: Article = obj as Article;
        const res: IQuantity = Quantity.load(data.item);
        const cost: IQuantity = Quantity.load(data.cost);
        return new Article(res, cost);
    }
}

import { Resource } from "./Resource";
import { ICategorized } from "./ICategorized";

export class CategorizedItem extends Resource implements ICategorized {
  public $type: string = "CategorizedItem";

  constructor(
    public name: string,
    public image: string,
    public category: string,
    public description: string,
  ) {
    super(name);
  }

  public static load(data: any): CategorizedItem {
    const r: CategorizedItem = new CategorizedItem(
      data.name,
      data.image,
      data.category,
      data.description,
    );
    return r;
  }

  public show(quantity: number): string {
    return "" + quantity;
  }
}

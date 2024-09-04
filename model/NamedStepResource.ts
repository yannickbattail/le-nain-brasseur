import { Resource } from "./Resource";

export class NamedStepResource extends Resource {
  public $type: string = "Item";

  constructor(
    public name: string,
    public image: string,
    public stepNames: string[],
  ) {
    super(name);
  }

  public static load(data: any): NamedStepResource {
    const r: NamedStepResource = new NamedStepResource(
      data.name,
      data.image,
      data.stepNames,
    );
    return r;
  }

  public show(quantity: number): string {
    if (quantity < 0 || quantity >= this.stepNames.length) {
      return "" + quantity + ": UNKOWN";
    }
    return "" + quantity + ": " + this.stepNames[quantity];
  }
}

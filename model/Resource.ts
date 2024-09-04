import { IResource } from "./IResource.js";

export class Resource implements IResource {
  public $type: string = "Resource";
  getName(): string {
    return this.name;
  }
  constructor(protected name: string) {}
  public static load(data: any): Resource {
    const r: Resource = new Resource(data.name);
    return r;
  }

  public equals(obj: IResource): boolean {
    return this.getName() == obj.getName();
  }
  public show(quantity: number): string {
    return quantity + " " + this.name;
  }
}

/// <reference path="./IResource.ts" />

class Resource implements IResource {
  public $type: string = "Resource";

  constructor(protected name: string) {}

  public static load(data: any): Resource {
    const r: Resource = new Resource(data.name);
    return r;
  }

  getName(): string {
    return this.name;
  }

  public equals(obj: IResource): boolean {
    return this.getName() == obj.getName();
  }

  public show(quantity: number): string {
    return quantity + " " + this.name;
  }
}

import { IResource } from './IResource.js';

export class Resource implements IResource {
    public $type: string = 'Resource';

    constructor(protected name: string) {}

    public static load(data: unknown): Resource {
        const obj: Resource = data as Resource;
        return new Resource(obj.name);
    }

    getName(): string {
        return this.name;
    }

    public equals(obj: IResource): boolean {
        return this.getName() == obj.getName();
    }

    public show(quantity: number): string {
        return quantity + ' ' + this.name;
    }
}

import { Resource } from './Resource.js';

export class NamedStepResource extends Resource {
    public $type: string = 'Item';

    constructor(
        public name: string,
        public image: string,
        public stepNames: string[],
    ) {
        super(name);
    }

    public static load(data: unknown): NamedStepResource {
        const obj: NamedStepResource = data as NamedStepResource;
        return new NamedStepResource(obj.name, obj.image, obj.stepNames);
    }

    public show(quantity: number): string {
        if (quantity < 0 || quantity >= this.stepNames.length) {
            return '' + quantity + ': UNKOWN';
        }
        return '' + quantity + ': ' + this.stepNames[quantity];
    }
}

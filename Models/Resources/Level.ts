import { NamedStepResource } from './NamedStepResource.js';

export class Level extends NamedStepResource {
    public $type: string = 'Level';
    constructor(
        public name: string,
        public image: string,
        public stepNames: string[],
    ) {
        super(name, image, stepNames);
    }
    public static load(data: unknown): Level {
        const obj: Level = data as Level;
        return new Level(obj.name, obj.image, obj.stepNames);
    }
    public show(quantity: number): string {
        return '' + quantity;
    }
    public getStepName(quantity: number): string {
        if (quantity < 0 || quantity >= this.stepNames.length) {
            return 'UNKOWN';
        }
        return this.stepNames[quantity];
    }
}

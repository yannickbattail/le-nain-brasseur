/// <reference path="ICookingAction.ts" />

abstract class CookingAction  implements ICookingAction {
    abstract $type: string;

    abstract getName() : string;
    abstract getImage() : string;
    abstract compare(action: ICookingAction) : string;
    abstract analyse(action: ICookingAction) : number|null;
    
    notation(expected: number, actual: number): number {
        const halfExpected = expected / 2;
        const diff = Math.abs(expected - actual);
        if (diff > halfExpected) {
            return 0;
        }
        return 1 - (diff / halfExpected);
    }
}

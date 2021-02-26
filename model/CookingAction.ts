/// <reference path="ICookingAction.ts" />

abstract class CookingAction  implements ICookingAction {
    abstract $type: string;

    abstract getName() : string;
    abstract getImage() : string;
    abstract compare(action: ICookingAction) : string;
    abstract analyse(action: ICookingAction) : number|null;
    
    notation(val1: number, val2: number): number {
        const degreeDiff = Math.abs(val1 - val2);
        if (degreeDiff > val1 / 2) {
            return 0;
        }
        return (val1 / 2 - degreeDiff) / degreeDiff;
    }
}

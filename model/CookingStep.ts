/// <reference path="ICookingStep.ts" />

abstract class CookingStep implements ICookingStep {
    abstract $type: string;

    abstract getName() : string;
    abstract getImage() : string;
    abstract compare(action: ICookingStep) : string;
    abstract analyse(action: ICookingStep) : number|null;

    scoring(expected: number, actual: number): number {
        const halfExpected = expected / 2;
        const diff = Math.abs(expected - actual);
        if (diff > halfExpected) {
            return 0;
        }
        return 1 - (diff / halfExpected);
    }
}

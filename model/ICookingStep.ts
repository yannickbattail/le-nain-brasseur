
interface ICookingStep {
    $type: string;

    getName() : string;
    getImage() : string;
    compare(action: ICookingStep) : string;
    analyse(action: ICookingStep) : number|null;
}

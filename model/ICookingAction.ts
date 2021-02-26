
interface ICookingAction {
    $type: string;

    getName() : string;
    getImage() : string;
    compare(action: ICookingAction) : string;
    analyse(action: ICookingAction) : number|null;
}


interface ICookingAction {
    $type: string;

    compare(action: ICookingAction) : string;
    analyse(action: ICookingAction) : number|null;
}

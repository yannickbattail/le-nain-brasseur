/// <reference path="CookingAction.ts" />

class Brewing extends CookingAction {
    $type : string = 'Heat';
    constructor(public duration: number = 0) {
        super();
    }
    
    public static load(data : any) : Brewing {
        let newObj : Brewing = new Brewing();
        newObj.duration = data.duration;
        return newObj;
    }
    
    getName() : string {
        return "Fermenter";
    }
    getImage() : string {
        return "boiling-bubbles.svg";
    }
    public compare(action : ICookingAction) : string {
        if (this.$type != action.$type) {
            return "L'étape devrait être "+this.$type;
        }
        let addIngredient = action as Brewing;
        return this.compareHeat(addIngredient);
    }
    public compareHeat(action : Brewing) : string {
        if (this.duration > action.duration) {
            return "La fermentation est trop courte";
        }
        if (this.duration < action.duration) {
            return "La fermentation est trop longue";
        }
        return "";
    }

    analyse(action: ICookingAction): number | null {
        if (action instanceof Brewing) {
            this.analyseBrewing(action);
        }
        return null;

    }

    analyseBrewing(action: Brewing): number | null {
        return this.notation(this.duration, action.duration);
    }
}
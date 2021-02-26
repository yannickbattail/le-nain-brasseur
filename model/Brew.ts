/// <reference path="CookingAction.ts" />

class Brew extends CookingAction {
    $type : string = 'Heat';
    constructor(public duration: number = 0) {
        super();
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
        let addIngredient = action as Brew;
        return this.compareHeat(addIngredient);
    }
    public compareHeat(action : Brew) : string {
        if (this.duration > action.duration) {
            return "La fermentation est trop courte";
        }
        if (this.duration < action.duration) {
            return "La fermentation est trop longue";
        }
        return "";
    }

    analyse(action: ICookingAction): number | null {
        if (action instanceof Brew) {
            this.analyseBrew(action);
        }
        return null;

    }

    analyseBrew(action: Brew): number | null {
        return this.notation(this.duration, action.duration);
    }
}
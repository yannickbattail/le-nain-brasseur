
class Ingredient {
    $type : string = 'Ingredient';
    constructor(protected name : string) {
        
    }
    
    public getName() : string {
        return this.name;
    }
}
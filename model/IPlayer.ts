/// <reference path="IResource.ts" />
/// <reference path="IQuantity.ts" />

interface IPlayer {
    $type : string;
    // getters
    getName() : string;
    getStorage() : Array<IQuantity>;
    getRecipes() : Array<Recipe>;
    setRecipes(recipes : Array<Recipe>) : IPlayer;
    getBrewingRecipe() : Recipe | null;
    setBrewingRecipe(brewingRecipe : Recipe) : IPlayer;
    getPreventNegativeStorage() : boolean ;

    setPreventNegativeStorage(preventNegativeStorage : boolean) : IPlayer;
    
    // storage management
    increaseStorage(resourceQuantity: IQuantity) : void;
    decreaseStorage(resourceQuantity: IQuantity) : void;
    getResourceInStorage(resourceName: string): IQuantity | null ;
    hasResources(resourcesQuantity: Array<IQuantity>): boolean ;

    

}
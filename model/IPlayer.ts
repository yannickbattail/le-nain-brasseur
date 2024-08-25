/// <reference path="IResource.ts" />
/// <reference path="IQuantity.ts" />

interface IPlayer {
  $type: string;

  // getters
  getName(): string;

  getStorage(): Array<IQuantity>;

  getStorageByCategory(category: string): Array<IQuantity>;

  getRecipes(): Array<Recipe>;

  setRecipes(recipes: Array<Recipe>): IPlayer;

  getBrewingRecipe(): Recipe | null;

  setBrewingRecipe(brewingRecipe: Recipe | null): IPlayer;

  getPreventNegativeStorage(): boolean;

  setPreventNegativeStorage(preventNegativeStorage: boolean): IPlayer;

  getRecipeNameByName(recipeName: string): Recipe | null;

  // storage management
  increaseStorage(resourceQuantity: IQuantity): void;

  decreaseStorage(resourceQuantity: IQuantity): void;

  getResourceInStorage(resourceName: string): IQuantity | null;

  hasResources(resourcesQuantity: Array<IQuantity>): boolean;
}

/// <reference path="./IResource.ts" />
/// <reference path="./IQuantity.ts" />
/// <reference path="./IPlayer.ts" />

class Player implements IPlayer {
  $type: string = "Player";
  protected preventNegativeStorage: boolean = false;
  protected storage: Array<Quantity> = new Array<Quantity>();
  protected recipes: Array<Recipe> = new Array<Recipe>();
  protected brewingRecipe: Recipe | null = null;

  constructor(protected name: string) {}

  public static load(data: any): Player {
    const curContext: any = window;
    const player: Player = new Player(data.name);
    player.preventNegativeStorage = data.preventNegativeStorage;
    player.storage = (data.storage as Array<any>).map((p) =>
      curContext[p.$type].load(p),
    );
    player.recipes = (data.recipes as Array<any>).map((p) =>
      curContext[p.$type].load(p),
    );
    player.brewingRecipe =
      data.brewingRecipe != null
        ? curContext[data.brewingRecipe.$type].load(data.brewingRecipe)
        : null;
    return player;
  }

  public getName(): string {
    return this.name;
  }

  public getStorage(): Array<IQuantity> {
    return this.storage;
  }

  public getStorageByCategory(category: string): Array<IQuantity> {
    return this.storage.filter((resQ) => {
      const resource = resQ.getResource();
      return (
        (resource instanceof CategorizedItem ||
          resource instanceof CategorizedMaterial) &&
        resource.category == category
      );
    });
  }

  public getRecipes(): Array<Recipe> {
    return this.recipes;
  }

  public setRecipes(recipes: Array<Recipe>): IPlayer {
    this.recipes = recipes;
    return this;
  }

  public getBrewingRecipe(): Recipe | null {
    return this.brewingRecipe;
  }

  public setBrewingRecipe(brewingRecipe: Recipe | null): IPlayer {
    this.brewingRecipe = brewingRecipe;
    return this;
  }

  public getPreventNegativeStorage(): boolean {
    return this.preventNegativeStorage;
  }

  public setPreventNegativeStorage(preventNegativeStorage: boolean): Player {
    this.preventNegativeStorage = preventNegativeStorage;
    return this;
  }

  public getRecipeNameByName(recipeName: string): Recipe | null {
    const recipes: Recipe[] = this.recipes.filter(
      (src) => src.getName() == recipeName,
    );
    if (recipes.length == 0) {
      return null;
    }
    return recipes[0];
  }

  public increaseStorage(quantity: IQuantity) {
    let resQ = this.getResourceInStorage(quantity.getResource().getName());
    if (resQ == null) {
      resQ = new Quantity(0, quantity.getResource());
      this.storage.push(resQ);
    }
    if (
      resQ.getQuantity() + quantity.getQuantity() < 0 &&
      this.preventNegativeStorage
    ) {
      resQ.setQuantity(0);
    } else {
      resQ.setQuantity(resQ.getQuantity() + quantity.getQuantity());
    }
    this.removeZeroResource();
  }

  public decreaseStorage(quantity: IQuantity) {
    let resQ = this.getResourceInStorage(quantity.getResource().getName());
    if (resQ == null) {
      resQ = new Quantity(0, quantity.getResource());
      this.storage.push(resQ);
    }
    if (
      resQ.getQuantity() + -1 * quantity.getQuantity() < 0 &&
      this.preventNegativeStorage
    ) {
      resQ.setQuantity(0);
    } else {
      resQ.setQuantity(resQ.getQuantity() + -1 * quantity.getQuantity());
    }
    this.removeZeroResource();
  }

  public getResourceInStorage(resourceName: string): Quantity | null {
    const res = this.storage.filter(
      (res: Quantity) => res.getResource().getName() == resourceName,
    );
    if (res.length) {
      return res[0];
    }
    return null;
  }

  public hasResources(resourcesQuantity: Quantity[]): boolean {
    let hasRes = true;
    resourcesQuantity.forEach((resQ) => {
      const playerRes = this.getResourceInStorage(resQ.getResource().getName());
      if (playerRes == null || playerRes.getQuantity() < resQ.getQuantity()) {
        hasRes = false;
      }
    });
    return hasRes;
  }

  private removeZeroResource() {
    this.storage = this.storage.filter((q) => q.getQuantity() != 0);
  }
}

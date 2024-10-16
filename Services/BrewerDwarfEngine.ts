import { IBrewerDwarf } from '../Models/IBrewerDwarf';
import { RecipeAnalysis } from './RecipeAnalysis.js';
import { AnalysisLevel } from '../Models/AnalysisLevel.js';
import { ADVISE_COST, DRECHE, MALT, Q } from '../Scenario.js';
import { IRecipe } from '../Models/IRecipe';
import { IRecipeReference } from '../Models/IRecipeReference';
import { Beer } from '../Models/Resources/Beer.js';
import { IArticle } from '../Models/IArticle';
import { BrewerDwarfStatus } from '../Models/BrewerDwarfStatus.js';
import { IQuantity } from '../Models/Resources/IQuantity.js';
import { StorageManager } from './StorageManager.js';
import { BrewingService } from './BrewingService.js';

export class BrewerDwarfEngine {
    public readonly storageManager: StorageManager;
    public readonly brewingService: BrewingService;

    constructor(public readonly brewerDwarf: IBrewerDwarf) {
        this.storageManager = new StorageManager(brewerDwarf.player.storage, true);
        this.brewingService = new BrewingService();
    }

    public brew() {
        const recipe = this.brewerDwarf.player.brewingRecipe;
        if (recipe != null) {
            this.loadRecipe(recipe);
            RecipeAnalysis.analyse(recipe, this.brewerDwarf.player, AnalysisLevel.PROBLEM);
            if (!this.brewingService.hasProblem(recipe)) {
                RecipeAnalysis.analyse(recipe, this.brewerDwarf.player, AnalysisLevel.SCORE);
                this.doBrew(recipe);
            }
        }
    }

    public checkBrew() {
        const recipe = this.brewerDwarf.player.brewingRecipe;
        if (recipe != null) {
            this.loadRecipe(recipe);
            RecipeAnalysis.analyse(recipe, this.brewerDwarf.player, AnalysisLevel.PROBLEM);
        }
    }

    public advise() {
        const recipe = this.brewerDwarf.player.brewingRecipe;
        if (recipe != null) {
            this.loadRecipe(recipe);
            if (!this.storageManager.hasResources([ADVISE_COST])) {
                recipe.problem = "Pas assez d'or pour acheter les conseils d'un maistre brasseur.";
                return;
            }
            this.storageManager.decreaseStorage(ADVISE_COST);
            RecipeAnalysis.analyse(recipe, this.brewerDwarf.player, AnalysisLevel.ADVISE);
        }
    }

    public prepareBrew(recipeName: string) {
        const recipeRef = this.getRecipeNameByName(recipeName);
        if (recipeRef == null) {
            throw 'recette ' + recipeName + ' non dispo';
        }
        this.brewerDwarf.player.brewingRecipe = this.brewingService.createRecipe(recipeRef);
    }

    public prepareAgainBrew(recipeName: string) {
        const recipe = this.getRecipeNameByName(recipeName);
        if (recipe == null) {
            throw 'recette ' + recipeName + ' non dispo';
        }
        this.brewerDwarf.player.brewingRecipe = this.brewingService.duplicateRecipe(recipe);
    }

    public getRecipeNameByName(recipeName: string): IRecipeReference | null {
        const recipes: IRecipeReference[] = this.brewerDwarf.recipes.filter((src) => src.name == recipeName);
        if (recipes.length == 0) {
            return null;
        }
        return recipes[0];
    }

    public sellBrew(resourceName: string): void {
        const quantity = this.storageManager.getResourceInStorage(resourceName);

        if (quantity != null) {
            const res = quantity.getResource();
            if (res instanceof Beer) {
                const article = this.brewingService.getArticle(res.recipe);
                this.storageManager.increaseStorage(article.item);
                this.storageManager.increaseStorage(article.cost);
            }
        }
    }

    public buy(resourceName: string): void {
        const article = this.getArticleNameByName(resourceName);
        if (article != null) {
            this.storageManager.increaseStorage(article.item);
            this.storageManager.increaseStorage(article.cost);
        }
    }

    public getArticleNameByName(resourceName: string): IArticle | null {
        const article = this.brewerDwarf.shopStorage.filter((a) => a.item.getResource().getName() == resourceName);
        if (article.length == 0) {
            return null;
        }
        return article[0];
    }

    run(tickInterval: number, saveCallback: (engine: BrewerDwarfEngine) => void) {
        this.brewerDwarf.tickInterval = tickInterval;
        this.saveCallback = saveCallback;
        if (this.brewerDwarf.status == BrewerDwarfStatus.NOT_YET_STARTED) {
            this.brewerDwarf.status = BrewerDwarfStatus.IN_PROGRESS;
        }
        this.brewerDwarf.intervalId = window.setInterval(() => this.onTick(), this.brewerDwarf.tickInterval);
    }

    stop() {
        window.clearInterval(this.brewerDwarf.intervalId);
    }

    private saveCallback: (engine: BrewerDwarfEngine) => void = function () {};

    private doBrew(recipe: IRecipe) {
        recipe.steps.forEach((s) => {
            if (s != null) {
                const q = s.getQuantity();
                if (q != null) {
                    this.storageManager.decreaseStorage(q);
                }
            }
        });
        this.storageManager.increaseStorage(this.brewingService.getBeer(recipe));
        const maltStep = recipe.steps.filter((s) => s.getStepParameters()[0]?.resource?.getName() == MALT.getName());
        this.storageManager.increaseStorage(Q(maltStep[0].getStepParameters()[0].value, DRECHE));
        this.brewerDwarf.player.brewingRecipe = null;
        this.brewerDwarf.player.recipes.push(recipe);
    }

    private brewHasIngredient(recipe: IRecipe): boolean {
        const ingredientList = recipe.steps.map((s) => s.getQuantity()).filter((q) => q != null) as Array<IQuantity>;
        return this.storageManager.hasResources(ingredientList);
    }

    private loadRecipe(recipe: IRecipe) {
        recipe.name = this.val('recipeName');
        recipe.steps.forEach((step, stepIndex) => {
            step.getStepParameters().forEach(
                (param, paramIndex) => (param.value = parseFloat(this.val(stepIndex + '_' + paramIndex + '_' + param.name))),
            );
        });
    }

    private val(id: string): string {
        const elem = document.getElementById(id);
        if (elem != null && elem instanceof HTMLInputElement) {
            if (!elem.value) {
                throw 'no value  for ' + id + ' ' + elem.value;
            }
            return elem.value;
        }
        throw 'no value for ' + id;
    }

    private onTick() {
        if (this.brewerDwarf.status == BrewerDwarfStatus.LOOSE || this.brewerDwarf.status == BrewerDwarfStatus.WIN) {
            console.log('Status is ' + this.brewerDwarf.status + ', STOP');
            this.stop();
        }

        // do something

        this.saveCallback(this);
    }
}

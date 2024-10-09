import { BrewerDwarfStatus } from './BrewerDwarfStatus.js';
import { IPlayer } from './IPlayer.js';
import { Player } from './Player.js';
import { RecipeReference } from './RecipeReference.js';
import { Article } from './Article.js';
import { RecipeAnalysis } from '../Services/RecipeAnalysis.js';
import { AnalysisLevel } from './AnalysisLevel.js';
import { Recipe } from './Recipe.js';
import { ADVISE_COST, DRECHE, MALT, Q } from '../Scenario.js';
import { IQuantity } from './Resources/IQuantity.js';
import { Beer } from './Resources/Beer.js';

export class BrewerDwarf {
    public $type: string = 'BrewerDwarf';
    tickInterval: number = 100;
    fastMode: number = 0;
    private saveCallback: (engine: BrewerDwarf) => void = function () {};

    status: BrewerDwarfStatus = BrewerDwarfStatus.NOT_YET_STARTED;
    player: IPlayer = new Player('');
    recipes: Array<RecipeReference> = new Array<RecipeReference>();
    public shopStorage: Array<Article> = new Array<Article>();

    private intervalId: number = 0;

    public static load(data: unknown): BrewerDwarf {
        const jsonObj: BrewerDwarf = data as BrewerDwarf;
        const newObj: BrewerDwarf = new BrewerDwarf();
        newObj.tickInterval = jsonObj.tickInterval;
        newObj.status = jsonObj.status;
        newObj.player = Player.load(jsonObj.player);
        newObj.recipes = jsonObj.recipes.map((p) => RecipeReference.load(p));
        newObj.shopStorage = jsonObj.shopStorage.map((p) => Article.load(p));
        newObj.fastMode = jsonObj.fastMode;
        return newObj;
    }

    public brew() {
        const recipe = this.player.getBrewingRecipe();
        if (recipe != null) {
            this.loadRecipe(recipe);
            RecipeAnalysis.analyse(recipe, this.player, AnalysisLevel.PROBLEM);
            if (!recipe.hasProblem()) {
                RecipeAnalysis.analyse(recipe, this.player, AnalysisLevel.SCORE);
                this.doBrew(recipe);
            }
        }
    }

    public checkBrew() {
        const recipe = this.player.getBrewingRecipe();
        if (recipe != null) {
            this.loadRecipe(recipe);
            RecipeAnalysis.analyse(recipe, this.player, AnalysisLevel.PROBLEM);
        }
    }

    public advise() {
        const recipe = this.player.getBrewingRecipe();
        if (recipe != null) {
            this.loadRecipe(recipe);
            if (!this.player.hasResources([ADVISE_COST])) {
                recipe.problem = "Pas assez d'or pour acheter les conseils d'un maistre brasseur.";
                return;
            }
            this.player.decreaseStorage(ADVISE_COST);
            RecipeAnalysis.analyse(recipe, this.player, AnalysisLevel.ADVISE);
        }
    }

    public prepareBrew(recipeName: string) {
        const recipeRef = this.getRecipeNameByName(recipeName);
        if (recipeRef == null) {
            throw 'recette ' + recipeName + ' non dispo';
        }
        this.player.setBrewingRecipe(recipeRef.createRecipe());
    }

    public reprepareBrew(recipeName: string) {
        const recipe = this.player.getRecipeNameByName(recipeName);
        if (recipe == null) {
            throw 'recette ' + recipeName + ' non dispo';
        }
        this.player.setBrewingRecipe(recipe.duplicate());
    }

    public getRecipeNameByName(recipeName: string): RecipeReference | null {
        const recipes: RecipeReference[] = this.recipes.filter((src) => src.getName() == recipeName);
        if (recipes.length == 0) {
            return null;
        }
        return recipes[0];
    }

    public sellBrew(resourceName: string): void {
        const quantity = this.player.getResourceInStorage(resourceName);

        if (quantity != null) {
            const res = quantity.getResource();
            if (res instanceof Beer) {
                this.player.increaseStorage(res.recipe.getArticle().item);
                this.player.increaseStorage(res.recipe.getArticle().cost);
            }
        }
    }

    public buy(resourceName: string): void {
        const article = this.getArticleNameByName(resourceName);
        if (article != null) {
            this.player.increaseStorage(article.item);
            this.player.increaseStorage(article.cost);
        }
    }

    public getArticleNameByName(resourceName: string): Article | null {
        const article = this.shopStorage.filter((a) => a.item.getResource().getName() == resourceName);
        if (article.length == 0) {
            return null;
        }
        return article[0];
    }

    run(tickInterval: number, saveCallback: (engine: BrewerDwarf) => void) {
        this.tickInterval = tickInterval;
        this.saveCallback = saveCallback;
        if (this.status == BrewerDwarfStatus.NOT_YET_STARTED) {
            this.status = BrewerDwarfStatus.IN_PROGRESS;
        }
        this.intervalId = window.setInterval(() => this.onTick(), this.tickInterval);
    }

    stop() {
        window.clearInterval(this.intervalId);
    }

    private doBrew(recipe: Recipe) {
        recipe.getCookingSteps().forEach((s) => {
            if (s != null) {
                const q = s.getQuantity();
                if (q != null) {
                    this.player.decreaseStorage(q);
                }
            }
        });
        this.player.increaseStorage(recipe.getBeer());
        const maltStep = recipe.steps.filter((s) => s.getStepParameters()[0]?.resource?.getName() == MALT.getName());
        this.player.increaseStorage(Q(maltStep[0].getStepParameters()[0].value, DRECHE));
        this.player.setBrewingRecipe(null);
        this.player.getRecipes().push(recipe);
    }

    private brewHasIngredient(recipe: Recipe): boolean {
        const ingredientList = recipe
            .getCookingSteps()
            .map((s) => s.getQuantity())
            .filter((q) => q != null) as Array<IQuantity>;
        return this.player.hasResources(ingredientList);
    }

    private loadRecipe(recipe: Recipe) {
        recipe.name = this.val('recipeName');
        recipe.getCookingSteps().forEach((step, stepIndex) => {
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
        if (this.status == BrewerDwarfStatus.LOOSE || this.status == BrewerDwarfStatus.WIN) {
            console.log('Status is ' + this.status + ', STOP');
            this.stop();
        }

        // do something

        this.saveCallback(this);
    }
}

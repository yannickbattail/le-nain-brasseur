/// <reference path="./IResource.ts" />
/// <reference path="./IQuantity.ts" />
/// <reference path="./IPlayer.ts" />
/// <reference path="./Player.ts" />
/// <reference path="./Resource.ts" />
/// <reference path="./Beer.ts" />
/// <reference path="./BrewerDwarfStatus.ts" />

class BrewerDwarf {
    public $type : string = 'BrewerDwarf';
    tickInterval : number = 100;
    fastMode : number = 0;
    private saveCallback: (engine: BrewerDwarf) => void = function () {};
    
    status : BrewerDwarfStatus = BrewerDwarfStatus.NOT_YET_STARTED;
    player : IPlayer = new Player("");
    recipes: Array<RecipeReference> = new Array<RecipeReference>();
    
    private intervalId : number = 0;

    public static load(data : any) : BrewerDwarf {
        let curContext : any = window;
        let newObj : BrewerDwarf = new BrewerDwarf();
        newObj.tickInterval = data.tickInterval;
        newObj.status = data.status;
        newObj.player = curContext[data.player.$type].load(data.player);
        newObj.recipes = (data.recipes as Array<any>).map(p => curContext[p.$type].load(p));
        newObj.fastMode = data.fastMode;
        return newObj;
    }

    public brew() {
        if (confirm("Si la recette est n'a pas de problème, les ingrédient seront décomptés. Continuer ?")) {
            let recipe = this.player.getBrewingRecipe();
            if (recipe != null) {
                this.loadRecipe(recipe);
                RecipeAnalysis.analyse(recipe, this.player, AnalysisLevel.PROBLEM);
                if (!recipe.hasProblem()) {
                    RecipeAnalysis.analyse(recipe, this.player, AnalysisLevel.SCORE);
                    console.log('doBrew');
                    this.doBrew(recipe);
                }
            }
        }
    }
    public checkBrew() {
        let recipe = this.player.getBrewingRecipe();
        if (recipe != null) {
            this.loadRecipe(recipe);
            RecipeAnalysis.analyse(recipe, this.player, AnalysisLevel.PROBLEM);
        }
    }

    public advise() {
        let recipe = this.player.getBrewingRecipe();
        if (recipe != null) {
            this.loadRecipe(recipe);
            if (!this.player.hasResources([ADVISE_COST])) {
                recipe.problem = "Pas assez d'or pour acheter les conseils d'un maistre brasseur.";
                return ;
            }
            this.player.decreaseStorage(ADVISE_COST);
            RecipeAnalysis.analyse(recipe, this.player, AnalysisLevel.ADVISE);
        }
    }
    
    private brewHasIngredient(recipe : Recipe) : boolean {
        let ingredientList = recipe.getCookingSteps().map(
            s => s.getQuantity()
        ).filter(q => q != null) as Array<IQuantity>;
        return this.player.hasResources(ingredientList);
    }
    
    private doBrew(recipe: Recipe) {
        recipe.getCookingSteps()
            .forEach(s => {
                if (s != null) {
                    let q = s.getQuantity();
                    if(q != null) {
                        this.player.decreaseStorage(q);
                    }
                }
            });
        let liters = recipe.steps[0].getStepParameter(0).value;
        let beer = new Beer(recipe.name, 'l', 'beer.svg',
            "beer", 'Beer à partir de '+recipe.recipeRef?.name, recipe);
        this.player.increaseStorage(Q(liters ,beer));
        let maltStep = recipe.steps.filter(
            s => s.getStepParameters()[0]?.resource?.getName() == MALT.getName()
        );
        this.player.increaseStorage(Q(maltStep[0].getStepParameters()[0].value ,DRECHE));
        this.player.setBrewingRecipe(null);
        this.player.getRecipes().push(recipe);
    }

    private loadRecipe(recipe: Recipe) {
        recipe.name = this.val("recipeName");
        recipe.getCookingSteps().forEach(
            (step,stepIndex) => {
                step.getStepParameters().forEach(
                    (param, paramIndex) => param.value = parseFloat(this.val(stepIndex+"_"+paramIndex+"_"+param.name))
                );
            }
        );
    }
    
    private val(id : string) : string {
        let elem = document.getElementById(id);
        if (elem != null && elem instanceof HTMLInputElement ) {
            if (!elem.value) {
                throw "no value  for "+id+" "+elem.value;
            }
            return elem.value;
        }
        throw "no value for "+id;
    }

    public prepareBrew(recipeName : string) {
        let recipeRef = engine.getRecipeNameByName(recipeName);
        if (recipeRef == null) {
            throw "recette "+recipeName+" non dispo";
        }
        this.player.setBrewingRecipe(recipeRef.createRecipe());
    }
    
    public reprepareBrew(recipeName : string) {
        let recipe = engine.player.getRecipeNameByName(recipeName);
        if (recipe == null) {
            throw "recette "+recipeName+" non dispo";
        }
        this.player.setBrewingRecipe(recipe.duplicate());
    }

    public getRecipeNameByName(recipeName : string) : RecipeReference | null {
        let recipes : RecipeReference[] =  this.recipes.filter(
            src => src.getName() == recipeName
        );
        if (recipes.length == 0) {
            return null;
        }
        return recipes[0];
    }  
    
    run(tickInterval : number, saveCallback: (engine: BrewerDwarf) => void) {
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
    private onTick() {
        if (this.status == BrewerDwarfStatus.LOOSE || this.status == BrewerDwarfStatus.WIN) {
            console.log("Status is "+this.status+", STOP");
            this.stop();
        }
        
        // do something
        
        this.saveCallback(this);
    }
}

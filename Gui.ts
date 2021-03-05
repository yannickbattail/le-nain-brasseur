/// <reference path="./model/IResource.ts" />
/// <reference path="./model/Resource.ts" />
/// <reference path="./model/ICategorized.ts" />
/// <reference path="./model/CategorizedItem.ts" />
/// <reference path="./model/CategorizedMaterial.ts" />
/// <reference path="./model/Level.ts" />
/// <reference path="./model/NamedStepResource.ts" />
/// <reference path="./model/IQuantity.ts" />
/// <reference path="./model/Quantity.ts" />
/// <reference path="./model/IPlayer.ts" />
/// <reference path="./model/Player.ts" />
/// <reference path="./model/ICookingStep.ts" />
/// <reference path="./model/CookingStep.ts" />
/// <reference path="./model/AddingIngredient.ts" />
/// <reference path="./model/Heating.ts" />
/// <reference path="./model/Cooling.ts" />
/// <reference path="./model/Filtering.ts" />
/// <reference path="./model/Brewing.ts" />
/// <reference path="./model/Recipe.ts" />
/// <reference path="./model/RecipeAnalysis.ts" />
/// <reference path="./model/BrewerDwarf.ts" />
/// <reference path="./model/BrewerDwarfStatus.ts" />
/// <reference path="./Scenario.ts" />
/// <reference path="./App.ts" />
/// <reference path="./NodeUpdate.ts" />

class Gui {
    intervalId : number = 0;
    constructor(private engine: BrewerDwarf) {
        this.engine = engine;
    }

    private displayLevel(): string {
        let level = this.engine.player.getResourceInStorage("level");
        let h = "<strong>Level</strong>: ";
        if (level != null) {
            let q = level.getQuantity();
            let res = level.getResource();
            if ('getStepName' in res) {
                let getStepName : Function = res['getStepName'];
                h += q + " " + getStepName.call(res, q) ;
            }
        }
        return h;
    }

    private displayStorageCategory(title : string, category : string): string {
        let content = this.displayStorageCategoryContent(category);
        if (content != "") {
            return this.displayStorageBox(title, content);
        }
        return "";
    }

    private displayBrews(): string {
        let content = this.engine.player.getStorage()
            .filter(
                resQ =>
                {
                    let resource = resQ.getResource();
                    return ('category' in resource) && (resource['category'] ==  "beer");
                }
            )
            .map(
                res => this.displayBrew(res)
            ).join("");
        if (content != "") {
            return this.displayStorageBox("Brassins", content);
        }
        return "";
    }
    
    private displayBrew(quantity : IQuantity) : string {
        let res = quantity.getResource();
        if (res instanceof Beer) {
            return '<div class="resource ' + res.$type + '">'
                + '<img src="images/' + res.image + '" title="' + quantity.getResource().getName() + '" alt="' + quantity.getResource().getName() + '" class="resource_img">'
                + '<div class="resource_label">'
                + res.getName() + ' (' + this.displayScore(res.recipe.score) + ')'
                + '</div>'
                + '</div>';
        } else {
            return "";
        }
    }
    
    private listRecipeReferences(): string {
        return this.engine.recipes
            .map(
                res => this.listRecipeReference(res)
            ).join("");
    }

    private listRecipeReference(recipe : RecipeReference): string {
        let h = '<div>';
        h += recipe.getName()
        h += '<button onclick="engine.prepareBrew(\''+recipe.getName()+'\')">Préparer</button>';
        h += "</div>";
        return h;
    }

    private displayPlayerRecipes(): string {
        return this.engine.player.getRecipes()
            .map(
                res => this.displayPlayerRecipe(res)
            ).join("");
    }
    
    private displayPlayerRecipe(recipe : Recipe) : string {
        let h = '<div style="display: inline-block;"><table border="1">';
        h += '<tr><th>'+Gui.htmlEntities(recipe.getName())+'</th><th colspan="2">À partir de: '+recipe.recipeRef?.getName()+'</th></tr>';

        recipe.getCookingSteps().forEach(
            res => h += this.displayCookingStep(res)
        );
        h += '<tr><td colspan="3"><button onclick="engine.reprepareBrew(\''+recipe.getName()+'\')">Préparer</button></td></tr>';
        h += "</table></div>";
        return h;
    }

    private displayCookingStep(step : ICookingStep) : string {
        let h = '<tr>';
        h += '<td><img src="images/' + step.getImage() + '" title="' + step.getName() + '" alt="' + step.getName() + '" class="resource_img"></td>';

        let params = step.getStepParameters();
        for (let paramIndex = 0 ; paramIndex < 2 ; paramIndex++) {
            if (paramIndex < params.length) {
                let param = params[paramIndex];
                if (param.name == 'durée') {
                    h += '<td><div title="' + param.name + '">' + this.displayTime(param.value) + '</div></td>';
                } else if (param.name == 'jours') {
                    h += '<td><div title="' + param.name + '">' + this.displayTime(param.value) + '</div></td>';
                } else if (param.name == 'température') {
                    h += '<td><div title="' + param.name + '">' + param.value + '°C</div></td>';
                } else if (param.resource != null) {
                    h += '<td><div title="' + param.name + '">' + this.displayQuantity(Q(param.value, param.resource)) + '</div></td>';
                } else {
                    h += '<td><div title="' + param.name + '">' + param.value + '</div></td>';
                }
            } else {
                h += '<td>&nbsp;</td>';
            }
        }
        h += "</tr>";
        return h;
    }

    private editBrewingRecipe() : string {
        let r = engine.player.getBrewingRecipe();
        if (r == null) {
            return "";
        }
        return this.editRecipe(r);
    }
    private editRecipe(recipe : Recipe) : string {
        let h = '<div style="display: inline-block;"><table border="1">';
        h += '<tr><th colspan="3">Brassée partir de: '+recipe.recipeRef?.getName()+'</th></tr>';
        h += '<tr>';
        h += '<td>Nom: </td>';
        h += '<td colspan="2"><input type="text" id="recipeName" value="'+recipe.getName()+'" /></td>';
        h += '<td><b>Note:</b> '+this.displayScore(recipe.score)+'</td>';
        h += '<td><span class="problem"><b>Problème:</b> '+(recipe.problem!=null?recipe.problem:"")+'</span>';
        h += '<span class="advice"><b>Conseils:</b></span></td>';
        h += '</tr>';

        recipe.getCookingSteps().forEach(
            (step,i) => h += this.editCookingStep(i, step)
        );
        h += '<tr>'
        let disabled = recipe.hasProblem() || recipe.analysisLevel == AnalysisLevel.NONE ? 'disabled="disabled" title="On ne brasse pas une bière problématique. Vérifier d\'abord. "' : '';
        h += '<td colspan="3"><button onclick="engine.brew()" '+ disabled+'>Brasser!</button>';
        h += '<button onclick="engine.analyseBrew()">Vérifier</button></td>';
        h += '<td>&nbsp;</td>';
        let storageRes = this.engine.player.getResourceInStorage(ADVISE_COST.getResource().getName());
        let cssClass = 'notAvailableResource';
        if (storageRes != null && storageRes.getQuantity() >= ADVISE_COST.getQuantity()) {
            cssClass = 'availableResource';
        }
        h += '<td><button onclick="engine.advise()">Conseils '+this.displayQuantity(ADVISE_COST, cssClass)+'</button></td>';
        h += '</tr>'
        h += "</table></div>";
        return h;
    }

    private editCookingStep(index : number, step : ICookingStep) : string {
        let h = '<tr id="'+index+'">';
        h += '<td><img src="images/' + step.getImage() + '" title="' + step.getName() + '" alt="' + step.getName() + '" class="resource_img"><input type="hidden" id="'+index+'_type" value="'+step.$type+'" /></td>';
        h += this.editStepParameters(step.getStepParameters(), index);
        h += '<td>'+step.getStepParameters().map(p => this.displayScore(p.score)).join(', ') 
            + " = " + this.displayScore(step.getStepParameters().map(p => p.score!=null?p.score:0).reduce((a, b) => Math.min(a, b), 1))+'</td>';
        h += '<td><span class="problem">'+step.getStepParameters().map(p => p.problem).filter(p => p!=null&&p!="").join(', ')+'</span>';
        h += '<span class="advice">'+step.getStepParameters().map(p => p.advice).filter(p => p!=null&&p!="").join(', ')+'</span></td>';
        h += "</tr>";
        return h;
    }
    
    private displayScore(score : number| null) : string {
        return (score!=null?Math.round(score * 100) / 10:'-')+'/10';    
    }
    
    private editStepParameters(params: Array<StepParameter>, index: number) {
        let h = '';
        for (let paramIndex = 0 ; paramIndex < 2 ; paramIndex++) {
            if (paramIndex < params.length) {
                let param = params[paramIndex];
                if (param.name == 'durée') {
                    h += '<td><div title="' + param.name + '"><input type="number" id="' + index + '_' + paramIndex + '_' + param.name + '" min="1" value="' + (param.value / MINUTE) + '" /> min</div></td>';
                } else if (param.name == 'jour') {
                    h += '<td><div title="' + param.name + '"><input type="number" id="' + index + '_' + paramIndex + '_'+param.name+'" min="1" value="' + (param.value / DAY) + '" /> jours</div></td>';
                } else if (param.name == 'température') {
                    h += '<td><div title="' + param.name + '"><input type="number" id="' + index + '_' + paramIndex + '_'+param.name+'" min="1" value="' + param.value + '" /> °C</div></td>';
                } else if (param.resource != null) {
                    h += '<td><div title="' + param.name + '">' + this.editQuantity(Q(param.value, param.resource), index, paramIndex) + '</div></td>';
                } else {
                    h += '<td><div title="' + param.name + '"><input type="number" id="' + index + '_' + paramIndex + '_other" min="1" value="' + param.value + '" /></div></td>';
                }
            } else {
                h += '<td>&nbsp;</td>';
            }
        }
        return h;
    }

    private displayStorageBox(title : string, content : string): string {
        let h = '<table border="1">';
        h += "<tr><th>"+title+"</th></tr>";
        h += "<tr><td>";
        h += content;
        h += "</td></tr>";
        h += "</table>";
        return h;
    }

    private displayStorageCategoryContent(category : string): string {
        return this.engine.player.getStorage()
            .filter(
                resQ =>
                {   
                    let resource = resQ.getResource();
                    return ('category' in resource) && (resource['category'] ==  category);
                }
            )
            .map(
                res => this.displayQuantity(res)
            ).join("");
    }
    
    private displayQuantities(quantities : Array<IQuantity>) : string {
        console.log("displayQuantities");
        return quantities.map(
                resQ => this.displayQuantity(resQ)
            )
            .join(' ');
    }
    private displayAvailableQuantities(quantities : Array<IQuantity>) : string {
        var h = '';
        quantities.forEach(
            resQ => {
                let storageRes = this.engine.player.getResourceInStorage(resQ.getResource().getName());
                let cssClass = 'notAvailableResource';
                if (storageRes != null && storageRes.getQuantity() >= resQ.getQuantity()) {
                    cssClass = 'availableResource';
                }
                h += this.displayQuantity(resQ, cssClass, storageRes)
            }
        );
        h += '';
        return h;
    }

    private displayQuantity(quantity : IQuantity, optionnalCss : string = '', storageRes : IQuantity | null = null) : string {
        let res : any = quantity.getResource();
        let image : string = '';
        if ('image' in res) {
            image = res.image;
        }
        let details : any = null;
        if ('getDetails' in quantity) {
            details = quantity['getDetails'];
        }
        return '<div class="resource ' + quantity.getResource().$type + ' ' + optionnalCss + '">'
            + '<div class="resource_label">'
            + ((storageRes!=null)?'<span>'+storageRes.show()+'</span>/':'')
            + quantity.show()
            + '</div>'
            + ((image=='')?quantity.getResource().getName() : '<img src="images/' + image + '" title="' + quantity.getResource().getName() + '" alt="' + quantity.getResource().getName() + '" class="resource_img">')
            + ((details != null)?details.call(quantity) : '')
            + '</div>';
    }
    
    private editQuantity(quantity : IQuantity, stepIndex : number, paramIndex : number, optionnalCss : string = '', storageRes : IQuantity | null = null) : string {
        let res : any = quantity.getResource();
        let image : string = '';
        if ('image' in res) {
            image = res.image;
        }
        let unit = '';
        if ('unit' in res) {
            unit = res.unit;
        }
        let details : any = null;
        if ('getDetails' in quantity) {
            details = quantity['getDetails'];
        }
        return '<div class="resource ' + quantity.getResource().$type + ' ' + optionnalCss + '">'
            + '<div class="resource_label">'
            + '<input type="number" id="'+stepIndex+'_'+paramIndex+'_quantité" min="1" value="'+quantity.getQuantity()+'" /> '+unit
            + ((storageRes!=null)?'/<span>'+storageRes.show()+'</span>':'')
            + '</div>'
            + ((image=='')?quantity.getResource().getName() : '<img src="images/' + image + '" title="' + quantity.getResource().getName() + '" alt="' + quantity.getResource().getName() + '" class="resource_img">')
            + ((details != null)?details.call(quantity) : '')
            + '</div>';
    }

    private displayTime(miliSeconds : number | null) : string {
        if (miliSeconds == null) {
            return '';
        }
        let time = '';
        if (miliSeconds >= (24*3600000)) {
            time += Math.round(miliSeconds / (24*3600000)) + 'j';
            miliSeconds = miliSeconds % (24*3600000);
        }
        if (miliSeconds >= 3600000) {
            time += Math.round(miliSeconds / 3600000) + 'h';
            miliSeconds = miliSeconds % 3600000;
        }
        if (miliSeconds >= 60000) {
            time += Math.round(miliSeconds / 60000) + 'min';
            miliSeconds = miliSeconds % 60000;
        }
        if (miliSeconds < 500 && time != "") {
            return time;
        }
        time += Math.round(miliSeconds / 1000) + 's';
        return time;
    }

    private displayDoc(): string {
        var h = '<table border="1">';
        h += "<tr><th></th><th>Nom</th><th>Catégorie</th><th>Description</th></tr>";

        resourceList.forEach(
            res => {
                h += "<tr>";
                    h += "<td>";
                        h += '<img src="images/' + res.image + '" title="' + res.getName() + '" alt="' + res.getName() + '" class="resource_img">'
                    h += "</td>";
                    h += "<td>";
                        h += res.getName()
                    h += "</td>";
                    h += "<td>";
                        h += res.category
                    h += "</td>";
                    h += "<td>";
                        h += res.description
                    h += "</td>";
                h += "</tr>";
            }
        );
        h += "</table>";
        return h;
    }
    
    public static htmlEntities(str : string) {
        return str.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
            return '&#'+i.charCodeAt(0)+';';
        });

    }
    
    private getSimple() : boolean {
        let checkbox = document.getElementById('simple');
        if (checkbox != null && ('checked' in checkbox) && checkbox['checked']) {
            return true;
        }
        return false;
    }
    
    private engineStatus : BrewerDwarfStatus = BrewerDwarfStatus.NOT_YET_STARTED;

    loose() {
        if (this.engine.status == BrewerDwarfStatus.LOOSE 
            && this.engineStatus != BrewerDwarfStatus.LOOSE) {
                this.endGame(false, "Tu as trop vomis c'est pas bien!! Tu aura plus de chance le(a) prochain(e) foie(s).");
                this.engineStatus = this.engine.status;
        }
        if (this.engine.status == BrewerDwarfStatus.WIN
            && this.engineStatus != BrewerDwarfStatus.WIN) {
                this.endGame(true, "C'est bien, tu as gagné ! Mais guette les prochaines évolutions du jeu.");
                this.engineStatus = this.engine.status;
        }
    }

    public endGame(win : boolean, raison : string) {
        let raisonDiv = document.getElementById('raison');
        if (raisonDiv != null) {
            raisonDiv.innerHTML = raison;
        }
        let overlayTitle = document.getElementById('overlayTitle');
        if (overlayTitle != null) {
            if (win) {
                overlayTitle.innerText = "Et c'est gagné!";
                overlayTitle.className = 'win';
            } else {
                overlayTitle.innerText = "Perdu!";
                overlayTitle.className = 'loose';
            }
        }
        let overlay = document.getElementById('overlay');
        if (overlay != null) {
            let o = overlay;
            o.className = 'show';
            window.setTimeout(() => {o.className += ' shade'}, 500);
        }
    }

    public static youWin(raison : string) {
        let raisonDiv = document.getElementById('raison');
        if (raisonDiv != null) {
            raisonDiv.innerHTML = raison;
        }
        let overlay = document.getElementById('overlay');
        if (overlay != null) {
            let o = overlay;
            o.className = 'show';
            window.setTimeout(() => {o.className += ' shade'}, 500);
        }
    }

    stop() {
        window.clearInterval(this.intervalId);
        engine.stop();
    }
    static eraseStorage() {
        window.localStorage.removeItem('BrewerDwarf');
        window.localStorage.removeItem('BrewerDwarfVersion');
        console.log('eraseStorage');
    }
    restart() {
        if (window.confirm('Ça va redémarrer le jeu depuis zéro. sûre?')) {
            Gui.eraseStorage();
            window.location.reload();
            Gui.eraseStorage();
            this.stop();
            Gui.eraseStorage();
        }
    }
    fastMode() {
        engine.fastMode=1000;
    }

    private updateGui() {
        NodeUpdate.updateDiv('level', this.displayLevel());
        NodeUpdate.updateDiv('brewing', this.listRecipeReferences());
        NodeUpdate.updateDiv('brew', this.editBrewingRecipe());
        NodeUpdate.updateDiv('storageIngredient', this.displayStorageCategory("Ingrédients", "Ingredient"));
        NodeUpdate.updateDiv('storageItem', this.displayStorageCategory("Items", "Item"));
        NodeUpdate.updateDiv('storageBeer', this.displayBrews());
        NodeUpdate.updateDiv('recipes', this.displayPlayerRecipes());
        NodeUpdate.updateDiv('doc', this.displayDoc());
        this.loose();
    }

    start(refreshInterval : number) {
        this.intervalId = window.setInterval(() => this.updateGui(), refreshInterval);
    }
}

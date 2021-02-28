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
/// <reference path="./model/AddIngredient.ts" />
/// <reference path="./model/Heat.ts" />
/// <reference path="./model/Cool.ts" />
/// <reference path="./model/Filter.ts" />
/// <reference path="./model/Brewing.ts" />
/// <reference path="./model/Recipe.ts" />
/// <reference path="./model/RecipeComparator.ts" />
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
    
    private listRecipes(): string {
        return this.engine.recipes
            .map(
                res => this.listRecipe(res)
            ).join("");
    }

    private listRecipe(recipe : Recipe): string {
        let h = '<div>';
        h += recipe.getName()
        h += '<button onclick="engine.brew(\''+recipe.getName()+'\')">Brasser</button>';
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
        h += '<tr><th colspan="3">'+recipe.getName()+'</th></tr>';

        recipe.getActions().forEach(
            res => h += this.displayCookingAction(res)
        );
        h += "</table></div>";
        return h;
    }

    private editRecipe(recipe : Recipe) : string {
        let h = '<div style="display: inline-block;"><table border="1">';
        h += '<tr><th colspan="3">'+recipe.getName()+'</th></tr>';

        recipe.getActions().forEach(
            res => h += this.displayCookingAction(res)
        );
        h += "</table></div>";
        return h;
    }

    private displayCookingAction(action : ICookingStep) : string {
        let h = '<tr>';
        h += '<td><img src="images/' + action.getImage() + '" title="' + action.getName() + '" alt="' + action.getName() + '" class="resource_img"></td>';
        if ('duration' in action) {
            h += '<td>'+this.displayTime(action['duration'])+'</td>';
        }
        if ('degrees' in action) {
            h += '<td>'+action['degrees']+'°C</td>';
        }
        if ('temperature' in action) {
            h += '<td>'+action['temperature']+'°C</td>';
        }
        if ('quantity' in action) {
            h += '<td>' + this.displayQuantity(action['quantity']) + '</td>';
        }
        h += "</tr>";
        return h;
    }

    private editCookingAction(index : number, action : ICookingStep) : string {
        let h = '<tr id="'+index+'">';
        h += '<td><img src="images/' + action.getImage() + '" title="' + action.getName() + '" alt="' + action.getName() + '" class="resource_img"></td>';
        h += '<td><input type="hidden" id="'+index+'_type" value="'+action.$type+'" />min</td>';
        if ('duration' in action) {
            h += '<td><input type="number" id="'+index+'_duration" min="1" value="'+(action['duration']/60000)+'" />min</td>';
        }
        if ('degrees' in action) {
            h += '<td><input type="number" id="'+index+'_degrees" min="1" value="'+action['degrees']+'" />°C</td>';
        }
        if ('temperature' in action) {
            h += '<td><input type="number" id="'+index+'_temperature" min="1" value="'+action['temperature']+'" />°C</td>';
        }
        if ('quantity' in action) {
            h += '<td><input type="number" id="'+index+'_quantity" min="1" value="'+action['quantity']+'" />°C</td>';
        }
        h += "</tr>";
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

    private displayProgress(startTime : Date | null, duration : number) : string {
        let progress = this.calculateProgress(startTime)
        return this.formatProgress(progress / duration, this.displayTime(duration - progress));
    }

    private calculateProgress(startTime : Date | null) : number {
        if (startTime == null) {
            return 0;
        }
        return (new Date().getTime() - startTime.getTime());
    }

    private formatProgress(percent01 : number, text : string) : string {
        var percent100 = Math.round(percent01 * 100);
        return '<progress value="' + percent100 + '" max="100">' + text + '</progress>';
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
        NodeUpdate.updateDiv('brewing', this.listRecipes());
        NodeUpdate.updateDiv('storageGlobal', this.displayStorageCategory("Ingrédients", "Ingredient"));
        NodeUpdate.updateDiv('recipes', this.displayPlayerRecipes());
        NodeUpdate.updateDiv('doc', this.displayDoc());
        this.loose();
    }

    start(refreshInterval : number) {
        this.intervalId = window.setInterval(() => this.updateGui(), refreshInterval);
    }
}

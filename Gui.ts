import { Level } from './Models/Resources/Level.js';
import { CategorizedMaterial } from './Models/Resources/CategorizedMaterial.js';
import { Beer } from './Models/Resources/Beer.js';
import { IRecipeReference } from './Models/IRecipeReference';
import { IRecipe } from './Models/IRecipe';
import { ADVISE_COST, GOLD, Q, resourceList } from './Scenario.js';
import { StepParameter } from './Models/CookingSteps/StepParameter.js';
import { IArticle } from './Models/IArticle';
import { NodeUpdate } from './Services/NodeUpdate.js';
import { BrewerDwarfStatus } from './Models/BrewerDwarfStatus.js';
import { IQuantity } from './Models/Resources/IQuantity.js';
import { ICookingStep } from './Models/CookingSteps/ICookingStep.js';
import { AnalysisLevel } from './Models/AnalysisLevel.js';
import { IResource } from './Models/Resources/IResource.js';
import { CategorizedItem } from './Models/Resources/CategorizedItem.js';
import { NamedStepResource } from './Models/Resources/NamedStepResource.js';
import { StorageManager } from './Services/StorageManager.js';
import { BrewerDwarfEngine } from './Services/BrewerDwarfEngine';

export class Gui {
    intervalId: number = 0;
    private engineStatus: BrewerDwarfStatus = BrewerDwarfStatus.NOT_YET_STARTED;

    private storageManager: StorageManager;

    constructor(private engine: BrewerDwarfEngine) {
        this.engine = engine;
    }

    public static htmlEntities(str: string) {
        return str.replace(/[\u00A0-\u9999<>&]/g, (i) => '&#' + i.charCodeAt(0) + ';');
    }

    public static youWin(raison: string) {
        const raisonDiv = document.getElementById('raison');
        if (raisonDiv != null) {
            raisonDiv.innerHTML = raison;
        }
        const overlay = document.getElementById('overlay');
        if (overlay != null) {
            const o = overlay;
            o.className = 'show';
            window.setTimeout(() => {
                o.className += ' shade';
            }, 500);
        }
    }

    static eraseStorage() {
        window.localStorage.removeItem('BrewerDwarf');
        window.localStorage.removeItem('BrewerDwarfVersion');
        console.log('eraseStorage');
    }

    loose() {
        if (this.engine.brewerDwarf.status == BrewerDwarfStatus.LOOSE && this.engineStatus != BrewerDwarfStatus.LOOSE) {
            this.endGame(false, "Tu as trop vomis c'est pas bien!! Tu aura plus de chance le(a) prochain(e) foie(s).");
            this.engineStatus = this.engine.brewerDwarf.status;
        }
        if (this.engine.brewerDwarf.status == BrewerDwarfStatus.WIN && this.engineStatus != BrewerDwarfStatus.WIN) {
            this.endGame(true, "C'est bien, tu as gagné ! Mais guette les prochaines évolutions du jeu.");
            this.engineStatus = this.engine.brewerDwarf.status;
        }
    }

    public endGame(win: boolean, raison: string) {
        const raisonDiv = document.getElementById('raison');
        if (raisonDiv != null) {
            raisonDiv.innerHTML = raison;
        }
        const overlayTitle = document.getElementById('overlayTitle');
        if (overlayTitle != null) {
            if (win) {
                overlayTitle.innerText = "Et c'est gagné!";
                overlayTitle.className = 'win';
            } else {
                overlayTitle.innerText = 'Perdu!';
                overlayTitle.className = 'loose';
            }
        }
        const overlay = document.getElementById('overlay');
        if (overlay != null) {
            const o = overlay;
            o.className = 'show';
            window.setTimeout(() => {
                o.className += ' shade';
            }, 500);
        }
    }

    stop() {
        window.clearInterval(this.intervalId);
        this.engine.stop();
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
        this.engine.brewerDwarf.fastMode = 1000;
    }

    start(refreshInterval: number) {
        this.intervalId = window.setInterval(() => this.updateGui(), refreshInterval);
    }

    private displayLevel(): string {
        const level = this.storageManager.getResourceInStorage('level');
        let h = '<strong>Level</strong>: ';
        if (level != null) {
            const q = level.getQuantity();
            const res = level.getResource();
            if (res instanceof Level) {
                h += q + ' ' + res.getStepName(q);
            }
        }
        return h;
    }

    private displayStorageCategory(title: string, category: string): string {
        const content = this.displayStorageCategoryContent(category);
        if (content != '') {
            return this.displayStorageBox(title, content);
        }
        return '';
    }

    private displayBrews(): string {
        const content = this.storageManager
            .getStorage()
            .filter((resQ: IQuantity) => {
                const resource = resQ.getResource();
                return resource instanceof CategorizedMaterial && resource.category == 'beer';
            })
            .map((res: IQuantity) => this.displayBrew(res))
            .join('');
        if (content != '') {
            return this.displayStorageBox('Brassins', content);
        }
        return '';
    }

    private displayBrew(quantity: IQuantity): string {
        const res = quantity.getResource();
        if (res instanceof Beer) {
            return (
                '<div class="resource ' +
                res.$type +
                '">' +
                '<img src="images/' +
                res.image +
                '" title="' +
                quantity.getResource().getName() +
                '" alt="' +
                quantity.getResource().getName() +
                '" class="resource_img">' +
                '<div class="resource_label">' +
                res.getName() +
                ' (' +
                this.displayScore(res.recipe.score) +
                ')' +
                '</div>' +
                '</div>'
            );
        } else {
            return '';
        }
    }

    private listRecipeReferences(): string {
        return this.engine.brewerDwarf.recipes.map((res) => this.listRecipeReference(res)).join('');
    }

    private listRecipeReference(recipe: IRecipeReference): string {
        let h = '<div>';
        h += recipe.name;
        h += '<button onclick="engine.prepareBrew(\'' + recipe.name + '\')">Préparer</button>';
        h += '</div>';
        return h;
    }

    private displayPlayerRecipes(): string {
        return this.engine.brewerDwarf.player.recipes.map((res: IRecipe) => this.displayPlayerRecipe(res)).join('');
    }

    private displayPlayerRecipe(recipe: IRecipe): string {
        let h = '<div style="display: inline-block;"><table border="1">';
        h += '<tr><th>' + Gui.htmlEntities(recipe.name) + ' (' + this.displayScore(recipe.score) + ')</th>';
        h += '<th colspan="2">À partir de: ' + recipe.recipeRef?.name + '</th></tr>';

        recipe.steps.forEach((res) => (h += this.displayCookingStep(res)));
        h += '<tr><td colspan="3"><button onclick="engine.prepareAgainBrew(\'' + recipe.name + '\')">Préparer</button></td></tr>';
        h += '</table></div>';
        return h;
    }

    private displayCookingStep(step: ICookingStep): string {
        let h = '<tr>';
        h +=
            '<td><img src="images/' +
            step.getImage() +
            '" title="' +
            step.getName() +
            '" alt="' +
            step.getName() +
            '" class="resource_img"></td>';

        const params = step.getStepParameters();
        for (let paramIndex = 0; paramIndex < 2; paramIndex++) {
            if (paramIndex < params.length) {
                const param = params[paramIndex];
                if (param.name == 'durée') {
                    h += '<td><div title="' + param.name + '">' + param.value + ' min</div></td>';
                } else if (param.name == 'jour') {
                    h += '<td><div title="' + param.name + '">' + param.value + ' jours</div></td>';
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
        h += '</tr>';
        return h;
    }

    private editBrewingRecipe(): string {
        const r = this.engine.brewerDwarf.player.brewingRecipe;
        if (r == null) {
            return '';
        }
        return this.editRecipe(r);
    }

    private editRecipe(recipe: IRecipe): string {
        let h = '<div style="display: inline-block;"><table border="1">';
        h += '<tr><th colspan="3">Brassée partir de: ' + recipe.recipeRef?.name + '</th></tr>';
        h += '<tr>';
        h += '<td>Nom: </td>';
        h += '<td colspan="2"><input type="text" id="recipeName" value="' + recipe.name + '" onchange="engine.checkBrew()" /></td>';
        h += '<td><b>Note:</b> ' + this.displayScore(recipe.score) + '</td>';
        h += '<td><span class="problem"><b>Problème:</b> ' + (recipe.problem != null ? recipe.problem : '') + '</span>';
        h += '<span class="advice"><b>Conseils:</b></span></td>';
        h += '</tr>';

        recipe.steps.forEach((step, i) => (h += this.editCookingStep(i, step)));
        h += '<tr>';
        const disabled =
            this.engine.brewingService.hasProblem(recipe) || recipe.analysisLevel == AnalysisLevel.NONE
                ? 'disabled="disabled" title="On ne brasse pas une bière problématique. Vérifier d\'abord. "'
                : '';
        h += '<td colspan="3"><button onclick="engine.brew()" ' + disabled + '>Brasser!</button>';
        h += '<td>&nbsp;</td>';
        const storageRes = this.storageManager.getResourceInStorage(ADVISE_COST.getResource().getName());
        let cssClass = 'notAvailableResource';
        if (storageRes != null && storageRes.getQuantity() >= ADVISE_COST.getQuantity()) {
            cssClass = 'availableResource';
        }
        h += '<td><button onclick="engine.advise()">Conseils ' + this.displayQuantity(ADVISE_COST, cssClass) + '</button></td>';
        h += '</tr>';
        h += '</table></div>';
        return h;
    }

    private editCookingStep(index: number, step: ICookingStep): string {
        let h = '<tr id="' + index + '">';
        h +=
            '<td><img src="images/' +
            step.getImage() +
            '" title="' +
            step.getName() +
            '" alt="' +
            step.getName() +
            '" class="resource_img"><input type="hidden" id="' +
            index +
            '_type" value="' +
            step.$type +
            '" /></td>';
        h += this.editStepParameters(step.getStepParameters(), index);
        h +=
            '<td>' +
            step
                .getStepParameters()
                .map((p) => this.displayScore(p.score))
                .join(', ') +
            ' = ' +
            this.displayScore(
                step
                    .getStepParameters()
                    .map((p) => (p.score != null ? p.score : 0))
                    .reduce((a, b) => Math.min(a, b), 1),
            ) +
            '</td>';
        h +=
            '<td><span class="problem">' +
            step
                .getStepParameters()
                .map((p) => p.problem)
                .filter((p) => p != null && p != '')
                .join(', ') +
            '</span>';
        h +=
            '<span class="advice">' +
            step
                .getStepParameters()
                .map((p) => p.advice)
                .filter((p) => p != null && p != '')
                .join(', ') +
            '</span></td>';
        h += '</tr>';
        return h;
    }

    private displayScore(score?: number): string {
        return (score != null ? Math.round(score * 100) / 10 : '-') + '/10';
    }

    private editStepParameters(params: Array<StepParameter>, index: number) {
        let h = '';
        for (let paramIndex = 0; paramIndex < 2; paramIndex++) {
            if (paramIndex < params.length) {
                const param = params[paramIndex];
                if (param.name == 'durée') {
                    h +=
                        '<td><div title="' +
                        param.name +
                        '"><input type="number" id="' +
                        index +
                        '_' +
                        paramIndex +
                        '_' +
                        param.name +
                        '" min="1" value="' +
                        param.value +
                        '" onchange="engine.checkBrew()" /> min</div></td>';
                } else if (param.name == 'jour') {
                    h +=
                        '<td><div title="' +
                        param.name +
                        '"><input type="number" id="' +
                        index +
                        '_' +
                        paramIndex +
                        '_' +
                        param.name +
                        '" min="1" value="' +
                        param.value +
                        '" onchange="engine.checkBrew()" /> jours</div></td>';
                } else if (param.name == 'température') {
                    h +=
                        '<td><div title="' +
                        param.name +
                        '"><input type="number" id="' +
                        index +
                        '_' +
                        paramIndex +
                        '_' +
                        param.name +
                        '" min="1" value="' +
                        param.value +
                        '" onchange="engine.checkBrew()" /> °C</div></td>';
                } else if (param.resource != null) {
                    h +=
                        '<td><div title="' +
                        param.name +
                        '">' +
                        this.editQuantity(Q(param.value, param.resource), index, paramIndex) +
                        '</div></td>';
                } else {
                    h +=
                        '<td><div title="' +
                        param.name +
                        '"><input type="number" id="' +
                        index +
                        '_' +
                        paramIndex +
                        '_other" min="1" value="' +
                        param.value +
                        '" onchange="engine.checkBrew()" /></div></td>';
                }
            } else {
                h += '<td>&nbsp;</td>';
            }
        }
        return h;
    }

    private displayStorageBox(title: string, content: string): string {
        let h = '<table border="1">';
        h += '<tr><th>' + title + '</th></tr>';
        h += '<tr><td>';
        h += content;
        h += '</td></tr>';
        h += '</table>';
        return h;
    }

    private displayStorageCategoryContent(category: string): string {
        return this.storageManager
            .getStorageByCategory(category)
            .map((res: IQuantity) => this.displayQuantity(res))
            .join('');
    }

    private displayShop(): string {
        let h = this.engine.brewerDwarf.shopStorage.map((res) => this.displayArticle(res)).join('');
        h += this.storageManager.getStorageByCategory('beer').map((b: IQuantity) => {
            const res = b.getResource();
            if (res instanceof Beer) {
                return this.displaySellBrew(res.recipe);
            }
            return '';
        });
        return h;
    }

    private displaySellBrew(recipe: IRecipe): string {
        let disable = ' disable="disable"';
        const article = this.engine.brewingService.getArticle(recipe);
        if (this.storageManager.hasResources([article.cost.opposite()])) {
            disable = '';
        }
        let sell = 'Acheter';
        if (article.item.getResource().getName() == GOLD.getName()) {
            sell = 'Vendre';
        }
        return (
            '<div class="article">' +
            this.displayQuantity(article.item) +
            this.displayBrew(article.cost) +
            '<button onclick="engine.sellBrew(\'' +
            article.cost.getResource().getName() +
            '\')" ' +
            disable +
            '>' +
            sell +
            '</button>' +
            '</div>'
        );
    }

    private displayArticle(article: IArticle): string {
        const hasResource = this.storageManager.hasResources([article.cost]);
        const cssClass = hasResource ? 'availableResource' : 'notAvailableResource';
        const disable = hasResource ? '' : ' disabled="disabled"';
        const onclick = hasResource ? "engine.buy('" + article.item.getResource().getName() + "')" : '';
        const sell = article.item.getResource().getName() == GOLD.getName() ? 'Vendre' : 'Acheter';
        return (
            '<div class="article">' +
            this.displayQuantity(article.item) +
            this.displayQuantity(article.cost, cssClass) +
            `<button onclick="${onclick}" ${disable}>${sell}</button>` +
            '</div>'
        );
    }

    private displayQuantity(quantity: IQuantity, optionalCss: string = '', storageRes: IQuantity | null = null): string {
        const res: IResource = quantity.getResource();
        let image: string = '';
        if (res instanceof CategorizedItem || res instanceof CategorizedMaterial || res instanceof NamedStepResource) {
            image = res.image;
        }
        return (
            '<div class="resource ' +
            quantity.getResource().$type +
            ' ' +
            optionalCss +
            '">' +
            '<div class="resource_label">' +
            (storageRes != null ? '<span>' + storageRes.show() + '</span>/' : '') +
            quantity.show() +
            '</div>' +
            (image == ''
                ? quantity.getResource().getName()
                : '<img src="images/' +
                  image +
                  '" title="' +
                  quantity.getResource().getName() +
                  '" alt="' +
                  quantity.getResource().getName() +
                  '" class="resource_img">') +
            '</div>'
        );
    }

    private editQuantity(
        quantity: IQuantity,
        stepIndex: number,
        paramIndex: number,
        optionalCss: string = '',
        storageRes: IQuantity | null = null,
    ): string {
        const res: IResource = quantity.getResource();
        let image: string = '';
        if (res instanceof CategorizedItem || res instanceof CategorizedMaterial || res instanceof NamedStepResource) {
            image = res.image;
        }
        let unit = '';
        if (res instanceof CategorizedMaterial) {
            unit = res.unit;
        }
        return (
            '<div class="resource ' +
            quantity.getResource().$type +
            ' ' +
            optionalCss +
            '">' +
            '<div class="resource_label">' +
            '<input type="number" id="' +
            stepIndex +
            '_' +
            paramIndex +
            '_quantité" min="1" value="' +
            quantity.getQuantity() +
            '" onchange="engine.checkBrew()" /> ' +
            unit +
            (storageRes != null ? '/<span>' + storageRes.show() + '</span>' : '') +
            '</div>' +
            (image == ''
                ? quantity.getResource().getName()
                : '<img src="images/' +
                  image +
                  '" title="' +
                  quantity.getResource().getName() +
                  '" alt="' +
                  quantity.getResource().getName() +
                  '" class="resource_img">') +
            '</div>'
        );
    }

    private displayTime(milliSeconds: number | null): string {
        if (milliSeconds == null) {
            return '';
        }
        let time = '';
        if (milliSeconds >= 24 * 3600000) {
            time += Math.round(milliSeconds / (24 * 3600000)) + 'j';
            milliSeconds = milliSeconds % (24 * 3600000);
        }
        if (milliSeconds >= 3600000) {
            time += Math.round(milliSeconds / 3600000) + 'h';
            milliSeconds = milliSeconds % 3600000;
        }
        if (milliSeconds >= 60000) {
            time += Math.round(milliSeconds / 60000) + 'min';
            milliSeconds = milliSeconds % 60000;
        }
        if (milliSeconds < 500 && time != '') {
            return time;
        }
        time += Math.round(milliSeconds / 1000) + 's';
        return time;
    }

    private displayDoc(): string {
        let h = '<table border="1">';
        h += '<tr><th></th><th>Nom</th><th>Catégorie</th><th>Description</th></tr>';

        resourceList.forEach((res) => {
            h += '<tr>';
            h += '<td>';
            h += '<img src="images/' + res.image + '" title="' + res.getName() + '" alt="' + res.getName() + '" class="resource_img">';
            h += '</td>';
            h += '<td>';
            h += res.getName();
            h += '</td>';
            h += '<td>';
            h += res.category;
            h += '</td>';
            h += '<td>';
            h += res.description;
            h += '</td>';
            h += '</tr>';
        });
        h += '</table>';
        return h;
    }

    private getSimple(): boolean {
        const checkbox = document.getElementById('simple');
        return !!(checkbox != null && 'checked' in checkbox && checkbox['checked']);
    }

    private updateGui() {
        NodeUpdate.updateDiv('level', this.displayLevel());
        NodeUpdate.updateDiv('brewing', this.listRecipeReferences());
        NodeUpdate.updateDiv('brew', this.editBrewingRecipe());
        NodeUpdate.updateDiv('storageIngredient', this.displayStorageCategory('Ingrédients', 'Ingredient'));
        NodeUpdate.updateDiv('storageItem', this.displayStorageCategory('Items', 'Item'));
        NodeUpdate.updateDiv('storageBeer', this.displayBrews());
        NodeUpdate.updateDiv('recipes', this.displayPlayerRecipes());
        NodeUpdate.updateDiv('shop', this.displayShop());
        NodeUpdate.updateDiv('doc', this.displayDoc());
        this.loose();
    }
}

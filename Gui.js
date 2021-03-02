"use strict";
var Gui = (function () {
    function Gui(engine) {
        this.engine = engine;
        this.intervalId = 0;
        this.engineStatus = BrewerDwarfStatus.NOT_YET_STARTED;
        this.engine = engine;
    }
    Gui.prototype.displayLevel = function () {
        var level = this.engine.player.getResourceInStorage("level");
        var h = "<strong>Level</strong>: ";
        if (level != null) {
            var q = level.getQuantity();
            var res = level.getResource();
            if ('getStepName' in res) {
                var getStepName = res['getStepName'];
                h += q + " " + getStepName.call(res, q);
            }
        }
        return h;
    };
    Gui.prototype.displayStorageCategory = function (title, category) {
        var content = this.displayStorageCategoryContent(category);
        if (content != "") {
            return this.displayStorageBox(title, content);
        }
        return "";
    };
    Gui.prototype.listRecipeReferences = function () {
        var _this = this;
        return this.engine.recipes
            .map(function (res) { return _this.listRecipeReference(res); }).join("");
    };
    Gui.prototype.listRecipeReference = function (recipe) {
        var h = '<div>';
        h += recipe.getName();
        h += '<button onclick="engine.prepareBrew(\'' + recipe.getName() + '\')">Préparer</button>';
        h += "</div>";
        return h;
    };
    Gui.prototype.displayPlayerRecipes = function () {
        var _this = this;
        return this.engine.player.getRecipes()
            .map(function (res) { return _this.displayPlayerRecipe(res); }).join("");
    };
    Gui.prototype.displayPlayerRecipe = function (recipe) {
        var _this = this;
        var _a;
        var h = '<div style="display: inline-block;"><table border="1">';
        h += '<tr><th>' + Gui.htmlEntities(recipe.getName()) + '</th><th colspan="2">À partir de: ' + ((_a = recipe.recipeRef) === null || _a === void 0 ? void 0 : _a.getName()) + '</th></tr>';
        recipe.getCookingSteps().forEach(function (res) { return h += _this.displayCookingStep(res); });
        h += "</table></div>";
        return h;
    };
    Gui.prototype.displayCookingStep = function (step) {
        var h = '<tr>';
        h += '<td><img src="images/' + step.getImage() + '" title="' + step.getName() + '" alt="' + step.getName() + '" class="resource_img"></td>';
        var params = step.getStepParameters();
        for (var paramIndex = 0; paramIndex < 2; paramIndex++) {
            if (paramIndex < params.length) {
                var param = params[paramIndex];
                if (param.name == 'durée') {
                    h += '<td><div title="' + param.name + '">' + this.displayTime(param.value) + '</div></td>';
                }
                else if (param.name == 'jour') {
                    h += '<td><div title="' + param.name + '">' + this.displayTime(param.value) + '</div></td>';
                }
                else if (param.name == 'température') {
                    h += '<td><div title="' + param.name + '">' + param.value + '°C</div></td>';
                }
                else if (param.resource != null) {
                    h += '<td><div title="' + param.name + '">' + this.displayQuantity(Q(param.value, param.resource)) + '</div></td>';
                }
                else {
                    h += '<td><div title="' + param.name + '">' + param.value + '</div></td>';
                }
            }
            else {
                h += '<td>&nbsp;</td>';
            }
        }
        h += "</tr>";
        return h;
    };
    Gui.prototype.editRecipes = function () {
        var _this = this;
        return this.engine.player.getRecipes()
            .map(function (res) { return _this.editRecipe(res); }).join("");
    };
    Gui.prototype.editBrewingRecipe = function () {
        var r = engine.player.getBrewingRecipe();
        if (r == null) {
            return "";
        }
        return this.editRecipe(r);
    };
    Gui.prototype.editRecipe = function (recipe) {
        var _this = this;
        var _a;
        var h = '<div style="display: inline-block;"><table border="1">';
        h += '<tr><th colspan="3">Brassée partir de: ' + ((_a = recipe.recipeRef) === null || _a === void 0 ? void 0 : _a.getName()) + '</th></tr>';
        h += '<tr>';
        h += '<td>Nom: </td>';
        h += '<td colspan="2"><input type="text" id="recipeName" value="' + recipe.getName() + '" /></td>';
        h += '<td><b>Note:</b> ' + this.displayScore(recipe.score) + '</td>';
        h += '<td><b>Problème:</b> <span class="problem">' + (recipe.problem != null ? recipe.problem : "") + '</span></td>';
        h += '<td><b>Conseils:</b></td>';
        h += '</tr>';
        recipe.getCookingSteps().forEach(function (step, i) { return h += _this.editCookingStep(i, step); });
        h += '<tr><td colspan="3"><button onclick="engine.brew();return false;">Brasser!</button></tr>';
        h += "</table></div>";
        return h;
    };
    Gui.prototype.editCookingStep = function (index, step) {
        var _this = this;
        var h = '<tr id="' + index + '">';
        h += '<td><img src="images/' + step.getImage() + '" title="' + step.getName() + '" alt="' + step.getName() + '" class="resource_img"><input type="hidden" id="' + index + '_type" value="' + step.$type + '" /></td>';
        h += this.editStepParameters(step.getStepParameters(), index);
        h += '<td>' + step.getStepParameters().map(function (p) { return _this.displayScore(p.score); }).join(', ')
            + " = " + this.displayScore(step.getStepParameters().map(function (p) { return p.score != null ? p.score : 0; }).reduce(function (a, b) { return Math.min(a, b); }, 11)) + '</td>';
        h += '<td><span class="problem">' + step.getStepParameters().map(function (p) { return p.problem; }).filter(function (p) { return p != null && p != ""; }).join(', ') + '</span></td>';
        h += '<td><span class="advice">' + step.getStepParameters().map(function (p) { return p.advice; }).filter(function (p) { return p != null && p != ""; }).join(', ') + '</span></td>';
        h += "</tr>";
        return h;
    };
    Gui.prototype.displayScore = function (score) {
        return (score != null ? Math.round(score * 100) / 10 : '-') + '/10';
    };
    Gui.prototype.editStepParameters = function (params, index) {
        var h = '';
        for (var paramIndex = 0; paramIndex < 2; paramIndex++) {
            if (paramIndex < params.length) {
                var param = params[paramIndex];
                if (param.name == 'durée') {
                    h += '<td><div title="' + param.name + '"><input type="number" id="' + index + '_' + paramIndex + '_' + param.name + '" min="1" value="' + (param.value / 60000) + '" /> min</div></td>';
                }
                else if (param.name == 'jour') {
                    h += '<td><div title="' + param.name + '"><input type="number" id="' + index + '_' + paramIndex + '_' + param.name + '" min="1" value="' + (param.value / (24 * 3600 + 1000)) + '" /> jours</div></td>';
                }
                else if (param.name == 'température') {
                    h += '<td><div title="' + param.name + '"><input type="number" id="' + index + '_' + paramIndex + '_' + param.name + '" min="1" value="' + param.value + '" /> °C</div></td>';
                }
                else if (param.resource != null) {
                    h += '<td><div title="' + param.name + '">' + this.editQuantity(Q(param.value, param.resource), index, paramIndex) + '</div></td>';
                }
                else {
                    h += '<td><div title="' + param.name + '"><input type="number" id="' + index + '_' + paramIndex + '_other" min="1" value="' + param.value + '" /></div></td>';
                }
            }
            else {
                h += '<td>&nbsp;</td>';
            }
        }
        return h;
    };
    Gui.prototype.displayStorageBox = function (title, content) {
        var h = '<table border="1">';
        h += "<tr><th>" + title + "</th></tr>";
        h += "<tr><td>";
        h += content;
        h += "</td></tr>";
        h += "</table>";
        return h;
    };
    Gui.prototype.displayStorageCategoryContent = function (category) {
        var _this = this;
        return this.engine.player.getStorage()
            .filter(function (resQ) {
            var resource = resQ.getResource();
            return ('category' in resource) && (resource['category'] == category);
        })
            .map(function (res) { return _this.displayQuantity(res); }).join("");
    };
    Gui.prototype.displayQuantities = function (quantities) {
        var _this = this;
        console.log("displayQuantities");
        return quantities.map(function (resQ) { return _this.displayQuantity(resQ); })
            .join(' ');
    };
    Gui.prototype.displayAvailableQuantities = function (quantities) {
        var _this = this;
        var h = '';
        quantities.forEach(function (resQ) {
            var storageRes = _this.engine.player.getResourceInStorage(resQ.getResource().getName());
            var cssClass = 'notAvailableResource';
            if (storageRes != null && storageRes.getQuantity() >= resQ.getQuantity()) {
                cssClass = 'availableResource';
            }
            h += _this.displayQuantity(resQ, cssClass, storageRes);
        });
        h += '';
        return h;
    };
    Gui.prototype.displayQuantity = function (quantity, optionnalCss, storageRes) {
        if (optionnalCss === void 0) { optionnalCss = ''; }
        if (storageRes === void 0) { storageRes = null; }
        var res = quantity.getResource();
        var image = '';
        if ('image' in res) {
            image = res.image;
        }
        var details = null;
        if ('getDetails' in quantity) {
            details = quantity['getDetails'];
        }
        return '<div class="resource ' + quantity.getResource().$type + ' ' + optionnalCss + '">'
            + '<div class="resource_label">'
            + ((storageRes != null) ? '<span>' + storageRes.show() + '</span>/' : '')
            + quantity.show()
            + '</div>'
            + ((image == '') ? quantity.getResource().getName() : '<img src="images/' + image + '" title="' + quantity.getResource().getName() + '" alt="' + quantity.getResource().getName() + '" class="resource_img">')
            + ((details != null) ? details.call(quantity) : '')
            + '</div>';
    };
    Gui.prototype.editQuantity = function (quantity, stepIndex, paramIndex, optionnalCss, storageRes) {
        if (optionnalCss === void 0) { optionnalCss = ''; }
        if (storageRes === void 0) { storageRes = null; }
        var res = quantity.getResource();
        var image = '';
        if ('image' in res) {
            image = res.image;
        }
        var unit = '';
        if ('unit' in res) {
            unit = res.unit;
        }
        var details = null;
        if ('getDetails' in quantity) {
            details = quantity['getDetails'];
        }
        return '<div class="resource ' + quantity.getResource().$type + ' ' + optionnalCss + '">'
            + '<div class="resource_label">'
            + '<input type="number" id="' + stepIndex + '_' + paramIndex + '_quantité" min="1" value="' + quantity.getQuantity() + '" /> ' + unit
            + ((storageRes != null) ? '/<span>' + storageRes.show() + '</span>' : '')
            + '</div>'
            + ((image == '') ? quantity.getResource().getName() : '<img src="images/' + image + '" title="' + quantity.getResource().getName() + '" alt="' + quantity.getResource().getName() + '" class="resource_img">')
            + ((details != null) ? details.call(quantity) : '')
            + '</div>';
    };
    Gui.prototype.displayTime = function (miliSeconds) {
        if (miliSeconds == null) {
            return '';
        }
        var time = '';
        if (miliSeconds >= (24 * 3600000)) {
            time += Math.round(miliSeconds / (24 * 3600000)) + 'j';
            miliSeconds = miliSeconds % (24 * 3600000);
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
    };
    Gui.prototype.displayDoc = function () {
        var h = '<table border="1">';
        h += "<tr><th></th><th>Nom</th><th>Catégorie</th><th>Description</th></tr>";
        resourceList.forEach(function (res) {
            h += "<tr>";
            h += "<td>";
            h += '<img src="images/' + res.image + '" title="' + res.getName() + '" alt="' + res.getName() + '" class="resource_img">';
            h += "</td>";
            h += "<td>";
            h += res.getName();
            h += "</td>";
            h += "<td>";
            h += res.category;
            h += "</td>";
            h += "<td>";
            h += res.description;
            h += "</td>";
            h += "</tr>";
        });
        h += "</table>";
        return h;
    };
    Gui.htmlEntities = function (str) {
        return str.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
            return '&#' + i.charCodeAt(0) + ';';
        });
    };
    Gui.prototype.getSimple = function () {
        var checkbox = document.getElementById('simple');
        if (checkbox != null && ('checked' in checkbox) && checkbox['checked']) {
            return true;
        }
        return false;
    };
    Gui.prototype.loose = function () {
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
    };
    Gui.prototype.endGame = function (win, raison) {
        var raisonDiv = document.getElementById('raison');
        if (raisonDiv != null) {
            raisonDiv.innerHTML = raison;
        }
        var overlayTitle = document.getElementById('overlayTitle');
        if (overlayTitle != null) {
            if (win) {
                overlayTitle.innerText = "Et c'est gagné!";
                overlayTitle.className = 'win';
            }
            else {
                overlayTitle.innerText = "Perdu!";
                overlayTitle.className = 'loose';
            }
        }
        var overlay = document.getElementById('overlay');
        if (overlay != null) {
            var o_1 = overlay;
            o_1.className = 'show';
            window.setTimeout(function () { o_1.className += ' shade'; }, 500);
        }
    };
    Gui.youWin = function (raison) {
        var raisonDiv = document.getElementById('raison');
        if (raisonDiv != null) {
            raisonDiv.innerHTML = raison;
        }
        var overlay = document.getElementById('overlay');
        if (overlay != null) {
            var o_2 = overlay;
            o_2.className = 'show';
            window.setTimeout(function () { o_2.className += ' shade'; }, 500);
        }
    };
    Gui.prototype.stop = function () {
        window.clearInterval(this.intervalId);
        engine.stop();
    };
    Gui.eraseStorage = function () {
        window.localStorage.removeItem('BrewerDwarf');
        window.localStorage.removeItem('BrewerDwarfVersion');
        console.log('eraseStorage');
    };
    Gui.prototype.restart = function () {
        if (window.confirm('Ça va redémarrer le jeu depuis zéro. sûre?')) {
            Gui.eraseStorage();
            window.location.reload();
            Gui.eraseStorage();
            this.stop();
            Gui.eraseStorage();
        }
    };
    Gui.prototype.fastMode = function () {
        engine.fastMode = 1000;
    };
    Gui.prototype.updateGui = function () {
        NodeUpdate.updateDiv('level', this.displayLevel());
        NodeUpdate.updateDiv('brewing', this.listRecipeReferences());
        NodeUpdate.updateDiv('brew', this.editBrewingRecipe());
        NodeUpdate.updateDiv('storageGlobal', this.displayStorageCategory("Ingrédients", "Ingredient"));
        NodeUpdate.updateDiv('storageBeer', this.displayStorageCategory("Bières", "beer"));
        NodeUpdate.updateDiv('recipes', this.displayPlayerRecipes());
        NodeUpdate.updateDiv('doc', this.displayDoc());
        this.loose();
    };
    Gui.prototype.start = function (refreshInterval) {
        var _this = this;
        this.intervalId = window.setInterval(function () { return _this.updateGui(); }, refreshInterval);
    };
    return Gui;
}());
//# sourceMappingURL=Gui.js.map
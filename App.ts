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
/// <reference path="./NodeUpdate.ts" />

const VERSION = "0.1";

function loadEngine() : BrewerDwarf | null {

    let json = window.localStorage.getItem('BrewerDwarf');
    if (json != null) {
        if ((window.localStorage.getItem('BrewerDwarfVersion') != null)
            || (window.localStorage.getItem('BrewerDwarfVersion') == VERSION)) {
            let obj : BrewerDwarf = JSON.parse(json);
            console.log('load engine');
            let curContext : any = window;
            return curContext[obj.$type].load(obj);
        }
        console.log('wrong version');
    }
    console.log('no engine');
    return null;
}
function saveEngine(engine : BrewerDwarf) {
    window.localStorage.setItem('BrewerDwarf', JSON.stringify(engine));
    window.localStorage.setItem('BrewerDwarfVersion', VERSION);
}

var engine : BrewerDwarf;
let e = loadEngine();
if (!e) {
    engine = Scenario.initEngine();
} else {
    engine = e;
}

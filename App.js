"use strict";
var VERSION = "0.3";
function loadEngine() {
    var json = window.localStorage.getItem('BrewerDwarf');
    if (json != null) {
        if ((window.localStorage.getItem('BrewerDwarfVersion') != null)
            || (window.localStorage.getItem('BrewerDwarfVersion') == VERSION)) {
            var obj = JSON.parse(json);
            console.log('load engine');
            var curContext = window;
            return curContext[obj.$type].load(obj);
        }
        console.log('wrong version');
    }
    console.log('no engine');
    return null;
}
function saveEngine(engine) {
    window.localStorage.setItem('BrewerDwarf', JSON.stringify(engine));
    window.localStorage.setItem('BrewerDwarfVersion', VERSION);
}
var engine;
var e = loadEngine();
if (!e) {
    engine = Scenario.initEngine();
}
else {
    engine = e;
}
//# sourceMappingURL=App.js.map
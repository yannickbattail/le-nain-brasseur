import { IBrewerDwarf } from './Models/IBrewerDwarf';
import { Scenario } from './Scenario.js';
import { Gui } from './Gui.js';

export const VERSION = '0.4';

export function loadEngine(): IBrewerDwarf | null {
    const json = window.localStorage.getItem('BrewerDwarf');
    if (json != null) {
        if (window.localStorage.getItem('BrewerDwarfVersion') != null || window.localStorage.getItem('BrewerDwarfVersion') == VERSION) {
            const obj: IBrewerDwarf = JSON.parse(json);
            console.log('load engine');
            return IBrewerDwarf.load(obj);
        }
        console.log('wrong version');
    }
    console.log('no engine');
    return null;
}

export function saveEngine(engine: IBrewerDwarf) {
    window.localStorage.setItem('BrewerDwarf', JSON.stringify(engine));
    window.localStorage.setItem('BrewerDwarfVersion', VERSION);
}

export const engine: IBrewerDwarf = loadEngine() || Scenario.initEngine();

const gui = new Gui(engine);
gui.start(500);
engine.run(10000, saveEngine);

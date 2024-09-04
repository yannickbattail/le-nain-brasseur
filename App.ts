import { BrewerDwarf } from "./model/BrewerDwarf";
import { Scenario } from "./Scenario";
import { Gui } from "./Gui";

export const VERSION = "0.4";

export function loadEngine(): BrewerDwarf | null {
  const json = window.localStorage.getItem("BrewerDwarf");
  if (json != null) {
    if (
      window.localStorage.getItem("BrewerDwarfVersion") != null ||
      window.localStorage.getItem("BrewerDwarfVersion") == VERSION
    ) {
      const obj: BrewerDwarf = JSON.parse(json);
      console.log("load engine");
      const curContext: any = window;
      return curContext[obj.$type].load(obj);
    }
    console.log("wrong version");
  }
  console.log("no engine");
  return null;
}

export function saveEngine(engine: BrewerDwarf) {
  window.localStorage.setItem("BrewerDwarf", JSON.stringify(engine));
  window.localStorage.setItem("BrewerDwarfVersion", VERSION);
}

const e = loadEngine();
const engine = !e ? Scenario.initEngine() : e;

const gui = new Gui(engine);
gui.start(500);

engine.run(10000, saveEngine);

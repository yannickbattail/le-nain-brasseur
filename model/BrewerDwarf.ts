/// <reference path="./IResource.ts" />
/// <reference path="./IQuantity.ts" />
/// <reference path="./IPlayer.ts" />
/// <reference path="./Player.ts" />
/// <reference path="./Resource.ts" />
/// <reference path="./BrewerDwarfStatus.ts" />

class BrewerDwarf {
    public $type : string = 'BrewerDwarf';
    tickInterval : number = 100;
    fastMode : number = 0;
    private saveCallback: (engine: BrewerDwarf) => void = function () {};
    
    status : BrewerDwarfStatus = BrewerDwarfStatus.NOT_YET_STARTED;
    player : IPlayer = new Player("");
    
    private intervalId : number = 0;

    public static load(data : any) : BrewerDwarf {
        let curContext : any = window;
        let newObj : BrewerDwarf = new BrewerDwarf();
        newObj.tickInterval = data.tickInterval;
        newObj.status = data.status;
        newObj.player = curContext[data.player.$type].load(data.player);
        newObj.fastMode = data.fastMode;
        return newObj;
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

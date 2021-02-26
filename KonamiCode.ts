
class KonamiCode {
    private keyIndex: number = 0;
    private static readonly keyCodeList: Array<number> = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    private onKonamiCodeFunction: () => void

    public constructor(onKonamiCode: () => void) {
        this.onKonamiCodeFunction = onKonamiCode;
        let body = document.getElementsByTagName('body')[0];
        body.onkeydown = this.onKeydown.bind(this);
    }

    public onKeydown(e: KeyboardEvent) {
        if (e.keyCode == KonamiCode.keyCodeList[this.keyIndex]) {
            if (this.keyIndex == (KonamiCode.keyCodeList.length - 1)) {
                this.onKonamiCodeFunction();
                this.keyIndex = 0;
            } else {
                this.keyIndex++;
            }
        } else {
            this.keyIndex = 0;
        }
    }
}
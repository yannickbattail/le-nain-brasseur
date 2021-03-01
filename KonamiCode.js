"use strict";
var KonamiCode = (function () {
    function KonamiCode(onKonamiCode) {
        this.keyIndex = 0;
        this.onKonamiCodeFunction = onKonamiCode;
        var body = document.getElementsByTagName('body')[0];
        body.onkeydown = this.onKeydown.bind(this);
    }
    KonamiCode.prototype.onKeydown = function (e) {
        if (e.keyCode == KonamiCode.keyCodeList[this.keyIndex]) {
            if (this.keyIndex == (KonamiCode.keyCodeList.length - 1)) {
                this.onKonamiCodeFunction();
                this.keyIndex = 0;
            }
            else {
                this.keyIndex++;
            }
        }
        else {
            this.keyIndex = 0;
        }
    };
    KonamiCode.keyCodeList = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    return KonamiCode;
}());
//# sourceMappingURL=KonamiCode.js.map
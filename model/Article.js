"use strict";
var Article = (function () {
    function Article(resource, cost) {
        this.resource = resource;
        this.cost = cost;
        this.$type = 'Article';
    }
    Article.load = function (data) {
        var curContext = window;
        var res = curContext[data.resource.$type].load(data.resource);
        var cost = curContext[data.cost.$type].load(data.cost);
        var rq = new Article(res, cost);
        return rq;
    };
    return Article;
}());
//# sourceMappingURL=Article.js.map
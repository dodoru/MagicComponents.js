/*
* - 201807:
*   - 移除所有 let `` 等 ES 新特性
*   - 兼容 IE  浏览器
*   - 不要再浪费时间精力情绪去劝别人停止使用各种以IE为内核的国产浏览器
* - depends:
*   - magic_utils
* */

var MagicRouter = function() {
    this.routes = {};
    this.baseUrl = "";
    this.query = {};
    this.hashPrefix = "#/";
    // hash 的形式如 `#/view?id=1`
};

var currentHashKVAdd = function(key, value) {
    var hash = window.location.hash;
    var m, qs = utils.splitPair(hash, "#");    // m = "" || "$route"
    var args = utils.argsFromQuery(qs);
    args[key] = value;
    var qs2 = utils.queryString(args);
    window.location.hash = m + "?" + qs2;
    console.log("HASH-CU", m, qs, qs2);
};

var currentHashKVDel = function(keys) {
    var hash = window.location.hash;
    var m, qs = utils.splitPair(hash, "#");    // m = "" || "$route"
    var args = utils.argsFromQuery(qs);
    if (typeof keys === "string") {
        delete args[keys];
    } else {
        for (var k of keys) {
            delete args[k];
        }
    }
    var qs2 = utils.queryString(args);
    window.location.hash = m + "?" + qs2;
    console.log("HASH-D", m, qs, qs2);
};

MagicRouter.prototype = {
    constructor: MagicRouter,
    route: function(path, callback) {
        var handler = null;
        if (callback) {
            handler = callback;
        } else {
            handler = function() {
            };
        }
        // 绑定 route 的时候
        // 期望执行回调函数
        this.action = true;
        this.routes[path] = handler;
    },
    _formatted: function() {
        var c = this.hashPrefix.length;
        var hash = location.hash.slice(c);
        if (hash.includes("?")) {
            var pair = hash.split("?");
            var route = pair[0];
            var query = pair[1];
            var args = utils.argsFromQuery(query);
            this.baseUrl = route;
            this.query = args;
            return {
                route: route,
                args: args,
            };
        } else {
            return null;
        }
    },
    refresh: function() {
        var r = this._formatted();
        if (r !== null) {
            if (this.action) {
                this.routes[r.route](r.args);
            }
        }
    },
    init: function() {
        var self = this;
        $(window).on("hashchange", function() {
            self.refresh();
        });
    },

};

var singleRouter = (function() {
    var instance = null;
    return function() {
        if (instance === null) {
            instance = new MagicRouter();
            instance.init();
        }

        return instance;
    };
})();


var singleRouterSample = function() {
    // 路由单例
    var router = singleRouter();
    // 注册路由函数
    router.route("debug", function() {
        console.log("debug", router.baseUrl, router.query, router);
        //** custom loading Page here **
    });
    $(window).trigger("hashchange");
    return router;
};

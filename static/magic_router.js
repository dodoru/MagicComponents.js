var utils = {
    argsFromQuery: function(query) {
        var args = {}
        var parameter = query.split('&')
        parameter.forEach(function(e, i) {
            var pair = e.split('=')
            var k = decodeURIComponent(pair[0])
            var v = decodeURIComponent(pair[1])
            args[k] = v
        })

        return args
    },
    urlFromQuery: function(baseUrl, Query) {
        var keys = Object.keys(Query)
        var args = keys.map(function(e, i) {
            var s = `${e}=${Query[e]}`
            return s
        }).join('&')
        var url = baseUrl + '?' + args
        return url
    },
}



var Router = function() {
    this.routes = {}
    this.baseUrl = ''
    this.query = {}
    this.hashPrefix = '#/'
    // hash 的形式如, #/view?id=1
}


Router.prototype = {
    constructor: Router,
    route: function(path, callback) {
        var handler = null
        if (callback) {
            handler = callback
        } else {
            handler = function() {
            }
        }
        // 绑定 route 的时候
        // 期望执行回调函数
        this.action = true
        this.routes[path] = handler
    },
    _formatted: function() {
        var c = this.hashPrefix.length
        var hash = location.hash.slice(c)
        if (hash.includes('?')) {
            var pair = hash.split('?')
            var route = pair[0]
            var query = pair[1]
            var args = utils.argsFromQuery(query)
            this.baseUrl = route
            this.query = args
            return {
                route: route,
                args: args,
            }
        } else {
            return null
        }
    },
    refresh: function() {
        var r = this._formatted()
        if (r !== null) {
            if (this.action) {
                this.routes[r.route](r.args)
            }
        }
    },
    init: function() {
        var self = this
        $(window).on('hashchange', function() {
            self.refresh()
        })
    },

}

var singleRouter = (function() {
    var instance = null
    return function() {
        if (instance === null) {
            instance = new Router()
            instance.init()
        }

        return instance
    }
})()


var simpleRouter = function() {
    // 路由用例
    var router = singleRouter()
    /*
    // 注册路由函数
    router.route('add', function() {
        log('add', router.query, router)
        loadPageAdd()
    })
    */

    $(window).trigger('hashchange')
}

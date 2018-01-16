// 常用的功能函数，部分依赖 jquery


const log = function() {
    console.log.apply(console, arguments)
}

const queryFromDict = function(dict) {
    var args = []
    for (var k in dict) {
        var v = dict[k]
        var arg = `${k}=${v}`
        args.push(arg)
    }
    var q = args.join('&')
    return q
}

const formToQuery = function(form, sep_kv = '&', sep_eq = '=') {
    let args = []
    for (let k in form) {
        let v = form[k]
        let arg = `${k}${sep_eq}${v}`
        args.push(arg)
    }
    let q = args.join(sep_kv)
    return q
}

const argsParser = function(string, sep_kv = '&', sep_eq = '=') {
    // a=b&b=2 => { a:'b', b:2 }
    var kvs = string.split(sep_kv)
    for (var kv of kvs) {
        var k = kv.split(sep_eq)[0]
        var v = kv.split(sep_eq)[1]
        args[k] = v
    }
    return args
}

const argsFromQuery = function(string) {
    // xxx?a=b&b=2 => { a:'b', b:2 }
    // 不能处理 a=b#foo 的情况
    var paras = string.split('?')
    if (paras.length >= 1) {
        var query = paras[1]
        var form = argsParser(query)
        return form
    }
}

const argsFromHash = function(prefix = '#?') {
    var hash = window.location.hash
    var args = argsParser(hash, prefix)
    return args
}


const locationHashAdd = function(key, value, prefix = '#?') {
    var args = argsFromHash(prefix)
    args[key] = value
    var query = queryFromDict(args)
    window.location.hash = '?' + query
    log('WINDOW. rehash', args, query)
}

const locationHashRemove = function(keys) {
    var args = argsFromHash()
    for (var k of keys) {
        // if (args.hasOwnProperty(k)) {
        // 直接 delete 也不会报错的, 所以不用判断了
        delete args[k]
        // }
    }
    var query = queryFromDict(args)
    window.location.hash = '?' + query
    log('WINDOW. removeHash', args, query)
}

// ***************************************************************** //

const magicSync = function(func) {
    setTimeout(function() {
        func()
    }, 0)
}

const magicPromise = function(func, then, ts = 0) {
    func()
    log('magicPromise', func)
    setTimeout(function() {
        then()
        log('magicPromise then', then, ts)
    }, ts)
    log('magicPromise done')
}

const magicHref = function(url, target = '_blank') {
    // 模拟点击超链接
    var m = document.createElement("a");
    document.body.appendChild(m);
    m.href = url;
    m.target = target;
    m.click();
    document.body.removeChild(m);
}

const magicHrefByForm = function(button, form, target = '_blank') {
    // button: 用于生成动态的超链接href的按钮（eg: .magic-submit-href）
    // return: 模拟构造并访问动态超链接，form 组成超链接的 query_string
    var path = button.dataset.path
    var hash = button.dataset.hash || ''
    var query = formToQuery(form)
    var url = path + '?' + query
    if (hash.startsWith('#')) {
        url = url + hash
    }
    magicHref(url, target)
}


// ***************************************************************** //
// 以下依赖 jquery

const scrollToSelector = function(self, top = 25) {
    if (typeof (self) === 'string') {
        self = $(self)
    }
    top = self.offset().top - top
    $('body').scrollTop(top)
}

function addCss(url) {
    var m = `<link rel="stylesheet" href="${url}">`;
    $('link').last().after(m)
}

function addJs(url) {
    var m = `<script src="${url}"></script>`;
    $('script').last().after(m)
}

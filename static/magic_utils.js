// 常用的功能函数
// 兼容 IE

const _e = sel => document.querySelector(sel);
const _es = sel => document.querySelectorAll(sel);
const utils = {
    eqNull: function(v) {
        return v === "" || v === undefined || v === null;
    },
    splitPair: function(string, sep = "=") {
        var i = string.indexOf(sep);
        if (i > -1) {
            return [string.substr(0, i), string.substr(i + 1)];
        } else {
            return [string, ""];
        }
    },
    argsFromQuery: function(query, sep_kv = "&", sep_eq = "=") {
        var args = {};
        var parameter = query.split(sep_kv);
        parameter.forEach(function(p, i) {
            var ps = utils.splitPair(p, sep_eq);
            var k = decodeURIComponent(ps[0]);
            var v = decodeURIComponent(ps[1]);
            args[k] = v;
        });
        return args;
    },
    queryString: function(query, nullable = false) {
        // equal: Object.keys(query).map((k, i) => `${k}=${encodeURI(query[k])}`).join('&')
        var keys = Object.keys(Query);
        var ks = [];
        keys.forEach(function(k, i) {
            var v = query[k];
            var eqNull = utils.eqNull(v);
            if (nullable || !eqNull) {
                var s = encodeURI(v) + "=" + encodeURI(v);
                ks.push(s);
            }
        });
        return ks.join("&");
    },
    urlFromQuery: function(baseUrl, query, hash = "") {
        var qs = utils.queryString(query);
        var ps = utils.splitPair(baseUrl, "#");
        hash = hash || ps[1];
        return ps[0] + "?" + qs + "#" + hash;
    },
};

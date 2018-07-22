// 使用 LocalStorage 为前端页面提供缓存
// 不兼容 IE

const magicStorage = {
    // 这里的 magicStorage 仅提供一个命名空间。
    _save: function(key, obj) {
        let s = JSON.stringify(obj);
        window.localStorage.setItem(key, s);
    },

    find: function(key) {
        let s = window.localStorage.getItem(key);
        if (typeof (s) === "string") {
            return JSON.parse(s);
        } else {
            return s || null;
        }
    },

    delete: function(key) {
        return window.localStorage.removeItem(key);
    },

    key: function(data, version) {
        let id = data;
        if (typeof (data) === "object") {
            id = data.id;
            version = version || data.version;
        } else {
            version = version || typeof (data);
        }
        return `m-${id}_${version}`;
    },

    save: function(data) {
        let k = magicStorage.key(data);
        magicStorage._save(k, data);
    },
};

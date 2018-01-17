var magicStorage = {
    // 这里的 magicStorage 仅提供一个命名空间。
    _save: function(key, obj) {
        let s = JSON.stringify(obj)
        window.localStorage.setItem(key, s)
    },

    find: function(key) {
        let s = window.localStorage.getItem(key)
        if (s != null) {
            let m = JSON.parse(s)
            return m
        }
    },

    delete: function(key) {
        let s = window.localStorage.removeItem(key)
        return (s)
    },

    key: function(data) {
        let mid = data.id
        let v = data.version
        let k = `magic_${mid}_${v}`
        return k
    },

    save: function(data) {
        let k = magicStorage.key(data)
        magicStorage._save(k, data)
    },

}

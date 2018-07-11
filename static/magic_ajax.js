/*
* @201807: 支持chrome, firefox, IE
* */

var magicAjax = {
    data: {},
};

magicAjax.ajax = function(url, method, form, callback, errorCallback = undefined) {
    method = method.toLowerCase();
    callback = callback || console.log;
    errorCallback = errorCallback || callback;
    var request = {
        url: url,
        type: method,
        contentType: 'application/json',
        success: function(r) {
            console.log('[LOG] magicAjax success', url, form, r);
            callback(r);
        },
        error: function(err) {
            var r = {
                success: false,
                data: err,
            };
            console.log('[LOG] magicAjax error', url, form, err);
            errorCallback(r);
        },
    };
    if (method === 'post') {
        request.data = JSON.stringify(form);
    }
    $.ajax(request);
};

// ***************************************************************** //

magicAjax.get = function(url, callback) {
    var method = 'get';
    this.ajax(url, method, {}, callback);
};

magicAjax.post = function(url, form, callback, errorCallback) {
    var method = 'post';
    this.ajax(url, method, form, callback, errorCallback);
};

magicAjax.upload = function(url, formData, callback, errorCallback) {
    // formData: 要用一个 FormData 对象来装 file
    errorCallback = errorCallback || callback || console.log;
    var request = {
        url: url,
        method: 'post',
        contentType: false,     // required!
        processData: false,     // required!
        data: formData,
        success: function(r) {
            callback(r);
        },
        error: function(err) {
            var r = {
                success: false,
                message: '上传文件失败',
                data: err,
            };
            errorCallback(r);
        },
    };
    $.ajax(request);
};

magicAjax.upload_file = function(url, key, fileObject, callback) {
    var formData = new FormData();
    formData.append(key, fileObject);
    this.upload(url, formData, callback);
};

magicAjax.upload_files = function(url, key, files, callback) {
    var formData = new FormData();
    var count = files.length;
    for (var i = 0; i < count; i++) {
        var ikey = key + '_' + i;
        formData.append(ikey, files[i]);
    }
    this.upload(url, formData, callback);
};

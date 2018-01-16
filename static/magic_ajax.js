var magicAjax = {
    data: {}
}

magicAjax.ajax = function(url, method, form, success, error) {
    method = method.toLowerCase()
    var request = {
        url: url,
        type: method,
        contentType: 'application/json',
        success: function(r) {
            log('[LOG] magixAjax success', url, r);
            success(r);
        },
        error: function(err) {
            r = {
                success: false,
                data: err
            }
            log('[LOG] magixAjax error', url, err, error);
            if (error != undefined) {
                error(r);
            }
        }
    };
    if (method === 'post') {
        var data = JSON.stringify(form);
        request.data = data;
    }
    $.ajax(request);
};

// ***************************************************************** //

magicAjax.get = function(url, response) {
    var method = 'get';
    var form = {}
    this.ajax(url, method, form, response, response);
}

magicAjax.post = function(url, form, success, error) {
    var method = 'post';
    this.ajax(url, method, form, success, error);
};

magicAjax.upload = function(url, formData, response) {
    // formData: 要用一个 FormData 对象来装 file
    var request = {
        url: url,
        method: 'post',
        // 下面这两个选项一定要加上
        contentType: false,
        processData: false,
        data: formData,
        success: function(r) {
            response(r)
        },
        error: function(err) {
            var r = {
                success: false,
                message: '上传文件失败',
                data: err
            };
            response(r)
        }
    }
    $.ajax(request)
}

magicAjax.upload_file = function(url, key, fileObject, response) {
    //上传一个文件
    var formData = new FormData()
    formData.append(key, fileObject)
    this.upload(url, formData, response)
}

magicAjax.upload_files = function(url, key, files, response) {
    //上传多个文件
    var formData = new FormData()
    var count = files.length
    for (var i = 0; i < count; i++) {
        var ikey = key + '_' + i
        formData.append(ikey, files[i])
    }
    this.upload(url, formData, response)
}
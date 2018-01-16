/*
结构层
.magic-auto-form

    .magic-input-file
    .magic-submit-file

    .magic-input
    .magic-submit
    .magic-submit-href

 */


var existAlertRequired = function(button) {
    // javascript 原生, 判断 parent 节点内是否存在没完成的必做题
    var parent = button.closest('.magic-auto-form')
    var alerts = parent.querySelectorAll('.alert-required')
    return alerts.length > 0
}


var checkRequireInputs = function(button, inputClass = '.magic-input') {
    // 依赖jquery, 检查输入, 并且返回是否通过
    var flag = true
    var inputs = $(button).closest('.magic-auto-form').find(inputClass)
    $(inputs).removeClass('alert-required')
    for (var input of inputs) {
        var self = $(input)
        var value = input.value.trim()
        var required = self.attr('required')
        if (value == '' && required == 'required') {
            $(input).addClass('alert-required')
            flag = false
        }
    }
    return flag
}


var magicForm = function(button, inputClass = '.magic-input') {
    /*
        <div class="magic-auto-form">
            <input class="magic-input" data-key="name">
            <button class="magic-submit"
                    data-path="/api/task/add"
                    data-method="post"
                    data-block="log">
                    submit
            </button>
        </div>
    * */
    var inputs = $(button).closest('.magic-auto-form').find(inputClass)
    var form = {}
    for (var input of inputs) {
        var value = input.value.trim()
        var key = input.dataset.key
        form[key] = value
    }
    return form
}


var magicReactForm = function(button, action = magicForm) {
    var path = button.dataset.path
    var method = button.dataset.method
    var block = button.dataset.block
    var response = eval(block)
    // action 是通过 button 获取表格的函数方法
    var form = action(button)
    magicAjax.ajax(path, method, form, response)
}


var magicUploadFiles = function(button, alertCallback) {
    /* 上传多个文件
        <div class="magic-auto-form">
            <input class="magic-input-file"
                   data-key="image"
                   type="file"
                   multiple>
            <button class="magic-submit-file"
                    data-path="/api/upload/images"
                    data-block="viewUploadedImages">
                    上传图片
            </button>
        </div>
    */
    var path = button.dataset.path
    // block 这个函数必须定义好, 这是回调
    var block = button.dataset.block

    // 注意，只有一个设置 multiple 的 input.magic-input-file
    var fileTag = $(button).closest('.magic-auto-form').find('.magic-input-file')[0]
    var filename = fileTag.dataset.key
    var files = fileTag.files;
    var count = files.length;
    if (count == 0) {
        // mark: 自定义提示上传功能
        if (alertCallback) {
            alertCallback()
        } else {
            alert('请选择文件')
        }
    } else {
        var response = eval(block)
        magicAjax.upload_files(path, filename, files, response)
    }
}


// ***************************************************************** //

// 自动提交表单
var bindMagicReactForm = function(success, fail) {
    $('body').on('click', '.magic-submit', function() {
        var e = this
        if (checkRequireInputs(e)) {
            magicReactForm(e)
            if (success != undefined) {
                success(e)
            }
        } else {
            if (fail != undefined) {
                fail(e)
            }
        }
    })
}

// 动态模拟超链接
var bindMagicHref = function(callback) {
    $('body').on('click', '.magic-submit-href', function() {
        var e = this
        if (checkRequireInputs(e)) {
            form = magicForm(e)
            magicHrefByForm(e, form)
            if (callback != undefined) {
                callback(e)
            }
        }
    })
}

// 上传多个文件
var bindMagicUploadFiles = function(alertCallback) {
    $('body').on('click', '.magic-submit-file', function() {
        var e = this
        magicUploadFiles(e, alertCallback)
    })
}



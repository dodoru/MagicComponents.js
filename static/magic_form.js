/*
@201807: 支持chrome, firefox, IE
# depends:
 - magic_ajax.js
 - magic_util.js
*/

const existAlertRequired = function(button) {
    var parent = button.closest(".magic-auto-form");
    var alerts = parent.querySelectorAll(".alert-required");
    return alerts.length > 0;
};


const checkRequireInputs = function(button, inputClass = ".magic-input") {
    // 依赖jquery, 检查输入, 并且返回是否通过
    var flag = true;
    var inputs = $(button).closest(".magic-auto-form").find(inputClass);
    $(inputs).removeClass("alert-required");
    for (var input of inputs) {
        var self = $(input);
        var value = input.value.trim();
        var required = self.attr("required");
        if (value === "" && required === "required") {
            $(input).addClass("alert-required");
            flag = false;
        }
    }
    return flag;
};

const magicForm = function(button, inputClass = ".magic-input") {
    var inputs = $(button).closest(".magic-auto-form").find(inputClass);
    var form = {};
    for (var input of inputs) {
        var value = input.value.trim();
        var key = input.dataset.key;
        form[key] = value;
    }
    return form;
};


const magicSubmitForm = function(button, action = magicForm) {
    // 自动Ajax提交表单,  action 是通过 button 获取表单的函数方法
    var path = button.dataset.path;
    var method = button.dataset.method;
    var callback = button.dataset.callback;
    var response = eval(callback);
    var form = action(button);
    magicAjax.ajax(path, method, form, response);
};


const magicUploadFiles = function(button, alertCallback) {
    // 上传多个文件
    var path = button.dataset.path;
    var callback = button.dataset.callback;
    var tips = button.dataset.tips || "请选择文件";
    var container = $(button).closest(".magic-auto-form");
    if (!container) {
        return console.error("[NotInMagicForm]", button);
    }
    // 注意，只有一个设置 multiple 的 input.magic-input-file
    var fileInput = container.closest(".magic-auto-form")[0];
    var filename = fileInput.dataset.key;
    var files = fileInput.files;
    var count = files.length;
    if (count === 0) {
        // mark: 自定义提示上传功能
        alertCallback(tips);
    } else {
        var callbackFunc = eval(callback);
        magicAjax.upload_files(path, filename, files, callbackFunc);
    }
};


const magicHref = function(url, target = "_blank") {
    // 模拟点击超链接
    var m = document.createElement("a");
    document.body.appendChild(m);
    m.href = url;
    m.target = target;
    m.click();
    document.body.removeChild(m);
};

const magicHrefByForm = function(button, form, target = "_blank") {
    // 动态跳转当前页
    // button: 用于生成动态的超链接href的按钮（eg: .magic-submit-href）
    // return: 模拟构造并访问动态超链接，form 组成超链接的 query_string
    var path = button.dataset.path;
    var hash = button.dataset.hash || "";
    var query = utils.queryString(form);
    var url = path + "?" + query;
    if (hash.startsWith("#")) {
        url = url + hash;
    }
    magicHref(url, target);
};

// ***************************************************************** //

// 自动提交表单
const bindMagicSubmitForm = function(success, fail) {
    $("body").on("click", ".magic-submit", function() {
        var self = this;
        if (checkRequireInputs(self)) {
            magicSubmitForm(self);
            if (typeof (success) === "function") {
                success(self);
            }
        } else {
            if (typeof (fail) === "function") {
                fail(self);
            }
        }
    });
};

// 上传多个文件
const bindMagicUploadFiles = function(alertCallback) {
    $("body").on("click", ".magic-submit-file", function() {
        var self = this;
        magicUploadFiles(self, alertCallback);
    });
};

// 动态模拟超链接
const bindMagicHref = function(callback) {
    $("body").on("click", ".magic-submit-href", function() {
        var self = this;
        if (checkRequireInputs(self)) {
            var form = magicForm(self);
            magicHrefByForm(self, form);
            if (typeof (callback) === "function") {
                callback(self);
            }
        }
    });
};

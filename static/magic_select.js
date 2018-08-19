// *********************
/*
 ## 自定义的的 magic-select 组件，入口是 initMagicSelectionItems
 ### 用处：生成选择题模板，代替html原生的select-option
 ### 注意: 不支持 IE 浏览器(201807)
 ### 基本配置

 selectionData = {
     title: "城市",
     key: "city",
     required: true,
     multiple: false,
     options: [
             {
                 value: "北京",
                 text: "北京",
             },
             {
                value: "上海",
             },
             {
                value: "其他",
                remark: true,
             },
         ],
 }

 // key 是键值，title 是选择题显示的题干；
 // options 是选项数组，text 是显示项，value 是存入form的值
 //         默认的text值为value, 其中标注remark为true的可以填空补充
 // required 默认为 true, 必须选择；
 // multiple 默认为 false, 表示单选，使用radio样式；如果 true, 表示多选，使用checkbox样式；

 ### 使用说明

 1 手动加载某个选择题模板到页面的Node("#id-div-city")
 renderMagicSelection(selectionData, "#id-div-city")

 2 页面自动加载所有选择题的模板。
 // html 预定义
 <div class="magic-select-block"
     data-preset="true"
     data-preset_value="上海"
     data-key="city">
 </div>

 // 配置文件 定义所有选择题的 items

 items = [selectionData, ..., ]

 $(document).ready(function (){
    initMagicSelectionItems(items)
 })

 */

const templateOption = function(option, option_type = "checkbox") {
    let m = option;
    let text = m.text || m.value;
    let input = "";
    let tag = "";
    let remark = m.remark || false;
    if (remark) {
        input = `<input data-tag="remark" placeholder="(备注)">`;
        tag = "magic-remark";
    }
    return `
        <div class="magic-option ${tag}">
            <input class="magic-option-input" type="${option_type}" value="${m.value}" data-remark="${remark}">
            <label> ${text} </label>
            ${input}
        </div>
    `;
};

const templateSelection = function(data) {
    /*
     使用例子，返回模板
     data = {
         title: "城市",
         key: "city",
         required: true,
         multiple: false,
         options: [
                 {
                     value: "北京",
                     text: "北京",
                 },
                 {
                    value: "上海",
                 },
                 {
                    value: "其他",
                    remark: true,
                 },
             ],
        }
     * */
    var m = data;
    var multiple = m.multiple || false;
    var required = m.required || true;
    var option_type = "radio";
    if (multiple) {
        option_type = "checkbox";
    }
    var options = m.options.map(function(option) {
        return templateOption(option, option_type);
    }).join("");

    return `
        <div class="magic-select" data-key="${m.key}"
            data-required="${required}" data-multiple="${multiple}">
            <p class="magic-select-title"> ${m.title} </p>
            <div class="magic-select-options">
                ${options}
            </div>
        </div>
    `;
};

const renderMagicSelection = function(data, container_id) {
    // 例子 q = renderMagicSelection(surveyEmployCity, "#id-div-city")
    var t = templateSelection(data);
    var self = document.querySelector(container_id);
    self.insertAdjacentHTML("afterbegin", t);
    return self;
};

const renderMagicSelectionItems = function(items) {
    for (var m of items) {
        var key = m.key;
        var q = `.magic-select-block[data-key="${key}"]`;
        var e = document.querySelector(q);
        var t = templateSelection(m);
        e.insertAdjacentHTML("afterbegin", t);
    }
};

const presetMagicSelection = function() {
    var q = `.magic-select-block[data-preset="true"]`;
    var es = document.querySelectorAll(q);
    for (var e of es) {
        var key = e.dataset.key;
        var paras = e.dataset.preset_value.split("##");
        var value = paras[0];
        // '##' 是 remark 的分隔符
        var k = `.magic-select[data-key="${key}"] .magic-option input[value="${value}"]`;
        var m = document.querySelector(k);
        if (m != null) {
            m.click();
            if (m.dataset.remark === "true") {
                var remark = m.closest(".magic-option").querySelector("input[data-tag=\"remark\"]");
                remark.value = paras[1];
            }
        }
    }
};

const selectedMagicOptions = function(key, parent = document) {
    // key: 选择题的键值
    // parent：选择题的父节点，默认为 document
    // return: 返回所有已选的选项
    var q = `.magic-select[data-key="${key}"] .magic-option.selected`;
    return parent.querySelectorAll(q);
};

const clearMagicOptions = function(key, parent = document) {
    var es = selectedMagicOptions(key, parent);
    // es 是 NodeList对象，不能用 map 和 for-in
    for (var e of es) {
        e.classList.remove("selected");
        var q = e.querySelector(".magic-option-input");
        q.checked = false;
    }
};

const reactSelectionDisplay = function(element, value) {
    // element: 自定义的链式选择题（.magic-select.magic-select-react[data-react_target]），
    // target：要重新显示选项的选择题 (下一链）
    // return: 清零parent节点内已选择的选项，并只显示满足条件的选项。

    var data = element.dataset;
    var key = data.key;
    // value = value || magicSelectValues(key, element).join('')
    var target_id = data.react_target;

    // 当点击链式选择题的选项，会重置过滤显示下一链的选择题选项
    var target = document.querySelector(target_id);
    var options = target.querySelectorAll(".magic-option");
    for (var option of options) {
        // step1: 重置子链选择题的选项
        option.classList.remove("selected");
        var e = option.querySelector(".gua-option-input");
        e.checked = false;

        // step2: 判断选项是否显示的条件（.gua-option input[data-${key}]="${value}"）
        var v = e.dataset[key];
        if (v === value) {
            option.classList.remove("hidden");
        } else {
            option.classList.add("hidden");
        }
    }
};


const bindMagicSelection = function(callback) {
    $("body").on("click", ".magic-option", function(e) {
        var tsel = e.currentTarget;
        var psel = tsel.closest(".magic-select");
        var csel = tsel.querySelector(".magic-option-input");
        var data = psel.dataset;
        var key = data.key;

        var multiple = data.multiple;
        if (multiple === "false") {
            clearMagicOptions(key, psel);
            tsel.classList.add("selected");
            csel.checked = true;
            // 如果是链式选择题，进行链式反应,
            // mark: 目前仅支持单项选择题作为链式选择
            // jquery 用 hasClass, 原生用 classList.contains
            if (psel.classList.contains("magic-select-react")) {
                var value = csel.value;
                reactSelectionDisplay(psel, value);
            }

        } else {
            csel.checked = tsel.classList.toggle("selected");
        }
    });
};


// *********************
// 自动提交自定义的的 magic-select ，并且检查有效性。

const magicSelectValues = function(key, parent = document) {
    // key: 选择题的键值
    // parent：选择题的父节点，默认为 document
    // return: 返回所有已选的选项的值。
    var q = `.magic-select[data-key="${key}"] .magic-option.selected .magic-option-input`;
    var es = parent.querySelectorAll(q);
    var values = [];
    for (var e of es) {
        var v = e.value;
        if (e.dataset.remark === "true") {
            var m = e.closest(".magic-option").querySelector("input[data-tag=\"remark\"]");
            var mv = m.value;
            v += `##${mv}`;
        }
        values.push(v);
    }
    return values;
};

const magicSelectForm = function(parent = document) {
    // 获取 parent node 下所有的选择题组成的表格
    var ms = parent.querySelectorAll(".magic-select");
    var ds = {};
    for (var m of ms) {
        var data = m.dataset;
        var key = data.key;
        var options = magicSelectValues(key);
        var value = options.join("");
        ds[key] = value;

        // 检查必填的选项是否已经完成
        var required = data.required;
        var cls = m.classList;
        if (options.length === 0) {
            cls.add("invalid-input");
            if (required === "true") {
                cls.add("alert-required");
            }
        } else {
            cls.remove("alert-required");
            cls.remove("invalid-input");
        }
    }
    return ds;
};

const magicFormWithSelection = function(parent, inputClass = ".magic-input") {
    // 获取 parent node 下的有效表格, 包括自定义的选择题(.magic-select)
    // inputClass 有效输入的ClassTag（比如填空题）(默认 .magic-input)
    var ms = parent.querySelectorAll(inputClass);
    // 包含选择题的答案
    var form = magicSelectForm(parent);
    for (var m of ms) {
        var key = m.dataset.key;
        var value = m.value.trim();

        // 检查输入的有效值
        var cls = m.classList;
        if (value === "") {
            // 空的 value 就不加入 form
            cls.add("invalid-input");
            var required = m.getAttribute("required");
            if (required === "required") {
                cls.add("alert-required");
            }
        } else {
            form[key] = value;
            cls.remove("alert-required");
            cls.remove("invalid-input");
        }
    }
    return form;
};

const checkAlertRequired = function(parent = document) {
    // 判断 parent 节点内是否还有没完成的必做题
    var alerts = parent.querySelectorAll(".alert-required");
    return alerts.length === 0;
};


const magicAjaxWithSelection = function(button, formClass = ".magic-auto-form", alertCallback = log) {
    var data = button.dataset;
    var path = data.path;
    var method = data.method;
    var block = data.block;
    // block 这个函数必须定义好, 这是回调

    var self = button.closest(formClass);
    var form = magicFormWithSelection(self);

    var is_valid = checkAlertRequired(self);
    if (is_valid) {
        var callback = eval(block);
        magicAjax.ajax(path, method, form, callback);
    } else {
        alertCallback();
    }
};

const magicHrefWithSelection = function(button, formClass = ".magic-auto-form") {
    // 扩展 magic_utils.js 的 magicHref 模拟动态超链接的功能
    // .magic-auto-form 添加一种新的链接按钮，可以带上选择题的表值为参数
    var self = button.closest(formClass);
    var form = magicFormWithSelection(self);
    var is_valid = checkAlertRequired(self);
    if (is_valid) {
        magicHrefByForm(button, form);
    } else {
        console.log("MagicHrefWithSelection failed", form, button);
    }
};


const bindMagicAjaxWithSelection = function(button = ".gua-submit", callback) {
    $("body").on("click", button, function() {
        magicAjaxWithSelection(this, ".magic-auto-form", callback);
    });
};


const bindMagicHrefWithSelection = function(button = ".magic-submit-href-with-selection", callback) {
    callback = callback || console.log;
    $("body").on("click", button, function(event) {
        var e = event.currentTarget;
        magicHrefWithSelection(e);
        callback(e);
    });
};

// *********************
// magic-select 的使用方法
const autoMagicSelectionWorkFlow = function(items) {
    renderMagicSelectionItems(items);
    bindMagicSelection();
    bindMagicAjaxWithSelection();
    presetMagicSelection();
    // 渲染预设的问卷答案，必须在 bindEvents 后面
    bindMagicHrefWithSelection();
};

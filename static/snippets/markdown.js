const codeMirrorEditor = function(textareaId, theme = 'material') {
    if (CodeMirror != undefined) {

        var mirror = document.getElementById(textareaId);
        var options = {
            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: true,
            matchBrackets: true,
            viewportMargin: Infinity,
            theme: theme,
            lineNumberFormatter: function(num) {
                var s = String(num)
                for (var i = s.length; i < 3; i++) {
                    s = '0' + s
                }
                return s
            },
        };

        var css = `//cdn.bootcss.com/codemirror/5.19.0/theme/${theme}.css`;
        addCss(css)

        var editor = CodeMirror.fromTextArea(mirror, options);
        return editor;
    } else {
        log('failed, require CodeMirror.js')
    }

};

const highlightCode = function(query, lan = 'javascript') => {
    var exp = eval(`Prism.languages.${lan}`)
    var c = document.querySelector(query)
    if (c != null) {
        var html = Prism.highlight(c.innerText, exp)
        c.innerHTML = html
    }
}

const markCode = function(parent = document) {
    // 把 '.magic-md-content' 选择器中的内容， 高亮代码渲染后放到 '.magic-md-preview'
    var content = parent.querySelector('.magic-md-content')
    var html = marked(content.innerText)
    parent.querySelector('.magic-md-preview').innerHTML = html
    // 不能使用 content.innerHtml, 否则会被转译
    highlightCode('pre > code')
}


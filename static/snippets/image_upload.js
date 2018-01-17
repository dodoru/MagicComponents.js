/*
 使用说明
 0. 引用 <link href="//cdn.bootcss.com/dropzone/5.1.1/dropzone.css" rel="stylesheet">
 1. 引用 <script src="//cdn.bootcss.com/dropzone/5.1.1/dropzone.js"></script>
 2. 引用 <script src="{{ url_for('static', filename='js/image_upload.js') }}"></script>
 3. 添加 [data-upload] 目标选择元素的 css，撑开 dropzone 样式

 eg :
      <link href="//cdn.bootcss.com/dropzone/5.1.1/dropzone.css" rel="stylesheet">

      <textarea id="id-textarea-editor1" data-upload=".upload-image" rows="5" cols="10"></textarea>
      <!--注意组件会自动渲染 [data-upload] 指定的元素 -->

      <script src="//cdn.bootcss.com/jquery/3.1.0/jquery.min.js"></script>
      <script src="//cdn.bootcss.com/dropzone/5.1.1/dropzone.js"></script>
      <script src="{{ url_for('static', filename='js/image_upload.js') }}"></script>
      .upload-image {
          width: 100%;
          height: 200px;
          border: 1px solid #998f66;
      }
 * */

var log = console.log.bind(console)


class MagicDrop {
    constructor(options) {
        var {input, selector, ...option} = options
        this.selector = selector
        this.option = option
        this.input = input

        this.setup(input, selector)
        this.initDropzone()
        this.bindEvents()
    }

    static new(...args) {
        return new this(...args)
    }

    setup(input, selector) {
        var attribute = selector.slice(1)
        var c = selector[0]
        var tag
        if (c == '.') {
            tag = 'class'
        } else if (c == '#') {
            tag = 'id'
        } else {
            tag = 'data-name'
        }
        var html = `
            <div ${tag}="${attribute}">
                <div>拖动或点击上传图片(上传成功后点击图片即可以插入到输入框中)</div>
            </div>
        `
        $(input).after(html)
    }

    initDropzone() {
        this.dropzone = new Dropzone(this.selector, this.option)
    }

    bindEvents() {
        var zone = $(this.selector)
        zone.on('click', (event) => {
            var self = event.target
            var img = $(self).closest('.dz-preview').find('img')
            if (img.length > 0) {
                var path = $(img).data('path')
                this.insertImage(path)
            }
        })
    }

    insertImage(path) {
        var textarea = $(this.input)
        var img = `![](${path})\n`
        var history = textarea.val() + '\n'
        textarea.val(history + img)
    }
}

var initDrop = (input, upload_api) => {
    /*
     * input 是要填入图片地址的输入框
     * selector 是预览图片的 div 的选择器
     * upload_api 是上传图片的 api
     * callback 是上传成功后的回调函数
     * */
    var selector = input.dataset.upload
    var options = {
        input: input,
        selector: selector,
        url: upload_api,
        addRemoveLinks: true,
        success: (file, response) => {
            var zone = $(selector)
            var src = response.data
            zone.addClass('dropzone')
            var imgs = zone.find('img')
            var img = imgs[imgs.length - 1]
            img.dataset.path = src
        }
    }
    var d = MagicDrop.new(options)
}

var initUploadContainer = () => {
    // 输入框是下面这种形式，带了 data-upload 就可以
    // <textarea id="id-textarea-editor1" data-upload=".upload1"></textarea>
    var input = $('[data-upload]')
    if (input.length == 0) {
        return
    }
    var url = '/api/upload/file'
    for (var i of input) {
        initDrop(i, url)
    }
}


$(document).ready(function() {
    initUploadContainer()
})

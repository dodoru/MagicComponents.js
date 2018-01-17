var log = console.log.bind('console')

class ImageClipboard {
    constructor(selector, onpaste) {
        this.selector = selector
        this.onpaste = onpaste || log
        this.browserSupport = true
        this.pasteCatcher = null
        this.clipImage = null
    }

    init() {
        if (window.Clipboard === undefined) {
            log('custom clipboard')
            //pasting not supported, make workaround
            this.browserSupport = false
            this.pasteCatcher = ImageClipboard.makePasteCatcher()
        }
        this.bind_events()
        return this
    }

    bind_events() {
        var self = this
        window.addEventListener('paste', self.pasteHandler.bind(self), false)
        $('body').on('click', self.selector, function () {
            self.pasteCatcher.focus()
        })
        // element = document.querySelector(selector)
        // self.element.addEventListener("click", function () {
        //     self.pasteCatcher.focus()
        // })

        return self
    }


    pasteHandler(e) {
        var self = this
        var data = e.clipboardData
        // DataTransfer
        var items = data.items
        // DataTransferItemList
        if (items) {
            self.defaultPaste(items)
        } else {
            self.customPaste(e)
        }
    }

    defaultPaste(items) {
        var self = this
        var images = Array.prototype.filter.call(items, function (m) {
            return m.type.indexOf("image") >= 0
        })
        Array.prototype.forEach.call(images, function (image) {
            var blob = image.getAsFile()
            var file = new FileReader()
            file.onloadend = function () {
                self.loadImage(file.result)
            }
            file.readAsDataURL(blob)
        })
    }

    customPaste(e) {
        //no direct access to clipboardData (firefox)
        //use the pastecatcher
        log('custom', e, this)
        var self = this
        setTimeout(function () {
            var m = self.pasteCatcher.firstElementChild
            log('clip', m)
            if (m && m.tagName == "IMG") {
                self.loadImage(m.src)
            }
        }, 5)
    }


    loadImage(source) {
        // @source: data:image/png;base64,iVBORw0KG....
        log('load image', source.slice(0, 64))
        var m = ImageClipboard.createImage(source)
        var e = document.querySelector(this.selector)
        this.clipImage = m
        e.appendChild(m)
        this.onpaste(source)

        if (!this.browserSupport) {
            log('clear catch', m)
            this.pasteCatcher.innerHTML = ""
        }
    }

    static makePasteCatcher() {
        // content editable div
        var pasteBox = document.createElement("div")

        pasteBox.setAttribute("id", "paste_catcher")
        pasteBox.setAttribute("contenteditable", "")
        // pasteBox.style.opacity = 0
        pasteBox.style.display = 'none'
        document.body.insertBefore(pasteBox, document.body.firstChild)
        pasteBox.focus()
        return pasteBox
    }

    static createImage(source, className) {
        // var m = new Image()
        var m = document.createElement("img")
        m.src = source
        m.className = className || 'image-raw'
        return m
    }
}


# MagicComponents.js

- 作为后端开发, 为了偷懒(不想使用依赖过多的轮子和各种复杂的前端构件), 于是对快速生产前端Demo进行了一些套路总结
- 
- 建议后浪前往使用 react / Vue, 更容易找工作, 且工资更高 
- 依赖 jQuery , 兼容 Bootstrap , 需要操纵 DOM
- 原则: 简单易用, 即取即用, 容易扩展
- why magic? 仅仅因为起名废
- GITHUB: https://github.com/dodoru/MagicComponents.js

---
## Components
 - magic-ajax : 支持chrome, firefox, IE 等
 - magic-utils : 支持chrome, firefox, IE 等
 - magic-router: 支持chrome, firefox, IE 等
 * magic-form : 支持chrome, firefox, IE 等  (required: magic-[ajax.utils])
 * magic-select: 支持chrome/firefox, 不支持IE  (required: jQuery, ES6{let``})
 * magic-storage: 支持chrome/firefox, 不支持IE  (required: ES6{let``})

### Samples

####  Ajax动态提交表单 ".magic-auto-form"

 - Usage  
```html
<script src="//cdn.bootcss.com/jquery/3.2.0/jquery.min.js"></script>
<script src="./static/magic_ajax.js"></script>
<script src="./static/magic_form.js"></script>
```

- magicUploadFiles: 上传多个文件
   - .magic-input-file
   - .magic-submit-file
   - :eg: 
```html
    <div class="magic-auto-form">
        <input class="magic-input-file"
               data-key="image"
               type="file"
               multiple>
        <button class="magic-submit-file"
                data-path="/api/upload/images"
                data-callback="console.log">
                上传图片
        </button>
    </div>
    <script>bindMagicSubmitForm()</script>
```

- magicForm: 自动提交表单
   - .magic-input
   - .magic-submit
   - :eg:
```html
    <div class="magic-auto-form">
        <input class="magic-input" data-key="name">
        <button class="magic-submit"
                data-path="/$api-MagicForm"
                data-method="post"
                data-callback="console.log">
                submit
        </button>
    </div>
    <script>bindMagicUploadFiles()</script>
```

- magicHref: 
  - .magic-submit-href
  - :eg:
```html
    <div class="magic-auto-form">
        <h3> 模拟点击动态超链接 </h3>
        <input class="magic-input oval" data-key="id" placeholder="u动态跳转当前页ser_id">
        <button class="magic-submit-href btn-red"
                data-path="/$api-redirectPath">
            访问链接
        </button>
    </div>
    <script>bindMagicHref()</script>  
```

## Changes
- v2.0.0
    - magic_router 的 `Router` 重命名为 `MagicRouter` (201807)
    - 添加 `.editorconfig`,  统一使用 `;`, 拒绝靠运气编程, 更多讨论参考 
        - [JavaScript 语句后应该加分号么](https://www.zhihu.com/question/20298345)
        - [TC39 委员会正式写入 ES6 规格：请不要省略分号](https://www.v2ex.com/t/422243)
        - [JS的分号可以省掉吗？](https://blog.fundebug.com/2018/09/18/js-semicolon-bug/)
    - 移除类似`var log = function(){console.log.apply(console, arguments)};`的黑魔法, ES6不推荐使用 `arguments` (201807)
    - 整理`magic_utils`, 移除不常用的功能函数, 且  


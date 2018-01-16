/* magicSelect 例子
<div class="magic-auto-form">

    <select class="magic-input magic-auto-select"
            data-key="subject_id"
            data-target_id="#id-select-lessons"
            >

        <option value=""> 选择课程 </option>
        {% for m in subjects %}
            <option value="{{ m.id }}"> {{ m.id }} - {{ m.title }}</option>
        {% endfor %}

    </select>

    <select class="magic-input"
            data-key="lesson_id"
            id="id-select-lessons" required>

        <option value=""> 选择课次 </option>
        {% for l in lessons %}
            <option value="{{ l.id }}"
                    data-subject_id="{{ l.subject_id }}">
                第 {{ l.sequence }} 课
            </option>
        {% endfor %}

    </select>

    <button class="magic-submit-href"
            data-path="/api/lesson"
    > 查看课程
    </button>

</div>
*/

var originSelectChain = function(e, className = 'magic-auto-select') {
    var val = e.value
    var data = e.dataset
    var key = data.key
    var sid = data.target_id
    var options = `${sid} > option`
    $(options).addClass('hidden')

    if (val != '') {
        // 如果不为空，过滤选项的键值
        var opt_show = `${sid} > option[data-${key}=${val}]`
        $(opt_show).removeClass('hidden')
    }

    var child = $(sid)
    child.val('')
    if (child.hasClass(className)) {
        log(child)
        var m = child[0]
        originSelectChain(m)
    }
    // log(self, key, val, self)
}

var bindOriginSelectChain = function(className = 'magic-auto-select') {
    var q = `select.${className}`
    $(q).on('change', function(e) {
        var sel = e.target
        originSelectToggle(sel, className)
    })
}
